import type { Express } from "express";
import { createServer, type Server } from "http";
import { fetchRadarData, getAvailableMonths, getLatestMonth } from "./danawa-scraper";
import { nationSchema } from "@shared/schema";
import { z } from "zod";

const radarCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/months", async (_req, res) => {
    try {
      const months = getAvailableMonths();
      const latestMonth = getLatestMonth();
      
      res.json({
        months,
        latestMonth,
      });
    } catch (error) {
      console.error("Error getting available months:", error);
      res.status(500).json({ error: "Failed to get available months" });
    }
  });

  app.get("/api/radar", async (req, res) => {
    try {
      const querySchema = z.object({
        month: z.string().regex(/^\d{4}-\d{2}$/),
        nation: nationSchema,
      });

      const parsed = querySchema.safeParse(req.query);
      
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Invalid query parameters",
          details: parsed.error.errors 
        });
      }

      const { month, nation } = parsed.data;
      const cacheKey = `${nation}-${month}`;
      
      const cached = radarCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return res.json(cached.data);
      }

      const models = await fetchRadarData(nation, month);
      
      const response = {
        models,
        month,
        nation,
        lastUpdated: new Date().toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        totalCount: models.length,
      };

      radarCache.set(cacheKey, {
        data: response,
        timestamp: Date.now(),
      });

      res.json(response);
    } catch (error) {
      console.error("Error fetching radar data:", error);
      res.status(500).json({ error: "Failed to fetch radar data" });
    }
  });

  return httpServer;
}
