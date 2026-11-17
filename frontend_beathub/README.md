# BeatHub

Your Spotify listening statistics: top songs and artists by period, how your taste changes over time, your library, the decades you listen to and when you listen. You can also explore and play any song, album or artist.

Built with [Next.js](https://nextjs.org/) (pages router) and the [Spotify Web API](https://developer.spotify.com/documentation/web-api).

## Getting Started

### 1. Create a Spotify app

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and create an app (select **Web API**).
2. Add these **Redirect URIs** (they must match exactly):
   - `http://127.0.0.1:3000/callback` (local development; Spotify does not accept `localhost`)
   - `https://<your-domain>/callback` (production)
3. Copy the app's **Client ID**. The Client Secret is not needed: login uses the Authorization Code flow with PKCE.

### 2. Configure and run

```bash
cp .env.example .env.local   # then set NEXT_PUBLIC_SPOTIFY_CLIENT_ID
npm install
npm run dev -- -H 127.0.0.1
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) (not `localhost`).

### 3. Deploy

Set `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` in your hosting provider (e.g. Vercel → Settings → Environment Variables) and register the production `/callback` URL in the Spotify dashboard.

## Spotify Development Mode limits

Apps in Development Mode (the default) have restrictions:

- The app owner needs **Spotify Premium**, and only **5 users** can log in. Add them in the dashboard under **User Management**.
- Some endpoints are not available (recommendations, related artists, audio features, artist top tracks, 30s previews, among others). See the [February 2026 migration guide](https://developer.spotify.com/documentation/web-api/tutorials/february-2026-migration-guide).
- Search returns at most 10 results per request, and artist albums 10 per page.
- Requests are rate limited. If Spotify answers `429 Too Many Requests`, the app shows a message to try again later.
- Access tokens last 1 hour; after that you are asked to log in again.

## Project structure

- `pages/` – pages (`statistics`, `library`, `recommender` = Explore, `song`, `artist`, `album`, `genre`)
- `pages/api/` – API routes that call the Spotify Web API with the user's token
- `lib/` – Spotify auth (PKCE), API helper (retries and error handling), formatting and insights
- `components/` – layout, header, charts and shared UI
