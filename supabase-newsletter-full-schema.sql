-- =====================================================
-- NEWSLETTER ISSUES TABLE - Complete Schema with Month
-- =====================================================

-- Create newsletter_issues table if it doesn't exist
CREATE TABLE IF NOT EXISTS newsletter_issues (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    link TEXT NOT NULL DEFAULT '#',
    month VARCHAR(50),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add month column if it doesn't exist (for existing tables)
ALTER TABLE newsletter_issues ADD COLUMN IF NOT EXISTS month VARCHAR(50);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_newsletter_issues_order ON newsletter_issues(order_index);

-- Enable Row Level Security
ALTER TABLE newsletter_issues ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read
CREATE POLICY "Anyone can view newsletter issues" ON newsletter_issues
    FOR SELECT 
    USING (true);

-- Policy: Only authenticated users can insert
CREATE POLICY "Authenticated users can insert newsletter issues" ON newsletter_issues
    FOR INSERT 
    TO authenticated
    WITH CHECK (true);

-- Policy: Only authenticated users can update
CREATE POLICY "Authenticated users can update newsletter issues" ON newsletter_issues
    FOR UPDATE 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Only authenticated users can delete
CREATE POLICY "Authenticated users can delete newsletter issues" ON newsletter_issues
    FOR DELETE 
    TO authenticated
    USING (true);

-- Grant permissions
GRANT SELECT ON newsletter_issues TO anon;
GRANT ALL ON newsletter_issues TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE newsletter_issues_id_seq TO anon, authenticated;

-- =====================================================
-- UPDATE EXISTING RECORDS (if any)
-- =====================================================
-- Update existing records with default month format
UPDATE newsletter_issues 
SET month = TO_CHAR(created_at, 'Month YYYY')
WHERE month IS NULL OR month = '';

-- =====================================================
-- SAMPLE DATA (Optional - comment out if you already have data)
-- =====================================================
-- INSERT INTO newsletter_issues (title, link, month, order_index)
-- VALUES 
--     ('The Ethics of BCI Data', '#', 'December 2025', 0),
--     ('Generative AI in School', '#', 'November 2025', 1)
-- ON CONFLICT DO NOTHING;
