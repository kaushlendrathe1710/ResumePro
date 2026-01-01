import { 
  users, otpCodes, resumes, subscriptionPlans, userSubscriptions, downloadHistory,
  type User, type InsertUser, type OtpCode, type InsertOtpCode, type Resume, type InsertResume,
  type SubscriptionPlan, type InsertSubscriptionPlan, type UserSubscription, type InsertUserSubscription,
  type DownloadHistory, type InsertDownloadHistory
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gt, sql, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: { name?: string; phone?: string; role?: string; country?: string | null; region?: string }): Promise<User>;

  // OTP methods
  createOtpCode(otpCode: InsertOtpCode): Promise<OtpCode>;
  getValidOtpCode(email: string, code: string): Promise<OtpCode | undefined>;
  markOtpAsUsed(id: string): Promise<void>;
  cleanupExpiredOtps(): Promise<void>;

  // Resume methods
  createResume(resume: InsertResume): Promise<Resume>;
  getResumesByUserId(userId: string): Promise<Resume[]>;
  getResume(id: string): Promise<Resume | undefined>;
  updateResume(id: string, data: Partial<InsertResume>): Promise<Resume>;
  deleteResume(id: string): Promise<void>;

  // Admin methods
  getAllUsers(): Promise<User[]>;
  getUserCount(): Promise<number>;
  getResumeCount(): Promise<number>;
  getDownloadCount(): Promise<number>;
  getTodayUsersCount(): Promise<number>;
  deleteUser(id: string): Promise<void>;
  setUserRole(id: string, role: string): Promise<User>;
  getAllResumes(): Promise<Resume[]>;

  // Subscription Plan methods
  getAllPlans(): Promise<SubscriptionPlan[]>;
  getActivePlans(): Promise<SubscriptionPlan[]>;
  getPlan(id: string): Promise<SubscriptionPlan | undefined>;
  getDefaultPlan(): Promise<SubscriptionPlan | undefined>;
  createPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  updatePlan(id: string, data: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan>;
  deletePlan(id: string): Promise<void>;
  getSubscriptionsByPlanId(planId: string): Promise<UserSubscription[]>;

  // User Subscription methods
  getUserSubscription(userId: string): Promise<UserSubscription | undefined>;
  getUserSubscriptionWithPlan(userId: string): Promise<{ subscription: UserSubscription; plan: SubscriptionPlan } | undefined>;
  createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription>;
  updateUserSubscription(id: string, data: Partial<InsertUserSubscription>): Promise<UserSubscription>;
  getAllUserSubscriptions(): Promise<UserSubscription[]>;
  deactivateUserSubscription(id: string): Promise<void>;
  deleteUserSubscription(id: string): Promise<void>;
  cleanupDuplicateSubscriptions(): Promise<number>;

  // Download tracking methods
  recordDownload(download: InsertDownloadHistory): Promise<DownloadHistory>;
  getUserDownloads(userId: string): Promise<DownloadHistory[]>;
  decrementDownloadsRemaining(subscriptionId: string): Promise<void>;
  getDownloadHistoryCount(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, data: { name?: string; phone?: string; role?: string; country?: string | null; region?: string }): Promise<User> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // OTP methods
  async createOtpCode(otpCode: InsertOtpCode): Promise<OtpCode> {
    const [code] = await db
      .insert(otpCodes)
      .values(otpCode)
      .returning();
    return code;
  }

  async getValidOtpCode(email: string, code: string): Promise<OtpCode | undefined> {
    const [otpCode] = await db
      .select()
      .from(otpCodes)
      .where(
        and(
          eq(otpCodes.email, email),
          eq(otpCodes.code, code),
          eq(otpCodes.used, 0),
          gt(otpCodes.expiresAt, sql`NOW()`)
        )
      )
      .limit(1);
    return otpCode || undefined;
  }

  async markOtpAsUsed(id: string): Promise<void> {
    await db
      .update(otpCodes)
      .set({ used: 1 })
      .where(eq(otpCodes.id, id));
  }

  async cleanupExpiredOtps(): Promise<void> {
    await db
      .delete(otpCodes)
      .where(sql`${otpCodes.expiresAt} < NOW()`);
  }

  // Resume methods
  async createResume(resume: InsertResume): Promise<Resume> {
    const [newResume] = await db
      .insert(resumes)
      .values(resume)
      .returning();
    return newResume;
  }

  async getResumesByUserId(userId: string): Promise<Resume[]> {
    return await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(resumes.updatedAt);
  }

  async getResume(id: string): Promise<Resume | undefined> {
    const [resume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, id));
    return resume || undefined;
  }

  async updateResume(id: string, data: Partial<InsertResume>): Promise<Resume> {
    const [updated] = await db
      .update(resumes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(resumes.id, id))
      .returning();
    return updated;
  }

  async deleteResume(id: string): Promise<void> {
    await db
      .delete(resumes)
      .where(eq(resumes.id, id));
  }

  // Admin methods
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.createdAt);
  }

  async getUserCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(users);
    return Number(result[0]?.count || 0);
  }

  async getResumeCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(resumes);
    return Number(result[0]?.count || 0);
  }

  async getDownloadCount(): Promise<number> {
    return await this.getResumeCount();
  }

  async getTodayUsersCount(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(gt(users.createdAt, today));
    return Number(result[0]?.count || 0);
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(resumes).where(eq(resumes.userId, id));
    await db.delete(users).where(eq(users.id, id));
  }

  async setUserRole(id: string, role: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllResumes(): Promise<Resume[]> {
    return await db.select().from(resumes).orderBy(resumes.createdAt);
  }

  // Subscription Plan methods
  async getAllPlans(): Promise<SubscriptionPlan[]> {
    return await db.select().from(subscriptionPlans).orderBy(subscriptionPlans.sortOrder);
  }

  async getActivePlans(): Promise<SubscriptionPlan[]> {
    return await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.isActive, true))
      .orderBy(subscriptionPlans.sortOrder);
  }

  async getPlan(id: string): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return plan || undefined;
  }

  async getDefaultPlan(): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db
      .select()
      .from(subscriptionPlans)
      .where(and(eq(subscriptionPlans.isDefault, true), eq(subscriptionPlans.isActive, true)));
    return plan || undefined;
  }

  async createPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const [newPlan] = await db.insert(subscriptionPlans).values(plan).returning();
    return newPlan;
  }

  async updatePlan(id: string, data: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan> {
    const [updated] = await db
      .update(subscriptionPlans)
      .set(data)
      .where(eq(subscriptionPlans.id, id))
      .returning();
    return updated;
  }

  async deletePlan(id: string): Promise<void> {
    await db.delete(subscriptionPlans).where(eq(subscriptionPlans.id, id));
  }

  async getSubscriptionsByPlanId(planId: string): Promise<UserSubscription[]> {
    return await db.select().from(userSubscriptions).where(eq(userSubscriptions.planId, planId));
  }

  // User Subscription methods
  async getUserSubscription(userId: string): Promise<UserSubscription | undefined> {
    const [subscription] = await db
      .select()
      .from(userSubscriptions)
      .where(and(eq(userSubscriptions.userId, userId), eq(userSubscriptions.isActive, true)))
      .orderBy(desc(userSubscriptions.createdAt))
      .limit(1);
    return subscription || undefined;
  }

  async getUserSubscriptionWithPlan(userId: string): Promise<{ subscription: UserSubscription; plan: SubscriptionPlan } | undefined> {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription) return undefined;
    
    const plan = await this.getPlan(subscription.planId);
    if (!plan) return undefined;
    
    return { subscription, plan };
  }

  async createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription> {
    // Get existing subscriptions for this user
    const existingSubs = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, subscription.userId));
    
    // Delete related download history first (to respect foreign key constraint)
    for (const sub of existingSubs) {
      await db.delete(downloadHistory).where(eq(downloadHistory.subscriptionId, sub.id));
    }
    
    // Delete any existing subscriptions for this user (enforce one plan per user)
    await db
      .delete(userSubscriptions)
      .where(eq(userSubscriptions.userId, subscription.userId));
    
    const [newSubscription] = await db.insert(userSubscriptions).values(subscription).returning();
    return newSubscription;
  }

  async updateUserSubscription(id: string, data: Partial<InsertUserSubscription>): Promise<UserSubscription> {
    const [updated] = await db
      .update(userSubscriptions)
      .set(data)
      .where(eq(userSubscriptions.id, id))
      .returning();
    return updated;
  }

  async getAllUserSubscriptions(): Promise<UserSubscription[]> {
    return await db.select().from(userSubscriptions).orderBy(desc(userSubscriptions.createdAt));
  }

  async deactivateUserSubscription(id: string): Promise<void> {
    await db.update(userSubscriptions).set({ isActive: false }).where(eq(userSubscriptions.id, id));
  }

  async deleteUserSubscription(id: string): Promise<void> {
    await db.delete(userSubscriptions).where(eq(userSubscriptions.id, id));
  }

  async cleanupDuplicateSubscriptions(): Promise<number> {
    const allSubs = await db.select().from(userSubscriptions).orderBy(desc(userSubscriptions.createdAt));
    const userKeptSub = new Map<string, string>();
    const toDelete: string[] = [];

    for (const sub of allSubs) {
      const key = sub.userId;
      if (!userKeptSub.has(key)) {
        if (sub.isActive) {
          userKeptSub.set(key, sub.id);
        }
      } else {
        if (sub.isActive) {
          toDelete.push(sub.id);
        }
      }
    }

    for (const sub of allSubs) {
      if (!userKeptSub.has(sub.userId)) {
        userKeptSub.set(sub.userId, sub.id);
      }
    }

    for (const id of toDelete) {
      await db.delete(userSubscriptions).where(eq(userSubscriptions.id, id));
    }

    return toDelete.length;
  }

  // Download tracking methods
  async recordDownload(download: InsertDownloadHistory): Promise<DownloadHistory> {
    const [record] = await db.insert(downloadHistory).values(download).returning();
    return record;
  }

  async getUserDownloads(userId: string): Promise<DownloadHistory[]> {
    return await db
      .select()
      .from(downloadHistory)
      .where(eq(downloadHistory.userId, userId))
      .orderBy(desc(downloadHistory.createdAt));
  }

  async decrementDownloadsRemaining(subscriptionId: string): Promise<void> {
    await db
      .update(userSubscriptions)
      .set({ 
        downloadsRemaining: sql`downloads_remaining - 1`,
        downloadsUsed: sql`downloads_used + 1`
      })
      .where(eq(userSubscriptions.id, subscriptionId));
  }

  async getDownloadHistoryCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(downloadHistory);
    return Number(result[0]?.count || 0);
  }
}

export const storage = new DatabaseStorage();
