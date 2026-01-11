-- =====================================================
-- FOOTER TABLE
-- =====================================================

-- Create footer table
CREATE TABLE IF NOT EXISTS footer (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'JOEL AMALDAS',
    roles TEXT[], -- Array of roles/positions
    location TEXT DEFAULT 'Calgary, Alberta, Canada',
    education_title TEXT DEFAULT 'EDUCATION',
    education_items TEXT[], -- Array of education items
    status_text TEXT DEFAULT 'Available for Research',
    status_available BOOLEAN DEFAULT true,
    contact_email TEXT DEFAULT 'contact@joela.tech',
    linkedin_url TEXT DEFAULT '#',
    github_url TEXT DEFAULT '#',
    email_url TEXT DEFAULT '#',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE footer ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read
CREATE POLICY "Anyone can view footer" ON footer
    FOR SELECT 
    USING (true);

-- Policy: Only authenticated users can update
CREATE POLICY "Authenticated users can update footer" ON footer
    FOR UPDATE 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Grant permissions
GRANT SELECT ON footer TO anon;
GRANT ALL ON footer TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE footer_id_seq TO anon, authenticated;

-- Insert default data
INSERT INTO footer (id, name, roles, location, education_title, education_items, status_text, status_available, contact_email, linkedin_url, github_url, email_url)
VALUES (
    1,
    'JOEL AMALDAS',
    ARRAY['Flight Sergeant, 918 Griffon Squadron', 'Founder, OncoSense'],
    'Calgary, Alberta, Canada',
    'EDUCATION',
    ARRAY['STEM Innovation Academy (Gr 10)', 'Honour Roll', 'AP Computer Science & Math'],
    'Available for Research',
    true,
    'contact@joela.tech',
    '#',
    '#',
    '#'
)
ON CONFLICT (id) DO NOTHING;
