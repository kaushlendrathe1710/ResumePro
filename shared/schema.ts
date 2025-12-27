import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - stores authenticated users
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  phone: text("phone"),
  country: text("country"), // ISO country code detected from phone (e.g., "IN", "US")
  region: text("region").default("international"), // "india" or "international" for pricing
  role: text("role").default("user").notNull(), // user, admin, superadmin
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).extend({
  role: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// OTP codes table - stores one-time passwords for email verification
export const otpCodes = pgTable("otp_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  code: text("code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  used: integer("used").default(0).notNull(), // 0 = unused, 1 = used
});

export const insertOtpCodeSchema = createInsertSchema(otpCodes).omit({
  id: true,
  createdAt: true,
});

export type InsertOtpCode = z.infer<typeof insertOtpCodeSchema>;
export type OtpCode = typeof otpCodes.$inferSelect;

// Resumes table - stores user resumes
export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  templateId: text("template_id").notNull(),
  data: text("data").notNull(), // JSON stringified ResumeData
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertResume = z.infer<typeof insertResumeSchema>;
export type Resume = typeof resumes.$inferSelect;

// Subscription Plans table - admin configurable plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // Basic, Premium, etc.
  price: integer("price").default(0).notNull(), // Price in smallest currency unit (paise/cents)
  currency: text("currency").default("INR").notNull(), // Currency code: INR, USD, etc.
  region: text("region").default("all").notNull(), // "india", "international", or "all"
  stripePriceId: text("stripe_price_id"), // Stripe Price ID for checkout (e.g., price_xxx)
  downloadLimit: integer("download_limit").default(1).notNull(), // Number of downloads allowed
  validityDays: integer("validity_days").default(0).notNull(), // 0 = forever, else days
  hasWatermark: boolean("has_watermark").default(true).notNull(), // Watermark on PDF
  watermarkText: text("watermark_text").default("Mymegaminds"), // Watermark text
  allowWordExport: boolean("allow_word_export").default(false).notNull(), // Word export allowed
  isActive: boolean("is_active").default(true).notNull(), // Plan is available
  isDefault: boolean("is_default").default(false).notNull(), // Default plan for new users
  sortOrder: integer("sort_order").default(0).notNull(), // Display order
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
});

export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;

// User Subscriptions table - tracks user's active subscription
export const userSubscriptions = pgTable("user_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  planId: varchar("plan_id").references(() => subscriptionPlans.id).notNull(),
  downloadsUsed: integer("downloads_used").default(0).notNull(), // Downloads used in current period
  downloadsRemaining: integer("downloads_remaining").notNull(), // Downloads remaining
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"), // null for forever plans
  isActive: boolean("is_active").default(true).notNull(),
  paymentReference: text("payment_reference"), // For manual payment tracking
  stripePaymentId: text("stripe_payment_id"), // Stripe checkout session ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).omit({
  id: true,
  createdAt: true,
});

export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;
export type UserSubscription = typeof userSubscriptions.$inferSelect;

// Download History table - tracks all downloads
export const downloadHistory = pgTable("download_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  resumeId: varchar("resume_id"), // nullable for direct exports
  subscriptionId: varchar("subscription_id").references(() => userSubscriptions.id),
  format: text("format").notNull(), // pdf, docx
  hadWatermark: boolean("had_watermark").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDownloadHistorySchema = createInsertSchema(downloadHistory).omit({
  id: true,
  createdAt: true,
});

export type InsertDownloadHistory = z.infer<typeof insertDownloadHistorySchema>;
export type DownloadHistory = typeof downloadHistory.$inferSelect;
