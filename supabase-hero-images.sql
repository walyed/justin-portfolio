-- Create hero slideshow images table
CREATE TABLE IF NOT EXISTS hero_images (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255) DEFAULT '',
    brightness INTEGER DEFAULT 100 CHECK (brightness >= 0 AND brightness <= 200),
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_hero_images_order ON hero_images(order_index);

-- Enable Row Level Security
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read
CREATE POLICY "Anyone can view hero images" ON hero_images
    FOR SELECT 
    USING (true);

-- Policy: Only authenticated users can insert
CREATE POLICY "Authenticated users can insert hero images" ON hero_images
    FOR INSERT 
    TO authenticated
    WITH CHECK (true);

-- Policy: Only authenticated users can update
CREATE POLICY "Authenticated users can update hero images" ON hero_images
    FOR UPDATE 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Only authenticated users can delete
CREATE POLICY "Authenticated users can delete hero images" ON hero_images
    FOR DELETE 
    TO authenticated
    USING (true);

-- Grant permissions
GRANT SELECT ON hero_images TO anon;
GRANT ALL ON hero_images TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE hero_images_id_seq TO anon, authenticated;

-- Insert sample images for display
INSERT INTO hero_images (image_url, alt_text, brightness, order_index, is_active)
VALUES 
    ('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80', 'Technology Network', 80, 0, true),
    ('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80', 'Circuit Board', 75, 1, true),
    ('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80', 'Digital Code', 70, 2, true),
    ('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80', 'AI Neural Network', 85, 3, true)
ON CONFLICT DO NOTHING;
