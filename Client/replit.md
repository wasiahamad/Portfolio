# Portfolio Website

## Overview

A modern, full-stack portfolio website built with React frontend and Express backend. Features an admin panel for content management, MongoDB for data persistence, and a responsive design with dark/light theme support. The application showcases projects, blog posts, work experience, and provides a contact form for visitors.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing (Home and Admin pages)
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **State Management**: TanStack React Query for server state and data fetching
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Forms**: React Hook Form with Zod validation
- **Theme**: Custom theme provider supporting dark/light mode with CSS variables

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM for data modeling
- **Session Management**: Express sessions for admin authentication
- **Password Security**: bcryptjs for password hashing
- **API Structure**: RESTful endpoints under `/api/` prefix
  - Auth routes: `/api/auth/login`, `/api/auth/logout`, `/api/auth/check`
  - CRUD routes for: projects, blogs, experience, contacts, profile

### Data Models (MongoDB)
- **Project**: Portfolio projects with title, description, tags, URLs
- **Blog**: Blog posts with content, category, publish status
- **Experience**: Work experience entries with role, company, skills
- **Contact**: Contact form submissions
- **Profile**: Single document for personal info and social links
- **Admin**: Admin user credentials

### Authentication
- Session-based authentication for admin access
- Custom middleware (`adminAuthMiddleware`) protects admin routes
- Session stored server-side with admin ID reference

### Build System
- Development: Vite dev server with HMR
- Production: esbuild bundles server code, Vite builds client assets
- Output: `dist/` directory with `public/` for static assets and `index.cjs` for server

## External Dependencies

### Database
- **MongoDB**: Primary database via `MONGODB_URI` environment variable
- **Drizzle**: Schema defined in `shared/schema.ts` for PostgreSQL (configured but MongoDB is used in routes)

### Frontend Libraries
- **@tanstack/react-query**: Data fetching and caching
- **framer-motion**: Animations
- **@radix-ui/***: Headless UI primitives for shadcn components
- **lucide-react**: Icon library

### Backend Libraries
- **mongoose**: MongoDB ODM
- **express-session**: Session management
- **bcryptjs**: Password hashing

### Development Tools
- **drizzle-kit**: Database migrations (PostgreSQL schema)
- **tsx**: TypeScript execution for development
- **esbuild**: Production bundling

### Environment Variables Required
- `MONGODB_URI`: MongoDB connection string
- `DATABASE_URL`: PostgreSQL connection (for Drizzle, if used)