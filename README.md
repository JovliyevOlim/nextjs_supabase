## Run The Project (Step-by-Step)

Follow this sequence to run the project with a fresh Supabase instance.

## 1. Create a Supabase project

Create a new project in the Supabase dashboard and copy these values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 2. Configure environment variables

In the project root, create or update `.env`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 3. Install dependencies

```bash
npm install
```

## 4. Initialize database and seed data

```bash
npm run db:setup
```

This runs:

- `db:push`: applies SQL migrations from `supabase/migrations`
- `db:seed`: loads sample data from `src/data/*.json`

## 5. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

- `supabase/migrations/`: SQL migrations
- `src/data/`: sample JSON data
- `src/components/grid/`: AG Grid component
- `import-data.js`: seed script for JSON imports
