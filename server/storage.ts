import { users, otpCodes, resumes, type User, type InsertUser, type OtpCode, type InsertOtpCode, type Resume, type InsertResume } from "@shared/schema";
import { db } from "./db";
import { eq, and, gt, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: { name?: string; phone?: string; role?: string }): Promise<User>;

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

  async updateUser(id: string, data: { name?: string; phone?: string; role?: string }): Promise<User> {
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
}

export const storage = new DatabaseStorage();
