# ResuMake - Professional Resume Builder

ResuMake is a full-stack web application that enables users to create professional resumes quickly and easily. Built with React, Node.js, and PostgreSQL.

## Features

### Resume Builder
- **400+ Templates**: 20 unique layouts × 20 color variations
- **Real-time Preview**: See changes as you type
- **Multiple Export Formats**: Download as PDF or Word document
- **Auto-save**: Your work is automatically saved
- **Form-based Editing**: Easy-to-use form interface for all resume sections

### Resume Sections
- Personal Information (name, email, phone, location, LinkedIn, website)
- Professional Summary
- Work Experience (with multiple entries)
- Education
- Skills
- Projects
- Certifications
- Languages

### Authentication
- **Passwordless Login**: Email-based OTP (One-Time Password) authentication
- **No Password Required**: Simply enter your email and verify with a 6-digit code
- **Secure Sessions**: Server-side session management

### Subscription System
- **Basic Plan (Free)**:
  - 1 PDF download
  - Watermark on exports ("Mymegaminds")
  - PDF export only

- **Premium Plan (100 AED)**:
  - 10 downloads
  - No watermark
  - PDF + Word export
  - 30 days validity

### User Dashboard
- View all your resumes
- Download resumes in PDF or Word format
- Track subscription status and downloads remaining
- View available upgrade options
- Manage profile settings

### Admin Dashboard
- **User Management**: View and manage all users
- **Role Management**: Assign admin/user roles (Super Admin only)
- **Subscription Plans**: Create, edit, and delete plans
- **User Subscriptions**: View and manually activate subscriptions
- **Analytics**: Track user activity and downloads

## Template Layouts

1. **Modern** - Clean and contemporary design
2. **Classic** - Traditional professional layout
3. **Minimal** - Simple and elegant
4. **Executive** - Sophisticated for senior roles
5. **Creative** - Bold and artistic
6. **Professional** - Business-focused design
7. **Elegant** - Refined and stylish
8. **Tech** - Perfect for IT professionals
9. **Corporate** - Formal business style
10. **Academic** - Ideal for researchers and educators
11. **Simple** - Straightforward and clear
12. **Bold** - Strong visual impact
13. **Stylish** - Trendy and modern
14. **Compact** - Fits more content
15. **Sidebar** - Two-column layout
16. **Timeline** - Chronological focus
17. **Infographic** - Visual data representation
18. **Clean** - Uncluttered design
19. **Gradient** - Modern color transitions
20. **Sharp** - Geometric and precise

## Color Variations

Each template comes in 20 color options:
Blue, Green, Red, Purple, Orange, Teal, Pink, Indigo, Amber, Cyan, Rose, Emerald, Violet, Slate, Sky, Lime, Fuchsia, Yellow, Stone, Zinc

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- Radix UI + Shadcn/ui (components)
- React Hook Form + Zod (form validation)
- TanStack Query (data fetching)
- Wouter (routing)
- react-to-print (PDF generation)
- docx (Word document export)

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL (database)
- Drizzle ORM
- Nodemailer (email sending)
- Express Session (authentication)

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- SMTP server for email

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
DATABASE_URL=postgresql://user:pass@host:port/db
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npm run db:push
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## User Roles

### User
- Create and edit resumes
- Download resumes (within plan limits)
- View subscription status

### Admin
- All user capabilities
- View all users
- View subscription statistics

### Super Admin
- All admin capabilities
- Create/edit/delete subscription plans
- Manually activate subscriptions
- Change user roles
- Delete users

**Default Super Admin**: kaushlendra.k12@fms.edu

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

## File Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── templates/ # Resume template components
│   │   │   └── ui/        # Shadcn UI components
│   │   ├── lib/           # Utilities and helpers
│   │   ├── pages/         # Page components
│   │   └── hooks/         # Custom React hooks
│   └── index.html
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── session-store.ts   # Session management
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema (Drizzle)
└── package.json
```

## License

All rights reserved.
