# Programmers Point PWA

## Overview

Programmers Point is a Progressive Web App (PWA) designed for an IT training institute to manage student inquiries, showcase company placements, and provide an interactive course exploration experience. The application serves as a digital replacement for paper-based inquiry forms, features a placement showcase with company and student cards, includes an interactive drag-and-drop course explorer (similar to Infinite Craft), and provides data export capabilities to Google Sheets for follow-ups.

The platform is optimized for tablet use with touch-first interactions, supports offline capabilities, and targets institutions seeking to digitize their student management and marketing operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: React with TypeScript, using Vite as the build tool

**UI Framework**: Shadcn UI components built on Radix UI primitives with Tailwind CSS for styling

**Design System**:
- Touch-first design with 48px minimum interactive elements for tablet optimization
- Custom color system using CSS variables for theming (light/dark mode support)
- Typography: Inter for UI text, Poppins for headings
- Responsive breakpoints: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- Design philosophy combines educational platforms (Coursera/Udemy) with SaaS dashboards (Linear/Notion) and gaming UI elements

**State Management**: TanStack Query (React Query) for server state management and caching

**Routing**: Wouter for lightweight client-side routing

**Key Features**:
- PWA manifest for installable app experience
- Interactive drag-and-drop course explorer using @dnd-kit
- Form validation with React Hook Form and Zod
- Responsive design with progressive disclosure patterns

### Backend Architecture

**Runtime**: Node.js with Express.js framework

**API Design**: RESTful API architecture with the following endpoints:
- `/api/inquiries` - Student inquiry management (GET, POST, PATCH)
- `/api/companies` - Company data management (GET, POST, PATCH, DELETE)
- `/api/placements` - Student placement records (GET, POST, PATCH, DELETE)
- `/api/technologies` - Technology/course data with job market statistics (GET, POST, PATCH, DELETE)
- `/api/admin/*` - Admin authentication and management
- `/api/export/*` - Data export functionality (Excel/Google Sheets)

**Type Safety**: Shared TypeScript schemas between frontend and backend using Zod for validation

**Database Layer**: Drizzle ORM for type-safe database operations

**Authentication**: Session-based authentication using bcrypt for password hashing

**Data Export**: Excel export using XLSX library, Google Sheets integration via Google APIs

### Data Storage Solutions

**Database**: PostgreSQL via Neon serverless driver
- Connection pooling for efficient resource usage
- WebSocket support for real-time capabilities

**Schema Design**:
- `admin_users` - Admin authentication (username, hashed password)
- `inquiries` - Student inquiry forms (personal info, course interest, status tracking)
- `companies` - Hiring companies (name, logo, placement count, average package)
- `placements` - Student placement records (student details, company reference, package, photos, reviews)
- `technologies` - Course/technology data (job vacancies, packages, GitHub/NPM stats, auto-updated market data)
- `system_logs` - Activity logging for debugging and audit trails

**Key Architectural Decisions**:
- UUID primary keys for distributed system compatibility
- Foreign key relationships with cascade deletes for data integrity
- Timestamp tracking (createdAt) for all records
- Phone numbers stored in +91XXXXXXXXXX format for WhatsApp integration
- Status tracking for inquiries ("Pending" vs "Joined") for targeted follow-ups

### Authentication & Authorization

**Strategy**: Session-based authentication with server-side session storage

**Implementation**:
- Password hashing using bcrypt with salt rounds
- Session management using connect-pg-simple for PostgreSQL-backed sessions
- Protected admin routes requiring authentication
- Cookie-based session tokens

**Security Considerations**:
- Raw body capture for webhook verification
- Input validation using Zod schemas
- CORS configuration for API security

### External Dependencies

**Database Service**: Neon Serverless PostgreSQL
- Serverless PostgreSQL for scalable data storage
- WebSocket support via ws package for real-time connections
- Environment variable: `DATABASE_URL`

**Google Services Integration**:
- Google Sheets API for automated inquiry export
- Google OAuth2 authentication via Replit Connector
- Service account credentials management
- Access token refresh mechanism
- Target sheet: zeeexshanxkhan@gmail.com

**Job Market Data Sources** (Planned):
- Naukri.com - Job listings scraping
- LinkedIn Jobs - Vacancy data
- Indeed - Market trends
- GitHub API - Technology popularity metrics
- NPM API - JavaScript library statistics
- Automated daily cron job (2 AM) for data updates

**Third-Party UI Libraries**:
- Radix UI - Accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- DND Kit - Touch-enabled drag-and-drop functionality
- React Icons - Icon library (including Simple Icons for tech logos)
- Lucide React - Additional icon set
- CMDK - Command palette component
- Recharts - Data visualization (for charts)

**Development Tools**:
- Replit plugins for runtime error handling and development banner
- ESBuild for server-side bundling
- TypeScript for type safety across the stack
- Drizzle Kit for database migrations

**PWA Features**:
- Service workers for offline functionality
- App manifest for installation
- Touch-optimized interactions with haptic feedback support
- Responsive viewport configuration with user-scalable disabled for app-like experience