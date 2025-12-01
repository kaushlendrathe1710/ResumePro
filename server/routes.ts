import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { initializeEmailTransporter, sendOtpEmail, generateOtp } from "./email";
import { z } from "zod";
import { insertUserSchema, insertOtpCodeSchema } from "@shared/schema";

// Initialize email on startup
initializeEmailTransporter();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Authentication routes
  
  // Send OTP to email
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { email } = z.object({ email: z.string().email() }).parse(req.body);

      // Generate 6-digit OTP
      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP in database
      await storage.createOtpCode({
        email,
        code: otp,
        expiresAt,
        used: 0,
      });

      // Send email
      const emailSent = await sendOtpEmail(email, otp);

      if (!emailSent) {
        return res.status(500).json({ error: "Failed to send email. Please check your email configuration." });
      }

      res.json({ success: true, message: "OTP sent to your email" });
    } catch (error) {
      console.error("Error in send-otp:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid email address" });
      }
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to send OTP" });
    }
  });

  // Verify OTP and login
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { email, code } = z.object({ 
        email: z.string().email(),
        code: z.string().length(6)
      }).parse(req.body);

      // Check if OTP is valid
      const otpRecord = await storage.getValidOtpCode(email, code);

      if (!otpRecord) {
        return res.status(400).json({ error: "Invalid or expired OTP code" });
      }

      // Mark OTP as used
      await storage.markOtpAsUsed(otpRecord.id);

      // Get or create user
      let user = await storage.getUserByEmail(email);
      if (!user) {
        user = await storage.createUser({ email });
      }

      // Set session
      req.session.userId = user.id;

      res.json({ 
        success: true, 
        user: { id: user.id, email: user.email } 
      });
    } catch (error) {
      console.error("Error in verify-otp:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data" });
      }
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: { id: user.id, email: user.email } });
  });

  // Logout
  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  // Resume routes (protected)
  
  // Create resume
  app.post("/api/resumes", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const { title, templateId, data } = z.object({
        title: z.string(),
        templateId: z.string(),
        data: z.string(), // JSON stringified
      }).parse(req.body);

      const resume = await storage.createResume({
        userId: req.session.userId,
        title,
        templateId,
        data,
      });

      res.json({ resume });
    } catch (error) {
      console.error("Error creating resume:", error);
      res.status(500).json({ error: "Failed to create resume" });
    }
  });

  // Get all resumes for current user
  app.get("/api/resumes", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const resumes = await storage.getResumesByUserId(req.session.userId);
      res.json({ resumes });
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ error: "Failed to fetch resumes" });
    }
  });

  // Get single resume
  app.get("/api/resumes/:id", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const resume = await storage.getResume(req.params.id);
      
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }

      if (resume.userId !== req.session.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json({ resume });
    } catch (error) {
      console.error("Error fetching resume:", error);
      res.status(500).json({ error: "Failed to fetch resume" });
    }
  });

  // Update resume
  app.patch("/api/resumes/:id", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const existing = await storage.getResume(req.params.id);
      
      if (!existing) {
        return res.status(404).json({ error: "Resume not found" });
      }

      if (existing.userId !== req.session.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const { title, templateId, data } = z.object({
        title: z.string().optional(),
        templateId: z.string().optional(),
        data: z.string().optional(),
      }).parse(req.body);

      const updated = await storage.updateResume(req.params.id, {
        ...(title && { title }),
        ...(templateId && { templateId }),
        ...(data && { data }),
      });

      res.json({ resume: updated });
    } catch (error) {
      console.error("Error updating resume:", error);
      res.status(500).json({ error: "Failed to update resume" });
    }
  });

  // Delete resume
  app.delete("/api/resumes/:id", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const existing = await storage.getResume(req.params.id);
      
      if (!existing) {
        return res.status(404).json({ error: "Resume not found" });
      }

      if (existing.userId !== req.session.userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      await storage.deleteResume(req.params.id);

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting resume:", error);
      res.status(500).json({ error: "Failed to delete resume" });
    }
  });

  // Cleanup expired OTPs periodically (run every hour)
  setInterval(async () => {
    try {
      await storage.cleanupExpiredOtps();
    } catch (error) {
      console.error("Error cleaning up expired OTPs:", error);
    }
  }, 60 * 60 * 1000);

  return httpServer;
}
