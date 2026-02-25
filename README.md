# 🎮 GameHub — Gaming Community Forum

A full-stack gaming forum built with Next.js 14, Prisma, NextAuth, and TailwindCSS.

---

## ✨ Features

- **Authentication** — Register, login, JWT sessions
- **Forum Posts** — Create, view, like posts with rich markdown support
- **Comments** — Nested reply threads with likes
- **Categories** — 8 gaming categories (FPS, RPG, Esports, etc.)
- **User Profiles** — Gamertag, bio, reputation system
- **Search** — Full-text search across posts and tags
- **Admin Panel** — User and post management
- **Trending Sidebar** — Most viewed posts + top members
- **Dark UI** — Sleek gaming aesthetic with neon accents

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
DATABASE_URL="postgresql://user:password@localhost:5432/gaming_forum"
NEXTAUTH_SECRET="your-secret-32-char-key"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate a secret:**
```bash
openssl rand -base64 32
```

### 3. Set up the database

```bash
# Push schema to database
npm run db:push

# Seed with sample data (categories + demo posts)
npm run db:seed
```

### 4. Start the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Database Setup

### Option A: Local PostgreSQL

```bash
# macOS
brew install postgresql && brew services start postgresql

# Ubuntu/Debian
sudo apt install postgresql && sudo service postgresql start

# Create database
psql -c "CREATE DATABASE gaming_forum;"
```

### Option B: Free cloud database

- [Supabase](https://supabase.com) — Free PostgreSQL, copy the connection string
- [Neon](https://neon.tech) — Serverless PostgreSQL, great for production

---

## 📁 Project Structure

```
src/
├── app/                   # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── categories/        # Browse all categories
│   ├── category/[slug]/   # Category posts
│   ├── post/
│   │   ├── [slug]/        # Post detail + comments
│   │   └── new/           # Create post
│   ├── user/[username]/   # User profile
│   ├── search/            # Search results
│   ├── latest/            # Latest posts
│   ├── top/               # Top posts
│   ├── login/             # Auth pages
│   ├── register/
│   ├── settings/          # User settings
│   ├── admin/             # Admin panel (admin only)
│   └── api/               # API routes
│       ├── auth/          # NextAuth + register
│       ├── posts/         # Posts CRUD + likes
│       ├── comments/      # Comments
│       ├── categories/    # Categories list
│       └── user/          # User settings
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── posts/
│   │   ├── PostCard.tsx
│   │   ├── CommentSection.tsx
│   │   └── LikeButton.tsx
│   ├── categories/
│   │   └── CategoryCard.tsx
│   └── Providers.tsx
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   └── auth.ts            # NextAuth config
└── types/
    └── index.ts           # TypeScript types
prisma/
├── schema.prisma          # Database schema
└── seed.js                # Seed script
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth.js |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Passwords | bcryptjs |
| Dates | date-fns |

---

## 🌐 Deployment

### Deploy to Vercel + Supabase (recommended)

1. Push code to GitHub
2. Create Supabase project → copy DATABASE_URL
3. Deploy on Vercel → add environment variables
4. Run `npx prisma db push` and `node prisma/seed.js`

---

## 🎮 Default Admin Account

After seeding, an admin account is created:

- **Email:** `admin@gamehub.com`
- **Password:** `admin123`

> ⚠️ Change this password immediately in production!

---

## 📜 License

MIT — feel free to use this for your own gaming community!
