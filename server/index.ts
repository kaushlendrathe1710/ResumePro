import express, { type Request, Response, NextFunction } from "express";
import "dotenv/config";
import session from "express-session";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { db } from "./db";
import { sql } from "drizzle-orm";

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
app.use(
  session({
    store: new DrizzleSessionStore(),
    secret: process.env.SESSION_SECRET || "resumake-secret-key-2024",
    resave: false,
    saveUninitialized: false,
    name: "resumake.sid",
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "lax",
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
