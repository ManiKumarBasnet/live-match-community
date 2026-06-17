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
- **Fan Zone** - match rooms let signed-in fans post comments, wishes, and
  predictions. Without Supabase settings this uses browser storage. With the
  Supabase settings below it becomes shared for everyone.
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

## Shared Fan Zone

Create a free Supabase project, then run this SQL in the Supabase SQL editor:

```sql
create table if not exists public.fan_comments (
  id uuid primary key default gen_random_uuid(),
  match_id integer not null,
  type text not null check (type in ('comment', 'wish', 'prediction')),
  text text not null check (char_length(text) <= 220),
  author text not null,
  role text not null default 'guest',
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.fan_comments enable row level security;

create policy "fan comments are readable"
on public.fan_comments for select
using (true);

create policy "fans can post comments"
on public.fan_comments for insert
with check (true);

create policy "comments can be hidden"
on public.fan_comments for update
using (true)
with check (true);
```

In Vercel, add these environment variables and redeploy:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```
