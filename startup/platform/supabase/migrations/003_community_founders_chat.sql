-- Community, founder matching, and in-app mail-style chat
-- Apply in Supabase SQL editor, then run: npx prisma generate

CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  locale TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.founder_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  headline TEXT NOT NULL,
  bio TEXT,
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  seeking TEXT[] DEFAULT ARRAY[]::TEXT[],
  stage TEXT NOT NULL DEFAULT 'idea',
  city TEXT NOT NULL,
  country TEXT DEFAULT 'Germany',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.founder_match_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  intro_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT founder_match_unique_pair UNIQUE (from_user_id, to_user_id)
);

CREATE TABLE IF NOT EXISTS public.chat_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_a_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT chat_thread_unique_pair UNIQUE (user_a_id, user_b_id),
  CONSTRAINT chat_thread_order CHECK (user_a_id < user_b_id)
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  read_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_community_posts_created ON public.community_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_founder_profiles_city ON public.founder_profiles (city);
CREATE INDEX IF NOT EXISTS idx_founder_match_to_status ON public.founder_match_requests (to_user_id, status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_thread ON public.chat_messages (thread_id, created_at);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.founder_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.founder_match_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "community_posts_select" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "community_posts_insert" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "community_posts_update" ON public.community_posts FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "founder_profiles_select" ON public.founder_profiles FOR SELECT USING (visible = true OR auth.uid() = user_id);
CREATE POLICY "founder_profiles_all_own" ON public.founder_profiles FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "match_select_parties" ON public.founder_match_requests FOR SELECT
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE POLICY "match_insert_from" ON public.founder_match_requests FOR INSERT WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "match_update_parties" ON public.founder_match_requests FOR UPDATE
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "chat_thread_select" ON public.chat_threads FOR SELECT
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);
CREATE POLICY "chat_thread_insert" ON public.chat_threads FOR INSERT
  WITH CHECK (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE POLICY "chat_message_select" ON public.chat_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.chat_threads t
    WHERE t.id = thread_id AND (auth.uid() = t.user_a_id OR auth.uid() = t.user_b_id)
  ));
CREATE POLICY "chat_message_insert" ON public.chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.chat_threads t
      WHERE t.id = thread_id AND (auth.uid() = t.user_a_id OR auth.uid() = t.user_b_id)
    )
  );

CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_founder_profiles_updated_at BEFORE UPDATE ON public.founder_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_founder_match_requests_updated_at BEFORE UPDATE ON public.founder_match_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
