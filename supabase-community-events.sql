-- =====================================================
-- COMMUNITY EVENTS TABLE
-- =====================================================

-- Create community_events table
CREATE TABLE IF NOT EXISTS community_events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    link TEXT NOT NULL DEFAULT '#',
    month VARCHAR(50),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_community_events_order ON community_events(order_index);

-- Enable Row Level Security
ALTER TABLE community_events ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read
CREATE POLICY "Anyone can view community events" ON community_events
    FOR SELECT 
    USING (true);

-- Policy: Only authenticated users can insert
CREATE POLICY "Authenticated users can insert community events" ON community_events
    FOR INSERT 
    TO authenticated
    WITH CHECK (true);

-- Policy: Only authenticated users can update
CREATE POLICY "Authenticated users can update community events" ON community_events
    FOR UPDATE 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Only authenticated users can delete
CREATE POLICY "Authenticated users can delete community events" ON community_events
    FOR DELETE 
    TO authenticated
    USING (true);

-- Grant permissions
GRANT SELECT ON community_events TO anon;
GRANT ALL ON community_events TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE community_events_id_seq TO anon, authenticated;

-- Insert sample data
INSERT INTO community_events (title, description, link, month, order_index)
VALUES 
    ('AI Literacy Workshop for Seniors', 'I print booklets, arrange events, booking calls for the seminar. Need your support', '#', 'January 2026', 0),
    ('Digital Wellness Seminar', 'Empowering seniors with technology knowledge and safety', '#', 'November 2025', 1),
    ('Community Tech Support Day', 'Free tech help for seniors in the community', '#', 'October 2025', 2)
ON CONFLICT DO NOTHING;
