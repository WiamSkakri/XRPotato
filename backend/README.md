# XRPotato Backend Setup

## Prerequisites
- Node.js (v16 or higher)
- Supabase account and project

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Database

#### A. Run SQL Migration in Supabase
1. Open your Supabase dashboard
2. Go to **SQL Editor** (in the left sidebar)
3. Click **New Query**
4. Copy the contents of `migrations/001_create_tables.sql`
5. Paste and click **Run** to create all tables

#### B. Get Connection String
1. In Supabase, go to **Project Settings** (gear icon)
2. Click **Database**
3. Find **Connection String** section
4. Copy the **Connection pooling** URI
5. Replace `[YOUR-PASSWORD]` with your database password

### 3. Configure Environment Variables
1. Copy `.env.example` to `.env`
```bash
cp .env.example .env
```

2. Edit `.env` and add your connection string:
```
DATABASE_URL=postgresql://postgres.xxxxx:[YOUR-PASSWORD]@xxx.pooler.supabase.com:6543/postgres
```

### 4. Start the Server
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

- `GET /health` - Health check
- `GET /api/papers` - List all papers
- `GET /api/papers/:id` - Get paper details
- `POST /api/papers` - Submit new paper
- `GET /api/users/me` - Get current user

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js         # Database connection
│   ├── models/                 # Sequelize models
│   ├── routes/                 # API routes
│   ├── services/              # Business logic
│   └── middleware/            # Authentication & validation
├── migrations/                # SQL migration files
├── server.js                  # Entry point
└── .env                       # Environment variables (create this)
```
