# Contributing

Thanks for helping improve the DHI Office World Cup app.

## Local Setup

```bash
npm install
npm run dev
```

Run a production build before opening a pull request:

```bash
npm run build
```

## Suggested Workflow

1. Create a branch from `master`.
2. Make one focused change.
3. Run `npm run build`.
4. Open a pull request with screenshots or a short explanation.
5. Wait for review before merging to the deployed branch.

## What To Include In A Pull Request

- What changed.
- Which screen or flow was tested.
- Any data migration or shared-state impact.
- Screenshots for UI changes, especially mobile.

## Project Notes

- The main UI is in `src/App.jsx`.
- Shared comments are handled by `api/fan-comments.js`.
- Shared app state is handled by `api/app-state.js`.
- Vercel Blob is used for the live app.
- Avoid committing `.env.local`, `.vercel`, `dist`, or `node_modules`.

## Safety Rules

- Do not commit real secrets or private tokens.
- Do not expose new admin-only behavior without discussing authentication.
- Keep existing comments, profile photos, votes, and polls backward compatible.
- Keep mobile layout usable; check narrow screens before submitting UI changes.

## Good First Issues

- Better mobile spacing and navigation.
- Comment tagging and notifications.
- Poll creation improvements.
- Past match chat browsing.
- Prediction ranking details.
- More focused tests for Fan Zone and profile upload persistence.
