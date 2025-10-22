/**
 * Analytics Controller
 * Author: Aman Singh (Student ID: 25104201)
 * Feature: F007 - Admin Dashboard
 * Description: Handles sales analytics, revenue calculations, and performance metrics
 * Last Updated: 2025-10-22
 */

import type { Request, Response } from "express";
import prisma from "../utils/database";
import { cache } from "../utils/cache";

// GET /api/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query;

    // Default to last 7 days if params missing
    const defaultTo = new Date();
    const defaultFrom = new Date();
    defaultFrom.setDate(defaultFrom.getDate() - 7);

    const fromDate = from ? new Date(from as string) : defaultFrom;
    const toDate = to ? new Date(to as string) : defaultTo;

    // Set time boundaries for full day coverage
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);

    // Create cache key based on date range
    const cacheKey = `analytics:${fromDate.toISOString().split('T')[0]}:${toDate.toISOString().split('T')[0]}`;
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({ 
        ...cachedData, 
        cached: true,
        cacheTimestamp: new Date().toISOString()
      });
    }

    // Get orders in date range
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Calculate KPIs
    const revenueTotalCents = orders.reduce(
      (sum, order) => sum + order.totalCents,
      0
    );
    const ordersCount = orders.length;
    const avgOrderValueCents =
      ordersCount > 0 ? Math.round(revenueTotalCents / ordersCount) : 0;

    // Revenue by day
    const revenueByDayMap = new Map<string, number>();
    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split("T")[0];
      revenueByDayMap.set(
        date,
        (revenueByDayMap.get(date) || 0) + order.totalCents
      );
    });

    const revenueByDay = Array.from(revenueByDayMap.entries())
      .map(([date, revenueCents]) => ({ date, revenueCents }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top products
    const productSalesMap = new Map<string, { name: string; qty: number }>();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = productSalesMap.get(item.productId);
        if (existing) {
          existing.qty += item.quantity;
        } else {
          productSalesMap.set(item.productId, {
            name: item.nameAtPurchase,
            qty: item.quantity,
          });
        }
      });
    });

    const topProducts = Array.from(productSalesMap.entries())
      .map(([productId, data]) => ({ productId, ...data }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10); // Top 10 products

    const analyticsData = {
      data: {
        kpis: {
          revenueTotalCents,
          ordersCount,
          avgOrderValueCents,
        },
        revenueByDay,
        topProducts,
      },
    };

    // Cache the result for 10 minutes (600 seconds)
    cache.set(cacheKey, analyticsData, 600);

    res.json(analyticsData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
