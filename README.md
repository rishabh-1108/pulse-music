# Pulse Music

A production-ready music streaming platform built with Next.js 15, Express, PostgreSQL, Prisma, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Zustand, React Query, Radix UI, React Hook Form
- **Backend**: Express.js, TypeScript, Prisma ORM, PostgreSQL, JWT + Refresh Tokens, Zod validation
- **Design**: Premium dark glassmorphism UI with animated gradients, blur effects, skeleton loading, smooth transitions

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (or Docker)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd pulse-music

# Install dependencies
npm install
```

### Environment Setup

```bash
# Server
cp apps/server/.env.example apps/server/.env
# Edit apps/server/.env with your database URL and JWT secrets

# Web
cp apps/web/.env.example apps/web/.env.local 2>/dev/null || true
```

### Database Setup

```bash
# Using Docker for PostgreSQL
docker-compose up -d postgres

# Generate Prisma client and push schema
cd apps/server
npx prisma generate
npx prisma db push

# Seed the database with default accounts and sample data
npm run db:seed
```

### Running the App

```bash
# From the root
npm run dev

# Or individually
npm run dev --workspace=apps/server
npm run dev --workspace=apps/web
```

- **Web**: http://localhost:3000
- **API**: http://localhost:5000/api/v1

## Default Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@pulse.music | Password123 | ADMIN |
| user@pulse.music | Password123 | USER |
| artist@pulse.music | Password123 | ARTIST |

## Features

### Core
- JWT authentication with access + refresh tokens
- Role-based access control (USER, ARTIST, ADMIN)
- Full-text search for songs, artists, albums, playlists
- Trending, new releases, and genre-based browsing
- Song play counts and like/unlike functionality

### Music
- Audio player with play/pause, next/previous, seek, volume
- Queue management with shuffle and repeat modes
- Fullscreen player and mini player
- Artist pages with albums, songs, and follow/unfollow
- Album pages with song listings
- Playlist pages with play all

### Social
- User profiles with stats
- Like songs, albums, and artists
- Follow/unfollow artists
- Listening history tracking
- Create and manage playlists

### Admin
- Dashboard with platform statistics
- Manage users (view, delete, filter by role)
- Manage songs (view, delete, search)
- Manage albums (view, delete, search)
- Manage artists (verify/unverify, delete)
- Manage genres (create, delete)

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/verify-email` - Verify email

### Songs
- `GET /api/v1/songs` - List songs
- `GET /api/v1/songs/:id` - Get song details
- `GET /api/v1/songs/trending` - Trending songs

### Albums
- `GET /api/v1/albums` - List albums
- `GET /api/v1/albums/:id` - Get album with songs
- `GET /api/v1/albums/new-releases` - New releases

### Artists
- `GET /api/v1/artists` - List artists
- `GET /api/v1/artists/:slug` - Get artist details
- `POST /api/v1/artists/:id/followers` - Follow artist
- `DELETE /api/v1/artists/:id/followers` - Unfollow artist

### Playlists
- `GET /api/v1/playlists` - List user playlists
- `POST /api/v1/playlists` - Create playlist
- `GET /api/v1/playlists/:id` - Get playlist with songs
- `POST /api/v1/playlists/:id/songs` - Add song to playlist
- `DELETE /api/v1/playlists/:id/songs/:songId` - Remove song from playlist

### Search
- `GET /api/v1/search?q=query` - Search songs, artists, albums, playlists

### Users
- `GET /api/v1/users/me` - Get current user
- `PATCH /api/v1/users/me` - Update profile
- `GET /api/v1/users/me/likes` - Get liked songs
- `GET /api/v1/users/me/history` - Get listening history
- `GET /api/v1/users/me/stats` - Get user stats

### Genres
- `GET /api/v1/genres` - List genres

### Notifications
- `GET /api/v1/notifications` - List notifications
- `PATCH /api/v1/notifications/:id/read` - Mark as read
- `PATCH /api/v1/notifications/read-all` - Mark all as read

### Admin
- `GET /api/v1/admin/stats` - Platform statistics
- `GET /api/v1/admin/users` - List all users
- `GET /api/v1/admin/songs` - List all songs
- `GET /api/v1/admin/albums` - List all albums
- `GET /api/v1/admin/artists` - List all artists
- `DELETE /api/v1/admin/users/:id` - Delete user
- `DELETE /api/v1/admin/songs/:id` - Delete song
- `DELETE /api/v1/admin/albums/:id` - Delete album
- `DELETE /api/v1/admin/artists/:id` - Delete artist
- `PATCH /api/v1/admin/artists/:id` - Verify/unverify artist
- `POST /api/v1/admin/genres` - Create genre
- `DELETE /api/v1/admin/genres/:id` - Delete genre

## Project Structure

```
pulse-music/
├── apps/
│   ├── server/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   └── src/
│   │       ├── config/
│   │       ├── controllers/
│   │       ├── middleware/
│   │       ├── routes/
│   │       ├── types/
│   │       ├── utils/
│   │       └── index.ts
│   └── web/
│       └── src/
│           ├── app/          # Next.js App Router pages
│           ├── components/
│           │   ├── ui/       # Reusable UI components
│           │   ├── layout/   # Layout components
│           │   ├── music/    # Music-specific components
│           │   └── player/   # Player components
│           ├── hooks/
│           ├── lib/
│           ├── providers/
│           ├── services/
│           └── stores/
├── docker-compose.yml
├── .github/workflows/ci.yml
└── package.json
```

## Deployment

This is a full-stack monorepo. The two parts deploy to different hosting because Vercel runs Node serverless functions but **cannot host a persistent Express server or PostgreSQL**.

### Frontend (Web) — Vercel

- The Next.js app is at `apps/web`; the root `vercel.json` points Vercel there automatically.
- Set `NEXT_PUBLIC_API_URL` to the **public URL of the deployed API** (e.g. `https://api.your-domain.com/api/v1`).
- Optional: `NEXT_PUBLIC_APP_NAME`.

### Backend (API) — Render / Railway / Fly.io

- Deploy `apps/server` as a Node service, or use the provided `Dockerfile` / `docker-compose.yml` (`server` service).
- Set these env vars (names only — fill real values in your hosting provider's dashboard; **never commit secrets**):

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Access-token signing secret |
| `JWT_REFRESH_SECRET` | Refresh-token signing secret |
| `JWT_EXPIRES_IN` | e.g. `15m` |
| `JWT_REFRESH_EXPIRES_IN` | e.g. `7d` |
| `CLIENT_URL` | Public web URL (CORS) |
| `CORS_ORIGIN` | Web origin allowed for CORS |
| `PORT` | e.g. `5000` |
| `NODE_ENV` | `production` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_CALLBACK_URL` | Optional OAuth |
| `CLOUDINARY_*`, `AWS_*`, `STRIPE_SECRET_KEY` | Optional media/payments |

### Database — Neon / Supabase / Railway

- Provision a PostgreSQL 16 instance and use its connection string as `DATABASE_URL`.
- Run `cd apps/server && npx prisma generate && npx prisma db push && npm run db:seed` (CI or locally).

After both are deployed, set the web app's `NEXT_PUBLIC_API_URL` to the API URL and redeploy.

## License

MIT
