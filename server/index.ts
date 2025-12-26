import express, { type Request, Response, NextFunction } from "express";
import "dotenv/config";
import session from "express-session";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { db } from "./db";
import { sql } from "drizzle-orm";
import { runMigrations } from 'stripe-replit-sync';
import { getStripeSync } from './stripeClient';
import { WebhookHandlers } from './webhookHandlers';

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

async function initStripe() {
  const databaseUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.log('DATABASE_URL not set, skipping Stripe initialization');
    return;
  }

  try {
    console.log('Initializing Stripe schema...');
    await runMigrations({ databaseUrl });
    console.log('Stripe schema ready');

    const stripeSync = await getStripeSync();

    console.log('Setting up managed webhook...');
    const webhookBaseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
    try {
      const result = await stripeSync.findOrCreateManagedWebhook(
        `${webhookBaseUrl}/api/stripe/webhook`
      );
      console.log('Webhook configured successfully');
    } catch (webhookError: any) {
      console.log('Webhook setup skipped (may already exist or not available in dev):', webhookError.message || webhookError);
    }

    console.log('Syncing Stripe data...');
    stripeSync.syncBackfill()
      .then(() => {
        console.log('Stripe data synced');
      })
      .catch((err: any) => {
        console.error('Error syncing Stripe data:', err);
      });
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
  }
}

initStripe();

app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature' });
    }

    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;

      if (!Buffer.isBuffer(req.body)) {
        console.error('STRIPE WEBHOOK ERROR: req.body is not a Buffer');
        return res.status(500).json({ error: 'Webhook processing error' });
      }

      await WebhookHandlers.processWebhook(req.body as Buffer, sig);

      await WebhookHandlers.handleCheckoutSessionFromWebhook(req.body);

      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error.message);
      res.status(400).json({ error: 'Webhook processing error' });
    }
  }
);

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Custom PostgreSQL session store using Drizzle
class DrizzleSessionStore extends session.Store {
  async get(
    sid: string,
    callback: (err: any, session?: session.SessionData | null) => void,
  ) {
    try {
      const result = await db.execute(sql`
        SELECT sess FROM user_sessions WHERE sid = ${sid} AND expire > NOW()
      `);
      if (result.rows.length > 0) {
        callback(null, result.rows[0].sess as session.SessionData);
      } else {
        callback(null, null);
      }
    } catch (err) {
      callback(err);
    }
  }

  async set(
    sid: string,
    sessionData: session.SessionData,
    callback?: (err?: any) => void,
  ) {
    try {
      const maxAge = sessionData.cookie?.maxAge || 30 * 24 * 60 * 60 * 1000;
      const expire = new Date(Date.now() + maxAge);

      await db.execute(sql`
        INSERT INTO user_sessions (sid, sess, expire)
        VALUES (${sid}, ${JSON.stringify(sessionData)}::jsonb, ${expire})
        ON CONFLICT (sid) DO UPDATE SET sess = ${JSON.stringify(sessionData)}::jsonb, expire = ${expire}
      `);
      callback?.();
    } catch (err) {
      callback?.(err);
    }
  }

  async destroy(sid: string, callback?: (err?: any) => void) {
    try {
      await db.execute(sql`DELETE FROM user_sessions WHERE sid = ${sid}`);
      callback?.();
    } catch (err) {
      callback?.(err);
    }
  }

  async touch(
    sid: string,
    sessionData: session.SessionData,
    callback?: (err?: any) => void,
  ) {
    try {
      const maxAge = sessionData.cookie?.maxAge || 30 * 24 * 60 * 60 * 1000;
      const expire = new Date(Date.now() + maxAge);

      await db.execute(sql`
        UPDATE user_sessions SET expire = ${expire} WHERE sid = ${sid}
      `);
      callback?.();
    } catch (err) {
      callback?.(err);
    }
  }
}

// Ensure session table exists
async function initSessionTable() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_sessions (
        sid VARCHAR PRIMARY KEY,
        sess JSONB NOT NULL,
        expire TIMESTAMP NOT NULL
      )
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_user_sessions_expire ON user_sessions (expire)
    `);
    console.log("Session table ready");
  } catch (err) {
    console.error("Failed to create session table:", err);
  }
}

// Initialize session table
initSessionTable();

// Session middleware with custom Drizzle store
const isProduction = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);

app.use(
  session({
    store: new DrizzleSessionStore(),
    secret: process.env.SESSION_SECRET || "resumake-secret-key-2024",
    resave: true,
    saveUninitialized: false,
    rolling: true,
    name: "resumake.sid",
    cookie: {
      httpOnly: true,
      secure: isProduction,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    },
  }),
);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
