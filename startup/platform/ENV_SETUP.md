# Environment Variables Setup

## Local Development

Create a `.env.local` file in the `startup/platform/` directory with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://pdagvmqinrowuusglkof.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkYWd2bXFpbnJvd3V1c2dsa29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzU1MjEsImV4cCI6MjA4ODc1MTUyMX0.CmFZd2uxjJXu-7MdXftxG7J_-aAiJUC2o2Ld208nvzg

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Vercel Deployment

Add these environment variables in your Vercel project settings:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add the following:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://pdagvmqinrowuusglkof.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkYWd2bXFpbnJvd3V1c2dsa29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzU1MjEsImV4cCI6MjA4ODc1MTUyMX0.CmFZd2uxjJXu-7MdXftxG7J_-aAiJUC2o2Ld208nvzg`
   - `NEXT_PUBLIC_APP_URL` = Your production URL (e.g., `https://your-app.vercel.app`)

## After Setting Up

1. Make sure you've run the database migration in Supabase SQL Editor
2. Restart your development server: `npm run dev`
3. The app should now fetch data from Supabase and display maps
