import express from "express";
import {
  createChatSession,
  getChatSession,
  sendMessage,
  getChatHistory,
  closeChatSession,
} from "../controllers/chatController";

const router = express.Router();

// POST /api/chat/sessions - Create new chat session
router.post("/sessions", createChatSession);

// GET /api/chat/sessions/:id - Get chat session with messages
router.get("/sessions/:id", getChatSession);

// POST /api/chat/sessions/:id/messages - Send message to chat session
router.post("/sessions/:id/messages", sendMessage);

// GET /api/chat/history - Get user's chat history (requires auth)
router.get("/history", getChatHistory);

// PATCH /api/chat/sessions/:id/close - Close chat session
router.patch("/sessions/:id/close", closeChatSession);

export default router;
