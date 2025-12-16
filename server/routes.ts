import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { initializeEmailTransporter, sendOtpEmail, generateOtp } from "./email";
import { z } from "zod";
import { insertUserSchema, insertOtpCodeSchema } from "@shared/schema";

// Initialize email on startup
initializeEmailTransporter();

// Super admin email
const SUPER_ADMIN_EMAIL = "kaushlendra.k12@fms.edu";

// Middleware to check if user is admin
async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  
  const user = await storage.getUser(req.session.userId);
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return res.status(403).json({ error: "Access denied. Admin privileges required." });
  }
  
  next();
}

// Middleware to check if user is super admin
async function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  
  const user = await storage.getUser(req.session.userId);
  if (!user || user.role !== "superadmin") {
    return res.status(403).json({ error: "Access denied. Super admin privileges required." });
  }
  
  next();
}

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
      let isNewUser = false;
      
      if (!user) {
        // Check if this is the super admin email
        const role = email === SUPER_ADMIN_EMAIL ? "superadmin" : "user";
        user = await storage.createUser({ email, role });
        isNewUser = true;
      } else if (email === SUPER_ADMIN_EMAIL && user.role !== "superadmin") {
        // Ensure super admin always has superadmin role
        user = await storage.setUserRole(user.id, "superadmin");
      }

      // Check if user needs to complete registration (no name or phone)
      const needsRegistration = !user.name || !user.phone;
      const isAdmin = user.role === "admin" || user.role === "superadmin";

      // Set session
      req.session.userId = user.id;

      res.json({ 
        success: true, 
        user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role },
        needsRegistration,
        isAdmin
      });
    } catch (error) {
      console.error("Error in verify-otp:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data" });
      }
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  });

  // Complete registration (add name and phone)
  app.post("/api/auth/complete-registration", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { name, phone } = z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        phone: z.string().min(10, "Please enter a valid phone number with country code"),
      }).parse(req.body);

      const user = await storage.updateUser(req.session.userId, { name, phone });

      res.json({ 
        success: true, 
        user: { id: user.id, email: user.email, name: user.name, phone: user.phone }
      });
    } catch (error) {
      console.error("Error in complete-registration:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Failed to complete registration" });
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

    const needsRegistration = !user.name || !user.phone;
    const isAdmin = user.role === "admin" || user.role === "superadmin";

    res.json({ 
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role },
      needsRegistration,
      isAdmin
    });
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

  // ============= ADMIN ROUTES =============

  // Get admin dashboard stats
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const [userCount, resumeCount, downloadCount, todayUsers] = await Promise.all([
        storage.getUserCount(),
        storage.getResumeCount(),
        storage.getDownloadCount(),
        storage.getTodayUsersCount(),
      ]);

      res.json({
        totalUsers: userCount,
        totalResumes: resumeCount,
        totalDownloads: downloadCount,
        newUsersToday: todayUsers,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Get all users (admin)
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json({ users: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        phone: u.phone,
        role: u.role,
        createdAt: u.createdAt,
      }))});
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Delete user (super admin only)
  app.delete("/api/admin/users/:id", requireSuperAdmin, async (req, res) => {
    try {
      const userToDelete = await storage.getUser(req.params.id);
      
      if (!userToDelete) {
        return res.status(404).json({ error: "User not found" });
      }

      // Cannot delete super admin
      if (userToDelete.role === "superadmin") {
        return res.status(403).json({ error: "Cannot delete super admin" });
      }

      await storage.deleteUser(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Promote user to admin (super admin only)
  app.post("/api/admin/users/:id/promote", requireSuperAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.role === "superadmin") {
        return res.status(400).json({ error: "Cannot modify super admin role" });
      }

      const updatedUser = await storage.setUserRole(req.params.id, "admin");
      res.json({ 
        success: true, 
        user: { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role }
      });
    } catch (error) {
      console.error("Error promoting user:", error);
      res.status(500).json({ error: "Failed to promote user" });
    }
  });

  // Demote admin to user (super admin only)
  app.post("/api/admin/users/:id/demote", requireSuperAdmin, async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.role === "superadmin") {
        return res.status(400).json({ error: "Cannot modify super admin role" });
      }

      const updatedUser = await storage.setUserRole(req.params.id, "user");
      res.json({ 
        success: true, 
        user: { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role }
      });
    } catch (error) {
      console.error("Error demoting user:", error);
      res.status(500).json({ error: "Failed to demote user" });
    }
  });

  // Get all resumes (admin)
  app.get("/api/admin/resumes", requireAdmin, async (req, res) => {
    try {
      const resumes = await storage.getAllResumes();
      const users = await storage.getAllUsers();
      const userMap = new Map(users.map(u => [u.id, u]));
      
      res.json({ 
        resumes: resumes.map(r => ({
          ...r,
          userEmail: userMap.get(r.userId)?.email,
          userName: userMap.get(r.userId)?.name,
        }))
      });
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ error: "Failed to fetch resumes" });
    }
  });

  // ============= SUBSCRIPTION PLAN ROUTES (Admin) =============

  // Get all subscription plans (admin)
  app.get("/api/admin/plans", requireAdmin, async (req, res) => {
    try {
      const plans = await storage.getAllPlans();
      res.json({ plans });
    } catch (error) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ error: "Failed to fetch plans" });
    }
  });

  // Create subscription plan (super admin)
  app.post("/api/admin/plans", requireSuperAdmin, async (req, res) => {
    try {
      const planData = z.object({
        name: z.string().min(1),
        price: z.number().min(0),
        downloadLimit: z.number().min(1),
        validityDays: z.number().min(0),
        hasWatermark: z.boolean(),
        watermarkText: z.string().optional(),
        allowWordExport: z.boolean(),
        isActive: z.boolean().optional(),
        isDefault: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }).parse(req.body);

      // If this plan is set as default, unset other defaults
      if (planData.isDefault) {
        const allPlans = await storage.getAllPlans();
        for (const p of allPlans) {
          if (p.isDefault) {
            await storage.updatePlan(p.id, { isDefault: false });
          }
        }
      }

      const plan = await storage.createPlan(planData);
      res.json({ plan });
    } catch (error) {
      console.error("Error creating plan:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Failed to create plan" });
    }
  });

  // Update subscription plan (super admin)
  app.patch("/api/admin/plans/:id", requireSuperAdmin, async (req, res) => {
    try {
      const planData = z.object({
        name: z.string().min(1).optional(),
        price: z.number().min(0).optional(),
        downloadLimit: z.number().min(1).optional(),
        validityDays: z.number().min(0).optional(),
        hasWatermark: z.boolean().optional(),
        watermarkText: z.string().optional(),
        allowWordExport: z.boolean().optional(),
        isActive: z.boolean().optional(),
        isDefault: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }).parse(req.body);

      // If setting as default, unset other defaults
      if (planData.isDefault) {
        const allPlans = await storage.getAllPlans();
        for (const p of allPlans) {
          if (p.isDefault && p.id !== req.params.id) {
            await storage.updatePlan(p.id, { isDefault: false });
          }
        }
      }

      const plan = await storage.updatePlan(req.params.id, planData);
      res.json({ plan });
    } catch (error) {
      console.error("Error updating plan:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Failed to update plan" });
    }
  });

  // Delete subscription plan (super admin)
  app.delete("/api/admin/plans/:id", requireSuperAdmin, async (req, res) => {
    try {
      const plan = await storage.getPlan(req.params.id);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }

      const linkedSubscriptions = await storage.getSubscriptionsByPlanId(req.params.id);
      if (linkedSubscriptions.length > 0) {
        return res.status(400).json({ 
          error: `Cannot delete this plan. ${linkedSubscriptions.length} user subscription(s) are linked to it. Please reassign or deactivate those subscriptions first.` 
        });
      }

      await storage.deletePlan(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting plan:", error);
      res.status(500).json({ error: "Failed to delete plan" });
    }
  });

  // Get all user subscriptions (admin)
  app.get("/api/admin/subscriptions", requireAdmin, async (req, res) => {
    try {
      const subscriptions = await storage.getAllUserSubscriptions();
      const users = await storage.getAllUsers();
      const plans = await storage.getAllPlans();
      
      const userMap = new Map(users.map(u => [u.id, u]));
      const planMap = new Map(plans.map(p => [p.id, p]));
      
      res.json({ 
        subscriptions: subscriptions.map(s => ({
          ...s,
          userEmail: userMap.get(s.userId)?.email,
          userName: userMap.get(s.userId)?.name,
          planName: planMap.get(s.planId)?.name,
          planPrice: planMap.get(s.planId)?.price,
        }))
      });
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  });

  // Manually activate subscription for user (super admin)
  app.post("/api/admin/subscriptions/activate", requireSuperAdmin, async (req, res) => {
    try {
      const { userId, planId, paymentReference } = z.object({
        userId: z.string(),
        planId: z.string(),
        paymentReference: z.string().optional(),
      }).parse(req.body);

      const plan = await storage.getPlan(planId);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }

      const endDate = plan.validityDays > 0 
        ? new Date(Date.now() + plan.validityDays * 24 * 60 * 60 * 1000)
        : null;

      const subscription = await storage.createUserSubscription({
        userId,
        planId,
        downloadsRemaining: plan.downloadLimit,
        startDate: new Date(),
        endDate,
        isActive: true,
        paymentReference,
      });

      res.json({ subscription });
    } catch (error) {
      console.error("Error activating subscription:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: "Failed to activate subscription" });
    }
  });

  // Deactivate user subscription (super admin)
  app.post("/api/admin/subscriptions/:id/deactivate", requireSuperAdmin, async (req, res) => {
    try {
      await storage.deactivateUserSubscription(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deactivating subscription:", error);
      res.status(500).json({ error: "Failed to deactivate subscription" });
    }
  });

  // ============= USER SUBSCRIPTION ROUTES =============

  // Get available plans (public for display)
  app.get("/api/plans", async (req, res) => {
    try {
      const plans = await storage.getActivePlans();
      res.json({ plans: plans.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        downloadLimit: p.downloadLimit,
        validityDays: p.validityDays,
        hasWatermark: p.hasWatermark,
        allowWordExport: p.allowWordExport,
        sortOrder: p.sortOrder,
      }))});
    } catch (error) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ error: "Failed to fetch plans" });
    }
  });

  // Get current user's subscription status
  app.get("/api/subscription", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const subWithPlan = await storage.getUserSubscriptionWithPlan(req.session.userId);
      
      if (!subWithPlan) {
        // Return default plan info for new users
        const defaultPlan = await storage.getDefaultPlan();
        return res.json({ 
          hasSubscription: false,
          defaultPlan: defaultPlan ? {
            id: defaultPlan.id,
            name: defaultPlan.name,
            downloadLimit: defaultPlan.downloadLimit,
            hasWatermark: defaultPlan.hasWatermark,
            allowWordExport: defaultPlan.allowWordExport,
          } : null
        });
      }

      const { subscription, plan } = subWithPlan;
      
      // Check if subscription has expired
      if (subscription.endDate && new Date(subscription.endDate) < new Date()) {
        await storage.deactivateUserSubscription(subscription.id);
        const defaultPlan = await storage.getDefaultPlan();
        return res.json({ 
          hasSubscription: false,
          expired: true,
          defaultPlan: defaultPlan ? {
            id: defaultPlan.id,
            name: defaultPlan.name,
            downloadLimit: defaultPlan.downloadLimit,
            hasWatermark: defaultPlan.hasWatermark,
            allowWordExport: defaultPlan.allowWordExport,
          } : null
        });
      }

      res.json({
        hasSubscription: true,
        subscription: {
          id: subscription.id,
          planName: plan.name,
          planPrice: plan.price,
          downloadsRemaining: subscription.downloadsRemaining,
          downloadsUsed: subscription.downloadsUsed,
          downloadLimit: plan.downloadLimit,
          hasWatermark: plan.hasWatermark,
          allowWordExport: plan.allowWordExport,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
        }
      });
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  // Check if user can download (and get watermark info)
  app.get("/api/subscription/can-download", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const format = (req.query.format as string) || "pdf";
      let subWithPlan = await storage.getUserSubscriptionWithPlan(req.session.userId);
      
      // If no subscription, auto-assign default plan
      if (!subWithPlan) {
        const defaultPlan = await storage.getDefaultPlan();
        if (defaultPlan) {
          const endDate = defaultPlan.validityDays > 0 
            ? new Date(Date.now() + defaultPlan.validityDays * 24 * 60 * 60 * 1000)
            : null;
          
          await storage.createUserSubscription({
            userId: req.session.userId,
            planId: defaultPlan.id,
            downloadsRemaining: defaultPlan.downloadLimit,
            startDate: new Date(),
            endDate,
            isActive: true,
          });
          
          subWithPlan = await storage.getUserSubscriptionWithPlan(req.session.userId);
        }
      }

      if (!subWithPlan) {
        return res.json({ canDownload: false, reason: "No subscription available" });
      }

      const { subscription, plan } = subWithPlan;

      // Check if subscription expired
      if (subscription.endDate && new Date(subscription.endDate) < new Date()) {
        return res.json({ canDownload: false, reason: "Subscription expired", expired: true });
      }

      // Check download limit
      if (subscription.downloadsRemaining <= 0) {
        return res.json({ canDownload: false, reason: "No downloads remaining", noCredits: true });
      }

      // Check Word export permission
      if (format === "docx" && !plan.allowWordExport) {
        return res.json({ canDownload: false, reason: "Word export not available in your plan", upgradeNeeded: true });
      }

      res.json({
        canDownload: true,
        hasWatermark: plan.hasWatermark,
        watermarkText: plan.watermarkText,
        downloadsRemaining: subscription.downloadsRemaining,
        subscriptionId: subscription.id,
      });
    } catch (error) {
      console.error("Error checking download permission:", error);
      res.status(500).json({ error: "Failed to check download permission" });
    }
  });

  // Record a download (detailed)
  app.post("/api/subscription/record-download", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const { resumeId, format, subscriptionId, hadWatermark } = z.object({
        resumeId: z.string(),
        format: z.string(),
        subscriptionId: z.string(),
        hadWatermark: z.boolean(),
      }).parse(req.body);

      // Record the download
      await storage.recordDownload({
        userId: req.session.userId,
        resumeId,
        subscriptionId,
        format,
        hadWatermark,
      });

      // Decrement downloads remaining
      await storage.decrementDownloadsRemaining(subscriptionId);

      res.json({ success: true });
    } catch (error) {
      console.error("Error recording download:", error);
      res.status(500).json({ error: "Failed to record download" });
    }
  });

  // Simple download tracking (auto-detects subscription)
  app.post("/api/subscription/download", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const { format } = z.object({
        format: z.enum(["pdf", "docx"]),
      }).parse(req.body);

      const userId = req.session.userId;

      // Check for active subscription
      let subWithPlan = await storage.getUserSubscriptionWithPlan(userId);

      // Auto-assign default plan if no subscription
      if (!subWithPlan) {
        const defaultPlan = await storage.getDefaultPlan();
        if (!defaultPlan) {
          return res.status(400).json({ error: "No default plan available" });
        }

        // Check again in case of concurrent requests (double-check locking)
        subWithPlan = await storage.getUserSubscriptionWithPlan(userId);
        if (!subWithPlan) {
          // Create subscription with default plan
          const newSub = await storage.createUserSubscription({
            userId,
            planId: defaultPlan.id,
            startDate: new Date(),
            endDate: null,
            downloadsRemaining: defaultPlan.downloadLimit,
            downloadsUsed: 0,
            isActive: true,
          });
          subWithPlan = { subscription: newSub, plan: defaultPlan };
        }
      }

      const { subscription, plan } = subWithPlan;

      // Validate download permission
      if (subscription.endDate && new Date(subscription.endDate) < new Date()) {
        return res.status(403).json({ error: "Subscription expired" });
      }

      if (subscription.downloadsRemaining <= 0) {
        return res.status(403).json({ error: "No downloads remaining" });
      }

      if (format === "docx" && !plan.allowWordExport) {
        return res.status(403).json({ error: "Word export not available in your plan" });
      }

      // Record download and decrement
      await storage.recordDownload({
        userId,
        resumeId: "direct-export",
        subscriptionId: subscription.id,
        format,
        hadWatermark: plan.hasWatermark,
      });

      await storage.decrementDownloadsRemaining(subscription.id);

      // Fetch updated subscription to return accurate remaining count
      const updatedSub = await storage.getUserSubscriptionWithPlan(userId);
      const newRemaining = updatedSub?.subscription.downloadsRemaining ?? 0;

      res.json({ 
        success: true, 
        downloadsRemaining: newRemaining,
        hasWatermark: plan.hasWatermark
      });
    } catch (error) {
      console.error("Error recording download:", error);
      res.status(500).json({ error: "Failed to record download" });
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
