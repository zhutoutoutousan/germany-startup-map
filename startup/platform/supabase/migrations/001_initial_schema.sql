-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  language_preference TEXT DEFAULT 'en' CHECK (language_preference IN ('en', 'zh', 'de')),
  user_type TEXT DEFAULT 'entrepreneur' CHECK (user_type IN ('entrepreneur', 'service_provider', 'admin')),
  company_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Business Listings
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_zh TEXT,
  name_de TEXT,
  description TEXT,
  description_zh TEXT,
  description_de TEXT,
  business_type TEXT NOT NULL CHECK (business_type IN ('restaurant', 'retail', 'ecommerce', 'service', 'other')),
  category TEXT,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Germany',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  email TEXT,
  website TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Service Providers
CREATE TABLE IF NOT EXISTS public.service_providers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_name_zh TEXT,
  company_name_de TEXT,
  service_type TEXT NOT NULL CHECK (service_type IN ('legal', 'accounting', 'real_estate', 'consulting', 'supply_chain', 'other')),
  description TEXT,
  description_zh TEXT,
  description_de TEXT,
  address TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Germany',
  phone TEXT,
  email TEXT,
  website TEXT,
  languages TEXT[] DEFAULT ARRAY['en'],
  rating DECIMAL(3, 2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Real Estate Listings
CREATE TABLE IF NOT EXISTS public.real_estate (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('rental', 'sale', 'lease')),
  property_type TEXT NOT NULL CHECK (property_type IN ('commercial', 'retail', 'office', 'warehouse', 'mixed_use')),
  title TEXT NOT NULL,
  title_zh TEXT,
  title_de TEXT,
  description TEXT,
  description_zh TEXT,
  description_de TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Germany',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  size_sqm DECIMAL(10, 2),
  price_monthly DECIMAL(12, 2),
  price_total DECIMAL(12, 2),
  currency TEXT DEFAULT 'EUR',
  available_from DATE,
  features JSONB,
  images TEXT[],
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'pending', 'sold', 'rented')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Resources Directory
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  title_zh TEXT,
  title_de TEXT,
  description TEXT,
  description_zh TEXT,
  description_de TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('guide', 'document', 'link', 'tool', 'contact')),
  category TEXT,
  url TEXT,
  file_url TEXT,
  tags TEXT[],
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'zh', 'de', 'all')),
  featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Inquiries/Contacts
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('general', 'business', 'service', 'real_estate', 'resource')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  related_business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  related_service_id UUID REFERENCES public.service_providers(id) ON DELETE SET NULL,
  related_real_estate_id UUID REFERENCES public.real_estate(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  service_provider_id UUID REFERENCES public.service_providers(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, service_provider_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON public.businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_city ON public.businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_business_type ON public.businesses(business_type);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON public.businesses(status);

CREATE INDEX IF NOT EXISTS idx_service_providers_user_id ON public.service_providers(user_id);
CREATE INDEX IF NOT EXISTS idx_service_providers_service_type ON public.service_providers(service_type);
CREATE INDEX IF NOT EXISTS idx_service_providers_city ON public.service_providers(city);
CREATE INDEX IF NOT EXISTS idx_service_providers_status ON public.service_providers(status);

CREATE INDEX IF NOT EXISTS idx_real_estate_city ON public.real_estate(city);
CREATE INDEX IF NOT EXISTS idx_real_estate_listing_type ON public.real_estate(listing_type);
CREATE INDEX IF NOT EXISTS idx_real_estate_property_type ON public.real_estate(property_type);
CREATE INDEX IF NOT EXISTS idx_real_estate_status ON public.real_estate(status);

CREATE INDEX IF NOT EXISTS idx_resources_resource_type ON public.resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_language ON public.resources(language);

CREATE INDEX IF NOT EXISTS idx_inquiries_user_id ON public.inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_inquiry_type ON public.inquiries(inquiry_type);

CREATE INDEX IF NOT EXISTS idx_reviews_service_provider_id ON public.reviews(service_provider_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_estate ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for businesses
CREATE POLICY "Anyone can view active businesses" ON public.businesses FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create own businesses" ON public.businesses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own businesses" ON public.businesses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own businesses" ON public.businesses FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for service_providers
CREATE POLICY "Anyone can view active service providers" ON public.service_providers FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create own service providers" ON public.service_providers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own service providers" ON public.service_providers FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for real_estate
CREATE POLICY "Anyone can view available real estate" ON public.real_estate FOR SELECT USING (status = 'available');
CREATE POLICY "Authenticated users can create real estate listings" ON public.real_estate FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own real estate" ON public.real_estate FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for resources
CREATE POLICY "Anyone can view resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Admins can manage resources" ON public.resources FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);

-- RLS Policies for inquiries
CREATE POLICY "Users can view own inquiries" ON public.inquiries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can create inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own inquiries" ON public.inquiries FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON public.businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_providers_updated_at BEFORE UPDATE ON public.service_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_real_estate_updated_at BEFORE UPDATE ON public.real_estate FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON public.inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update service provider rating
CREATE OR REPLACE FUNCTION update_service_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.service_providers
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM public.reviews
            WHERE service_provider_id = NEW.service_provider_id
        ),
        review_count = (
            SELECT COUNT(*)
            FROM public.reviews
            WHERE service_provider_id = NEW.service_provider_id
        )
    WHERE id = NEW.service_provider_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rating_on_review_insert
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION update_service_provider_rating();
