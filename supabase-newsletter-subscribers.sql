-- Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    source VARCHAR(100) DEFAULT 'website',
    name VARCHAR(255),
    notes TEXT
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed_at ON newsletter_subscribers(subscribed_at DESC);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to subscribe (insert)
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

-- Policy: Only authenticated users can view subscribers
CREATE POLICY "Authenticated users can view subscribers" ON newsletter_subscribers
    FOR SELECT 
    TO authenticated
    USING (true);

-- Policy: Only authenticated users can update subscribers
CREATE POLICY "Authenticated users can update subscribers" ON newsletter_subscribers
    FOR UPDATE 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Only authenticated users can delete subscribers
CREATE POLICY "Authenticated users can delete subscribers" ON newsletter_subscribers
    FOR DELETE 
    TO authenticated
    USING (true);

-- Grant permissions
GRANT INSERT ON newsletter_subscribers TO anon;
GRANT ALL ON newsletter_subscribers TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE newsletter_subscribers_id_seq TO anon, authenticated;
