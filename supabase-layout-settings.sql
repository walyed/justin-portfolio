-- Create section layout settings table
CREATE TABLE IF NOT EXISTS section_layouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT UNIQUE NOT NULL,
  layout TEXT NOT NULL DEFAULT 'grid-2',
  card_direction TEXT NOT NULL DEFAULT 'vertical',
  gap TEXT NOT NULL DEFAULT '6',
  show_image BOOLEAN NOT NULL DEFAULT true,
  image_position TEXT NOT NULL DEFAULT 'top',
  image_size TEXT NOT NULL DEFAULT 'md',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE section_layouts ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read on section_layouts"
ON section_layouts FOR SELECT
USING (true);

-- Allow authenticated update
CREATE POLICY "Allow authenticated update on section_layouts"
ON section_layouts FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated insert
CREATE POLICY "Allow authenticated insert on section_layouts"
ON section_layouts FOR INSERT
TO authenticated
WITH CHECK (true);

-- Insert default layout settings for each section
INSERT INTO section_layouts (section_name, layout, card_direction, gap, show_image, image_position, image_size)
VALUES 
  ('leadership', 'grid-2', 'vertical', '6', false, 'top', 'md'),
  ('projects', 'grid-2', 'vertical', '6', true, 'top', 'md'),
  ('awards', 'grid-2', 'vertical', '6', false, 'top', 'md'),
  ('press', 'grid-2', 'vertical', '6', false, 'top', 'md'),
  ('publications', 'list', 'vertical', '4', false, 'top', 'md'),
  ('endorsements', 'grid-2', 'vertical', '6', false, 'top', 'md')
ON CONFLICT (section_name) DO NOTHING;
