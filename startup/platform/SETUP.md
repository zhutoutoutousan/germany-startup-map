# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Supabase**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Wait for the project to be fully provisioned
   - Go to Settings → API
   - Copy your Project URL and anon/public key

3. **Configure Environment**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     ```

4. **Run Database Migration**
   - In Supabase Dashboard, go to SQL Editor
   - Open `supabase/migrations/001_initial_schema.sql`
   - Copy the entire contents and paste into SQL Editor
   - Click "Run" to execute the migration
   - This creates all necessary tables, indexes, and RLS policies

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open Browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - You should see the homepage with language selector

## Database Setup Details

The migration creates the following tables:
- `user_profiles` - Extended user information
- `businesses` - Business listings
- `service_providers` - Service provider directory
- `real_estate` - Property listings
- `resources` - Resource directory
- `inquiries` - Contact inquiries
- `reviews` - Service provider reviews

All tables have Row Level Security (RLS) enabled with appropriate policies.

## Testing the Application

1. **Create an Account**
   - Click "Login" in the navigation
   - Click "Sign Up" to create a new account
   - Verify your email (if email confirmation is enabled in Supabase)

2. **Add a Business**
   - After logging in, go to Dashboard
   - Click "Add Business" (when implemented)
   - Fill in business details

3. **Browse Features**
   - Explore businesses, services, real estate, and resources
   - Use the search functionality
   - Switch languages using the language selector

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check that your `.env.local` file has the correct Supabase URL and anon key
   - Make sure there are no extra spaces or quotes

2. **Database connection errors**
   - Verify the migration was run successfully
   - Check that RLS policies are enabled
   - Ensure your Supabase project is active

3. **Authentication not working**
   - Check Supabase Auth settings
   - Verify email confirmation settings
   - Check browser console for errors

4. **Language switching not working**
   - Clear browser cache
   - Check that middleware is properly configured
   - Verify `next-intl` is installed

## Next Steps

After setup, you can:
- Customize the UI and branding
- Add more features based on requirements
- Set up email templates in Supabase
- Configure storage buckets for file uploads
- Set up production environment variables

## Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set environment variables** in your hosting platform:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (your production URL)

3. **Deploy to Vercel** (recommended):
   - Connect your GitHub repository
   - Vercel will auto-detect Next.js
   - Add environment variables in Vercel dashboard
   - Deploy!

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
