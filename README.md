
# Programmers Point - Institute Management System

A comprehensive Progressive Web App for managing programming institute inquiries, placements, and technology combinations.

## Features

- 📝 Student Inquiry Management
- 🎓 Placement Tracking & Showcase
- 💼 Company Database
- 🔧 Technology Combinations Explorer
- 📊 Google Sheets Integration
- 📱 Progressive Web App (PWA)

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Express.js, Node.js
- **Database:** PostgreSQL (Neon) + Google Sheets
- **Deployment:** Replit

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd programmers-point
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update the following:

```bash
cp .env.example .env
```

**Required Environment Variables:**

- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `SESSION_SECRET`: Generate a random string (use `openssl rand -base64 32`)
- `GOOGLE_SPREADSHEET_ID`: Already configured (1q1mo556ComV_PkDb14wmZcP6Tv__aB6Q2qCfhElmFaU)
- `GOOGLE_SHEETS_PRIVATE_KEY`: Already configured
- `GOOGLE_SHEETS_CLIENT_EMAIL`: Already configured

### 4. Initialize Database

```bash
npm run db:push
```

### 5. Seed Google Sheets (Optional)

```bash
npm run seed:sheets
```

### 6. Run Development Server

```bash
npm run dev
```

Visit http://localhost:5000

## Deployment on Replit

### Option 1: Import from Git

1. Go to [Replit](https://replit.com)
2. Click "Create Repl"
3. Select "Import from GitHub"
4. Paste your repository URL
5. Click "Import from GitHub"

### Option 2: Deploy Existing Repl

1. Click the "Deploy" button in Replit
2. Choose "Autoscale" deployment
3. Replit will automatically:
   - Run `npm run build`
   - Start the server with `npm run start`

### Environment Variables in Replit Deployment

**Important:** Set these as Secrets in Replit:

1. Go to the "Secrets" tool (lock icon)
2. Add each variable:
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `GOOGLE_SPREADSHEET_ID`
   - `GOOGLE_SHEETS_PRIVATE_KEY`
   - `GOOGLE_SHEETS_CLIENT_EMAIL`

Or use the `.env` file values (already configured for you).

## Google Sheets Setup

Your Google Sheets spreadsheet is already configured with ID: `1q1mo556ComV_PkDb14wmZcP6Tv__aB6Q2qCfhElmFaU`

The spreadsheet should have these sheets:
- **Technologies**: Technology listings
- **Combinations**: Technology combination data
- **Companies**: Company information
- **Placements**: Student placement records
- **Inquiries**: Student inquiry forms

## API Endpoints

### Admin Panel
- `GET /api/inquiries` - Get all inquiries
- `POST /api/inquiries` - Create inquiry
- `PATCH /api/inquiries/:id` - Update inquiry status

### Companies
- `GET /api/companies` - Get all companies
- `POST /api/companies` - Create company
- `PATCH /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company

### Technology Combinations
- `GET /api/technology-combinations` - Get all combinations
- `POST /api/technology-combinations/match` - Match technologies

### Google Sheets Integration
- `GET /api/sheets/technologies` - Read from Technologies sheet
- `GET /api/sheets/combinations` - Read from Combinations sheet
- `POST /api/import/google-sheets` - Import all data from Sheets to DB

## Project Structure

```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utilities
├── server/              # Express backend
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database layer
│   ├── googleSheets.ts  # Google Sheets integration
│   └── index.ts         # Server entry point
├── shared/              # Shared types/schemas
└── public/              # Static assets
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema
- `npm run seed:sheets` - Seed Google Sheets with sample data

## License

MIT
