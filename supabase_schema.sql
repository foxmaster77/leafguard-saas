-- 1. Create Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create Monitors Table (Linked to Profile)
CREATE TABLE IF NOT EXISTS public.monitors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Monitor Logs Table
CREATE TABLE IF NOT EXISTS public.monitor_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    monitor_id UUID REFERENCES public.monitors(id) ON DELETE CASCADE,
    status TEXT NOT NULL, -- 'UP' or 'DOWN'
    response_time INTEGER NOT NULL, -- in milliseconds
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitor_logs ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own monitors." ON public.monitors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own monitors." ON public.monitors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own monitors." ON public.monitors FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view logs of their own monitors." ON public.monitor_logs FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.monitors WHERE id = monitor_id AND user_id = auth.uid()));

-- 6. Create Detections Table for Outbreak Heatmap & Public Health Tracking
CREATE TABLE IF NOT EXISTS public.detections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    disease_name TEXT NOT NULL,
    crop_type TEXT NOT NULL,
    confidence INTEGER NOT NULL DEFAULT 85,
    severity TEXT NOT NULL DEFAULT 'Medium',
    pincode TEXT DEFAULT '712101',
    latitude DOUBLE PRECISION DEFAULT 22.9868,
    longitude DOUBLE PRECISION DEFAULT 87.8550,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.detections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public detections viewable by everyone" ON public.detections FOR SELECT USING (true);
CREATE POLICY "Public detections insertable by everyone" ON public.detections FOR INSERT WITH CHECK (true);

