import { z } from "zod";

// Nation type for domestic vs import
export const nationSchema = z.enum(["domestic", "import"]);
export type Nation = z.infer<typeof nationSchema>;

// Model sales data from Danawa
export const radarModelSchema = z.object({
  id: z.string(),
  rank: z.number(),
  prevRank: z.number().nullable(),
  modelName: z.string(),
  manufacturer: z.string(),
  sales: z.number(),
  prevSales: z.number(),
  momAbs: z.number(), // month-over-month absolute change
  momPct: z.number(), // month-over-month percentage change
  rankChange: z.number(), // positive = moved up
  score: z.number(), // composite rising score
  isNew: z.boolean(), // new entry (prev=0)
  nation: nationSchema,
  month: z.string(), // YYYY-MM format
  danawaUrl: z.string(),
});

export type RadarModel = z.infer<typeof radarModelSchema>;

// API response for radar data
export const radarResponseSchema = z.object({
  models: z.array(radarModelSchema),
  month: z.string(),
  nation: nationSchema,
  lastUpdated: z.string(),
  totalCount: z.number(),
});

export type RadarResponse = z.infer<typeof radarResponseSchema>;

// Filter options
export const filterOptionsSchema = z.object({
  minSales: z.number().default(300),
  excludeNewEntries: z.boolean().default(false),
  limit: z.number().default(20),
});

export type FilterOptions = z.infer<typeof filterOptionsSchema>;

// Available months response
export const availableMonthsSchema = z.object({
  months: z.array(z.string()),
  latestMonth: z.string(),
});

export type AvailableMonths = z.infer<typeof availableMonthsSchema>;

// Legacy user schema (kept for compatibility)
import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
