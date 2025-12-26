# ResuMake - Professional Resume Builder

## Overview

ResuMake is a full-stack web application that enables users to create professional resumes quickly without requiring login credentials. The application features a modern React-based frontend with multiple customizable templates, a Node.js/Express backend, and PostgreSQL database for data persistence. Users can build resumes using a form-based interface, preview them in real-time, export to PDF or Word formats, and manage their resume library through an authenticated dashboard.

The application includes a tiered subscription system that controls features like download limits, watermarks, and Word export capabilities. It also provides comprehensive admin and super admin dashboards for user management, subscription plan configuration, and analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type safety and modern component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing instead of React Router
- TailwindCSS v4 for utility-first styling with custom theme configuration

**State Management & Data Fetching:**
- TanStack Query (React Query) for server state management, caching, and data synchronization
- React Hook Form with Zod validation for form state and schema-based validation
- No global state management library (Redux/Zustand) - relying on React Query's cache and local component state

**UI Component System:**
- Radix UI primitives for accessible, unstyled components (dialogs, dropdowns, tabs, etc.)
- Shadcn/ui component library built on top of Radix with consistent styling
- Custom resume template system with 20 different layouts (Modern, Classic, Minimal, Executive, Creative, Professional, Elegant, Tech, Corporate, Academic, Simple, Bold, Stylish, Compact, Sidebar, Timeline, Infographic, Clean, Gradient, Sharp)
- Each template supports three font families (sans, serif, mono) and 20 color variations

**Export Capabilities:**
- React-to-print for PDF generation from React components
- Docx library for Word document export with structured formatting
- File-saver for client-side file downloads

### Backend Architecture

**Core Framework:**
- Express.js server with TypeScript for type-safe API development
- Custom session management using PostgreSQL-backed store (DrizzleSessionStore)
- Express-session for session handling with secure cookie configuration

**Authentication System:**
- Email-based OTP (One-Time Password) authentication - no traditional passwords
- Nodemailer for sending verification codes via SMTP
- Role-based access control with three tiers: user, admin, superadmin
- Session-based authentication without JWT tokens

**API Design:**
- RESTful endpoints organized by feature domain
- Middleware-based role verification (requireAdmin, requireSuperAdmin)
- Custom request body validation using Zod schemas
- Error handling with descriptive JSON responses

### Data Storage Solutions

**Database:**
- PostgreSQL as primary data store via Neon serverless PostgreSQL
- Drizzle ORM for type-safe database queries and schema management
- WebSocket connection pooling for serverless compatibility

**Database Schema:**
- **users**: Stores user accounts with email, name, phone, role, and timestamps
- **otp_codes**: Temporary storage for email verification codes with expiration tracking
- **resumes**: User-created resumes with title, template ID, and JSON-serialized resume data
- **subscription_plans**: Configurable plans with download limits, watermark settings, Word export permissions
- **user_subscriptions**: Links users to plans with validity periods, usage tracking, and Stripe payment IDs
- **download_history**: Audit trail of resume downloads with timestamps and format tracking
- **user_sessions**: PostgreSQL-based session store for Express sessions

**Schema Design Principles:**
- UUID-based primary keys using PostgreSQL's gen_random_uuid()
- Timestamp columns (createdAt, updatedAt) for audit trails
- Foreign key relationships with referential integrity
- JSON text fields for flexible resume data storage

### Authentication & Authorization

**OTP-Based Login Flow:**
1. User submits email address
2. System generates 6-digit numeric code with 10-minute expiration
3. Code sent via configured SMTP server
4. User enters code to verify identity
5. For new users, additional profile information (name, phone) collected
6. Session created with userId stored in server-side session store

**Role Hierarchy:**
- **user**: Default role with basic resume creation and download capabilities
- **admin**: Can manage users, view analytics, configure subscription plans
- **superadmin**: Hardcoded email (kaushlendra.k12@fms.edu) with full system access

**Security Measures:**
- OTP codes marked as used after verification to prevent replay attacks
- Expired OTP cleanup mechanism
- Session validation on protected routes
- CSRF protection through SameSite cookie attributes

### External Dependencies

**Email Service:**
- Configurable SMTP server via environment variables (EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, SMTP_SECURE)
- System requires valid SMTP credentials for login functionality
- Supports both secure (TLS) and non-secure SMTP connections

**Database Hosting:**
- Neon serverless PostgreSQL via DATABASE_URL environment variable
- WebSocket connection support for serverless edge deployment
- Connection pooling with @neondatabase/serverless driver

**Font Resources:**
- Google Fonts CDN for Inter (UI), Merriweather, Playfair Display, Roboto, and other resume fonts
- Preconnected to fonts.googleapis.com and fonts.gstatic.com for performance

**Development Tools:**
- Replit-specific plugins for development environment integration (@replit/vite-plugin-cartographer, @replit/vite-plugin-dev-banner)
- Runtime error overlay for development debugging
- Custom meta images plugin for OpenGraph tags

**Build & Deployment:**
- ESBuild for server-side bundling with selective dependency bundling
- Vite for client-side bundling with optimized production builds
- Static file serving from dist/public directory in production
- Allowlist approach for bundling specific server dependencies to reduce cold start times

**Payment Processing:**
- Stripe integration for subscription payments via Replit's Stripe connector
- stripe-replit-sync library for webhook management and data synchronization
- Checkout sessions redirect to /dashboard with success/cancel status
- Webhook handler at /api/stripe/webhook for server-side payment verification
- Automatic subscription activation via webhook or client-side verification
- Products and prices synced from Stripe dashboard

**Third-Party Libraries:**
- Lucide React for iconography
- Framer Motion for animations (currently imported but minimal usage)
- Sonner for toast notifications
- date-fns for date manipulation
- class-variance-authority for component variant management
- Stripe SDK for payment processing