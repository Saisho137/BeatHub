<p align="center">
  <img src="frontend_beathub/public/favicon.svg" width="72" height="72" alt="BeatHub logo">
</p>

<h1 align="center">BeatHub</h1>

<p align="center"><strong>Your Spotify, in numbers.</strong></p>

BeatHub connects to your Spotify account and turns your listening history into statistics: your top songs and artists in different periods, how your taste changes over time, your whole library, the decades you really listen to and the hours you listen the most. You can also explore any song, album or artist and play it right there.

> **Why clone it instead of using the public site?**
> Spotify only lets an app in *Development Mode* have **5 users**, all added by hand. The public deployment is therefore limited to a few people. To use BeatHub yourself, clone this repository and connect it to **your own Spotify app**. It takes about 5 minutes.

## Features

- **Statistics**: top songs and artists for the last 4 weeks, 6 months or all time; total listening time, average release year ("your music age"), singles and explicit share, a chart of your decades, new obsessions vs. artists that are always there, and your listening clock (plays by hour and weekday).
- **Library**: analysis of every song you saved with ♡: songs saved per year, your library by decade, most saved artists, your first saved song.
- **Explore**: search songs, artists, albums and genres. Song, artist and album pages include the Spotify player, details, discography and tracklists.
- **Now playing**: what is playing on your Spotify, shown under the header.
- Dark and light themes.

## Requirements

- **Node.js 26** and **npm 11**. The exact versions are pinned with [Volta](https://volta.sh/) in `frontend_beathub/package.json`; with Volta installed they are selected automatically.
- A **Spotify Premium** account. Spotify requires it for the owner of a Development Mode app.

## Getting started

### 1. Create your Spotify app

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard), log in and accept the terms.
2. Click **Create app** and fill in:
   - **App name / description**: anything, e.g. `BeatHub`.
   - **Redirect URI**: `http://127.0.0.1:3000/callback` (click **Add**). It must match exactly; Spotify does not accept `localhost`.
   - **Which API/SDKs**: select **Web API**.
3. Save, open **Settings** and copy the **Client ID**. You do **not** need the Client Secret: BeatHub logs in with the Authorization Code flow with PKCE, which runs entirely in the browser.

### 2. Run BeatHub locally

```bash
git clone https://github.com/Saisho137/BeatHub.git
cd BeatHub/frontend_beathub
cp .env.example .env.local
```

Edit `.env.local` and paste your Client ID:

```bash
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id
```

Install and start the app:

```bash
npm install
npm run dev -- -H 127.0.0.1
```

Open **http://127.0.0.1:3000** (not `localhost`) and click **Login with Spotify**.

### 3. Share it with friends (optional)

Up to 5 people can use your app. Add each one in the Spotify dashboard under **Settings → User Management**, with the name and email of their Spotify account.

## Deploy your own copy

The app is a standard Next.js project, ready for [Vercel](https://vercel.com/):

1. Import the repository in Vercel and set **Root Directory** to `frontend_beathub`.
2. In **Settings → Build and Deployment**, set **Node.js Version** to **26.x**.
3. In **Settings → Environment Variables**, add `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` for **Production** and **Preview**. The value is read at build time, so redeploy after adding or changing it.
4. Add `https://<your-domain>/callback` to the Redirect URIs of your Spotify app.

## Limitations of Spotify Development Mode

- **5 users** per app, and the owner needs Premium.
- Some Spotify features are no longer available to these apps (recommendations, related artists, audio features, artist top tracks, 30-second previews, among others). See the [February 2026 migration guide](https://developer.spotify.com/documentation/web-api/tutorials/february-2026-migration-guide).
- Searches return up to 10 results.
- Requests are rate limited. If Spotify answers `429 Too Many Requests` (for example after analyzing a large library), BeatHub shows a message to try again in a few minutes.
- Sessions last 1 hour; after that you are asked to log in again.

## Troubleshooting

| Problem | Solution |
|---|---|
| `INVALID_CLIENT: Invalid redirect URI` or `redirect_uri: Not matching configuration` | The Redirect URI in your Spotify app must be exactly `http://127.0.0.1:3000/callback` (or your production URL + `/callback`). Open the app on `127.0.0.1`, not `localhost`. |
| "NEXT_PUBLIC_SPOTIFY_CLIENT_ID is not set" | Create `frontend_beathub/.env.local` with your Client ID and restart `npm run dev`. On Vercel, add the variable and redeploy. |
| Login works but a friend cannot log in | Add their Spotify account under **User Management** (max. 5 users). |
| "Spotify is limiting requests right now" | Spotify's rate limit; wait the indicated time. |
| Strange errors after updating the code | Stop the dev server, delete `frontend_beathub/.next` and start it again. |

## Project structure

```
frontend_beathub/
├── pages/         Pages: statistics, library, recommender (Explore), song, artist, album, genre
│   └── api/       API routes that call the Spotify Web API with the user's token
├── components/    Layout, header, theme toggle, charts and shared UI
├── lib/           Spotify login (PKCE), API helper (retries and errors), formatting and insights
├── styles/        Global design tokens and page styles
└── public/        Icons and images
```

---

BeatHub is a personal project and is not affiliated with Spotify. Music data and playback are provided by Spotify.
