# Germany Startup Map Platform

A comprehensive Next.js monorepo application for connecting Chinese entrepreneurs with resources, services, and opportunities in Germany.

## Features

### MVP Core Features
- ✅ Business information database
- ✅ User registration and profiles
- ✅ Search and discovery functionality
- ✅ Basic real estate analytics
- ✅ Resource directory
- ✅ Contact and inquiry system

### Technical Stack
- **Frontend**: Next.js 14 with React and TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl (English, Chinese, German)

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- A Supabase account and project

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Run the migration file in your Supabase SQL editor:
     - Go to SQL Editor in Supabase dashboard
     - Copy and run the contents of `supabase/migrations/001_initial_schema.sql`

3. **Configure environment variables**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
platform/
├── app/                    # Next.js app directory
│   └── [locale]/          # Internationalized routes
│       ├── auth/          # Authentication pages
│       ├── businesses/    # Business listings
│       ├── services/      # Service providers
│       ├── real-estate/   # Real estate listings
│       ├── resources/     # Resource directory
│       └── contact/       # Contact page
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── business/         # Business-related components
│   ├── services/         # Service-related components
│   ├── search/           # Search components
│   └── ui/               # UI components
├── lib/                  # Utility libraries
│   └── supabase/         # Supabase client setup
├── messages/             # i18n translation files
├── supabase/             # Supabase migrations
│   └── migrations/       # Database migrations
└── public/               # Static assets
```

## Database Schema

The application uses the following main tables:
- `user_profiles` - User profile information
- `businesses` - Business listings
- `service_providers` - Service provider directory
- `real_estate` - Real estate listings
- `resources` - Resource directory
- `inquiries` - Contact inquiries
- `reviews` - Service provider reviews

See `supabase/migrations/001_initial_schema.sql` for the complete schema.

## Internationalization

The platform supports three languages:
- English (en) - Default
- Chinese (zh) - 中文
- German (de) - Deutsch

Language switching is available in the navigation bar.

## Development

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables
4. Deploy!

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Next Steps

### Phase 1 Enhancements
- [ ] User dashboard
- [ ] Business creation form
- [ ] Service provider registration
- [ ] Real estate listing creation
- [ ] Advanced search filters
- [ ] Map integration for locations

### Phase 2 Features
- [ ] Review and rating system
- [ ] Messaging system
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Admin panel

## License

See LICENSE file for details.
