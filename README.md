# DHI Office World Cup 2026

A live office World Cup pool dashboard: standings, fixtures, voting, and an
organizer admin panel, wired to a real live-score feed.

## Run it

```bash
npm install
npm run dev
```

Open the printed URL, usually http://localhost:5173.

## Share it online

Use Vercel for the simplest free public URL:

1. Push this folder to a GitHub repository.
2. Import the repository at https://vercel.com/new.
3. Keep the default Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy.

The included `vercel.json` keeps the live ESPN score feed working by proxying
`/api/espn/*` on the deployed site.

Netlify also works with the included `netlify.toml`; use the same build command
and output directory.

## Realtime behaviour

- **Live scores** - the app polls ESPN's public scoreboard feed through
  `/api/espn/...` every 45s, matches games to the office fixtures by team name,
  and updates scores/status automatically. The header chip shows Live when the
  feed is connected, Syncing while connecting, and Offline on error.
- **Cross-tab sync** - votes, scores, bonuses, and announcements are saved to
  `localStorage` and re-read every 5s, so two open tabs/windows stay in sync.
- **Manual fallback** - organizers sign in, tick "I am an organizer", enter PIN
  `admin123`, edit scores by hand, and toggle the auto feed off.

The local dev proxy is defined in `vite.config.js`. Hosted proxy rules are in
`vercel.json` and `netlify.toml`.

## Sign in

- Approved participants, listed in `APPROVED` in `src/App.jsx`, sign in by name
  and can vote and upload a profile photo.
- Anyone else enters as a view-only guest.
- Organizer PIN: `admin123`; change `ADMIN_PIN` in `src/App.jsx`.
