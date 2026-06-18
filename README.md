# DHI Office World Cup 2026

Public office World Cup pool app for fixtures, standings, Fan Zone comments,
profile photos, predictions, polls, and organizer controls.

Live app:

https://office-world-cup.vercel.app

## What This Repo Is For

Use the live app link for normal office use. Use this repo for code changes,
design refinements, bug fixes, new match/poll features, and review through pull
requests.

Recommended public workflow:

1. Create a public GitHub repository.
2. Push this project to that repository.
3. Invite teammates as collaborators, or let anyone fork and open pull requests.
4. Connect the GitHub repository to Vercel so every merge deploys automatically.

## Run Locally

```bash
npm install
npm run dev
```

Open the printed local URL, usually:

```text
http://localhost:5173
```

Build check:

```bash
npm run build
```

## Deploy

This app is already designed for Vercel.

1. Import the GitHub repository at https://vercel.com/new.
2. Keep the default Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add a Vercel Blob store and link it to the project.
4. Deploy.

The app uses:

- `api/fan-comments.js` for shared Fan Zone comments.
- `api/app-state.js` for shared players, avatars, votes, polls, and match state.
- `vercel.json` to proxy ESPN scoreboard requests through `/api/espn/*`.

Vercel Blob creates `BLOB_READ_WRITE_TOKEN` automatically when linked. Do not
commit `.env.local`, `.vercel`, or any secret values.

## Sign In And Roles

- Official participants are listed in `APPROVED` inside `src/App.jsx`.
- Official participants can vote, create polls, and upload profile photos.
- Guests can enter with a display name and comment in Fan Zone.
- Admin mode currently uses the client-side `ADMIN_PIN` in `src/App.jsx`.

Important: client-side admin PINs are not secure in a public repository. Treat it
as a light office gate only. If this becomes fully public beyond the office, move
admin actions behind real authentication before trusting the data.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

Good first changes:

- Add fixtures, poll ideas, or player display details.
- Improve mobile layout.
- Add notification/tagging behavior.
- Improve ranking and prediction scoring.
- Add tests for Fan Zone, profile persistence, and voting flows.

## Current Live Data

The production app stores shared comments and app state in Vercel Blob. Local
development uses browser storage unless it is running on a hosted domain.

If you change the state schema, keep backward compatibility in `src/App.jsx` so
existing deployed comments, avatars, votes, and polls still load.
