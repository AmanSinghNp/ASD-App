import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../utils/database";

dotenv.config();

const SECRET = process.env.JWT_SECRET!;

/**
 * Helper function to verify JWT token and get user info
 * @param authHeader - Authorization header from request
 * @returns User info if token is valid, null otherwise
 */
const getUserFromToken = (
  authHeader: string | undefined
): { id: string; role: string; name: string } | null => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET) as {
      id: string;
      role: string;
      name: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * POST /api/chat/sessions
 * Create a new chat session (F009 - Customer Support Chat)
 * @param req - Express request object with optional { subject } in body
 * @param res - Express response object
 */
export const createChatSession = async (req: Request, res: Response) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
    const { subject } = req.body;

    // Create chat session (user can be null for anonymous chats)
    const chatSession = await prisma.chatSession.create({
      data: {
        userId: user?.id || null,
        subject: subject || null,
        status: "open",
      },
    });

    res.status(201).json({
      message: "Chat session created",
      session: {
        id: chatSession.id,
        status: chatSession.status,
        subject: chatSession.subject,
        createdAt: chatSession.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Create chat session error:", error);
    res.status(500).json({
      error: "Failed to create chat session",
    });
  }
};

/**
 * GET /api/chat/sessions/:id
 * Get chat session with messages (F009 - Customer Support Chat)
 * @param req - Express request object with session ID in params
 * @param res - Express response object
 */
export const getChatSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = getUserFromToken(req.headers.authorization);

    // Get chat session with messages
    const chatSession = await prisma.chatSession.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chatSession) {
      return res.status(404).json({
        error: "Chat session not found",
      });
    }

    // Check access permissions
    // Users can only access their own sessions, staff can access any session
    if (user && user.role !== "STAFF" && user.role !== "ADMIN") {
      if (chatSession.userId !== user.id) {
        return res.status(403).json({
          error: "Access denied",
        });
      }
    }

    res.json({
      session: {
        id: chatSession.id,
        status: chatSession.status,
        subject: chatSession.subject,
        createdAt: chatSession.createdAt.toISOString(),
        updatedAt: chatSession.updatedAt.toISOString(),
        messages: chatSession.messages.map((message) => ({
          id: message.id,
          senderType: message.senderType,
          senderName: message.senderName,
          message: message.message,
          createdAt: message.createdAt.toISOString(),
        })),
      },
    });
  } catch (error: any) {
    console.error("Get chat session error:", error);
    res.status(500).json({
      error: "Failed to get chat session",
    });
  }
};

/**
 * POST /api/chat/sessions/:id/messages
 * Send a message to a chat session (F009 - Customer Support Chat)
 * @param req - Express request object with session ID in params and { message } in body
 * @param res - Express response object
 */
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const user = getUserFromToken(req.headers.authorization);

    // Input validation
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        error: "Message content is required",
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        error: "Message must be less than 1000 characters",
      });
    }

    // Check if chat session exists
    const chatSession = await prisma.chatSession.findUnique({
      where: { id },
    });

    if (!chatSession) {
      return res.status(404).json({
        error: "Chat session not found",
      });
    }

    // Check if session is still open
    if (chatSession.status !== "open") {
      return res.status(400).json({
        error: "Cannot send message to closed session",
      });
    }

    // Check access permissions
    if (user && user.role !== "STAFF" && user.role !== "ADMIN") {
      if (chatSession.userId !== user.id) {
        return res.status(403).json({
          error: "Access denied",
        });
      }
    }

    // Determine sender type and name
    let senderType: string;
    let senderName: string | null = null;

    if (user) {
      if (user.role === "STAFF" || user.role === "ADMIN") {
        senderType = "staff";
        senderName = user.name;
      } else {
        senderType = "customer";
        senderName = user.name;
      }
    } else {
      senderType = "customer";
      senderName = "Anonymous";
    }

    // Create message
    const chatMessage = await prisma.chatMessage.create({
      data: {
        sessionId: id,
        senderType,
        senderName,
        message: message.trim(),
      },
    });

    // Update session timestamp
    await prisma.chatSession.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    res.status(201).json({
      message: "Message sent successfully",
      chatMessage: {
        id: chatMessage.id,
        senderType: chatMessage.senderType,
        senderName: chatMessage.senderName,
        message: chatMessage.message,
        createdAt: chatMessage.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Send message error:", error);
    res.status(500).json({
      error: "Failed to send message",
    });
  }
};

/**
 * GET /api/chat/history
 * Get user's chat history (F009 - Customer Support Chat)
 * @param req - Express request object with JWT token
 * @param res - Express response object
 */
export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const user = getUserFromToken(req.headers.authorization);
    if (!user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    // Get user's chat sessions
    const chatSessions = await prisma.chatSession.findMany({
      where: { userId: user.id },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // Get only the latest message for preview
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.json({
      sessions: chatSessions.map((session) => ({
        id: session.id,
        status: session.status,
        subject: session.subject,
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
        lastMessage: session.messages[0]
          ? {
              senderType: session.messages[0].senderType,
              senderName: session.messages[0].senderName,
              message: session.messages[0].message,
              createdAt: session.messages[0].createdAt.toISOString(),
            }
          : null,
      })),
      total: chatSessions.length,
    });
  } catch (error: any) {
    console.error("Get chat history error:", error);
    res.status(500).json({
      error: "Failed to get chat history",
    });
  }
};

/**
 * PATCH /api/chat/sessions/:id/close
 * Close a chat session (F009 - Customer Support Chat)
 * @param req - Express request object with session ID in params
 * @param res - Express response object
 */
export const closeChatSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = getUserFromToken(req.headers.authorization);

    // Check if chat session exists
    const chatSession = await prisma.chatSession.findUnique({
      where: { id },
    });

    if (!chatSession) {
      return res.status(404).json({
        error: "Chat session not found",
      });
    }

    // Check access permissions
    if (user && user.role !== "STAFF" && user.role !== "ADMIN") {
      if (chatSession.userId !== user.id) {
        return res.status(403).json({
          error: "Access denied",
        });
      }
    }

    // Close the session
    const updatedSession = await prisma.chatSession.update({
      where: { id },
      data: {
        status: "closed",
        updatedAt: new Date(),
      },
    });

    res.json({
      message: "Chat session closed successfully",
      session: {
        id: updatedSession.id,
        status: updatedSession.status,
        updatedAt: updatedSession.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Close chat session error:", error);
    res.status(500).json({
      error: "Failed to close chat session",
    });
  }
};
