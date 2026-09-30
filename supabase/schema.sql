-- 1. PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    price NUMERIC NOT NULL,
    period TEXT DEFAULT 'month',
    beds INTEGER NOT NULL,
    baths NUMERIC NOT NULL,
    dimensions TEXT NOT NULL,
    image_url TEXT NOT NULL,
    is_popular BOOLEAN DEFAULT false,
    category TEXT DEFAULT 'rent',
    property_type TEXT DEFAULT 'House',
    description TEXT,
    hospital_distance TEXT,
    virtual_tour_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    user_id TEXT DEFAULT 'anonymous_user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(property_id, user_id)
);

-- 3. LEADS TABLE
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    type TEXT DEFAULT 'landlord',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    medical_role TEXT,
    tour_date TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 6. IDEMPOTENT POLICIES (DROP & RECREATE SAFELY)
DROP POLICY IF EXISTS "Public can read properties" ON public.properties;
CREATE POLICY "Public can read properties" ON public.properties FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert properties" ON public.properties;
CREATE POLICY "Public can insert properties" ON public.properties FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update properties" ON public.properties;
CREATE POLICY "Public can update properties" ON public.properties FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can manage favorites" ON public.favorites;
CREATE POLICY "Public can manage favorites" ON public.favorites FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can read leads" ON public.leads;
CREATE POLICY "Public can read leads" ON public.leads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert leads" ON public.leads;
CREATE POLICY "Public can insert leads" ON public.leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read inquiries" ON public.inquiries;
CREATE POLICY "Public can read inquiries" ON public.inquiries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert inquiries" ON public.inquiries;
CREATE POLICY "Public can insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

-- 7. SEED DATA (THE 6 UI.PDF PROPERTIES)
INSERT INTO public.properties (id, title, address, city, state, price, period, beds, baths, dimensions, image_url, is_popular, category, property_type, description, hospital_distance)
VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    'Palm Harbor',
    '2699 Green Valley, Highland Lake, FL',
    'Highland Lake',
    'FL',
    2095,
    'month',
    3,
    2,
    '5x7 m²',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
    true,
    'rent',
    'Single Family Home',
    'Charming modern villa situated 5 minutes from Highland Lake Regional Medical Center. Features blackout shades for night shift physicians, dedicated home office, and landscaped patio.',
    '1.8 miles to Highland Regional Medical Center'
),
(
    'a2222222-2222-2222-2222-222222222222',
    'Beverly Springfield',
    '2821 Lake Sevilla, Palm Harbor, TX',
    'Palm Harbor',
    'TX',
    2700,
    'month',
    4,
    2,
    '6x7.5 m²',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    true,
    'rent',
    'Luxury Estate',
    'Spacious 4-bedroom executive home with lakeside views. Features master suite retreat, chef kitchen, and high-speed fiber internet ideal for telemedicine consultations.',
    '2.4 miles to Palm Harbor Medical Center'
),
(
    'a3333333-3333-3333-3333-333333333333',
    'Faulkner Ave',
    '909 Woodland St, Michigan, IN',
    'Michigan',
    'IN',
    4550,
    'month',
    4,
    3,
    '8x10 m²',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
    true,
    'rent',
    'Modern Villa',
    'Ultra-premium residence with heated indoor garage, private study, and smart security. Perfect for attending physicians and medical directors wanting peace and sophistication.',
    '3.1 miles to University Teaching Hospital'
),
(
    'a4444444-4444-4444-4444-444444444444',
    'St. Crystal',
    '210 US Highway, Highland Lake, FL',
    'Highland Lake',
    'FL',
    2400,
    'month',
    4,
    2,
    '6x8 m²',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
    false,
    'rent',
    'Contemporary House',
    'Sunlit contemporary 4-bedroom home with open plan kitchen, EV charger, quiet soundproofed bedrooms, and private pool.',
    '1.2 miles to St. Crystal Memorial Clinic'
),
(
    'a5555555-5555-5555-5555-555555555555',
    'Cove Red',
    '243 Curlew Road, Palm Harbor, TX',
    'Palm Harbor',
    'TX',
    1500,
    'month',
    2,
    1,
    '5x7.5 m²',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80',
    false,
    'rent',
    'Townhouse',
    'Cozy, low-maintenance townhouse tailored for medical fellows and residents. Low utility overhead and minutes from clinical rotators shuttle.',
    '0.9 miles to Memorial East Clinic'
),
(
    'a6666666-6666-6666-6666-666666666666',
    'Tarpon Bay',
    '103 Lake Shores, Michigan, IN',
    'Michigan',
    'IN',
    1600,
    'month',
    3,
    1,
    '5x7 m²',
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80',
    false,
    'rent',
    'Cottage',
    'Picturesque waterfront cottage with serene nature surroundings. Ideal for recharging after long hospital shifts with scenic deck and private boat slip.',
    '4.0 miles to Lake Shores County Hospital'
)
ON CONFLICT (id) DO NOTHING;
