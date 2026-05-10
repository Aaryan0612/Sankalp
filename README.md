# The Steady Path

The Steady Path is a Vite + React accountability app backed by Supabase.

## Stack

- Vite
- React
- Supabase Auth
- Supabase Postgres
- Supabase Storage

## Local setup

1. Install dependencies:
   `npm install`
2. Create `.env` from `.env.example`.
3. Paste your Supabase project URL and anon key.
4. Run the SQL in `supabase-schema.sql` inside Supabase.
5. Start the app:
   `npm run dev`

## Build

`npm run build`

## Deploy to Vercel

1. Import the project into Vercel.
2. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy.

## Supabase auth setup

1. In Supabase, enable the Google provider under `Authentication -> Providers`.
2. Add your local and deployed URLs to `Authentication -> URL Configuration`.
3. For local development, include:
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
4. For production, add your Vercel domain as well.

## Notes

- `execution2.html` remains in the repo only as a legacy prototype reference.
- The actual app entrypoint is `src/main.jsx`.
