-- =====================================================
-- ADD FONT AND CARD SETTINGS TO SECTION LAYOUTS TABLE
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- Add font setting columns to section_layouts table
ALTER TABLE section_layouts 
ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'Inter, system-ui, sans-serif',
ADD COLUMN IF NOT EXISTS font_size TEXT DEFAULT '16px',
ADD COLUMN IF NOT EXISTS font_color TEXT DEFAULT '#1e293b',
ADD COLUMN IF NOT EXISTS card_color TEXT DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS card_hover_color TEXT DEFAULT '#f8fafc';

-- Update existing rows with default values
UPDATE section_layouts 
SET 
  font_family = COALESCE(font_family, 'Inter, system-ui, sans-serif'),
  font_size = COALESCE(font_size, '16px'),
  font_color = COALESCE(font_color, '#1e293b'),
  card_color = COALESCE(card_color, '#ffffff'),
  card_hover_color = COALESCE(card_hover_color, '#f8fafc')
WHERE font_family IS NULL OR font_size IS NULL OR font_color IS NULL OR card_color IS NULL OR card_hover_color IS NULL;

-- Insert default layout settings for sections that might not exist yet
INSERT INTO section_layouts (section_name, layout, card_direction, gap, show_image, image_position, image_size, font_family, font_size, font_color, card_color, card_hover_color)
VALUES 
  ('about', 'grid-2', 'vertical', '6', false, 'top', 'md', 'Inter, system-ui, sans-serif', '16px', '#1e293b', '#ffffff', '#f8fafc'),
  ('leadership', 'grid-2', 'vertical', '6', false, 'top', 'md', 'Inter, system-ui, sans-serif', '16px', '#1e293b', '#ffffff', '#f8fafc'),
  ('projects', 'grid-2', 'vertical', '6', true, 'top', 'md', 'Inter, system-ui, sans-serif', '16px', '#1e293b', '#ffffff', '#f8fafc'),
  ('awards', 'grid-2', 'vertical', '6', false, 'top', 'md', 'Inter, system-ui, sans-serif', '16px', '#1e293b', '#ffffff', '#f8fafc'),
  ('community', 'grid-2', 'vertical', '6', false, 'top', 'md', 'Inter, system-ui, sans-serif', '16px', '#1e293b', '#ffffff', '#f8fafc'),
  ('press', 'grid-2', 'vertical', '6', false, 'top', 'md', 'Inter, system-ui, sans-serif', '16px', '#1e293b', '#ffffff', '#f8fafc'),
  ('publications', 'list', 'vertical', '4', false, 'top', 'md', 'Inter, system-ui, sans-serif', '16px', '#1e293b', '#ffffff', '#f8fafc'),
  ('endorsements', 'grid-2', 'vertical', '6', false, 'top', 'md', 'Inter, system-ui, sans-serif', '16px', '#1e293b', '#ffffff', '#f8fafc'),
  ('newsletter', 'grid-2', 'vertical', '6', false, 'top', 'md', 'Inter, system-ui, sans-serif', '16px', '#1e293b', '#ffffff', '#f8fafc'),
  ('hero', 'grid-2', 'vertical', '6', false, 'top', 'md', 'Inter, system-ui, sans-serif', '16px', '#ffffff', '#000000', '#1a1a2e'),
  ('footer', 'grid-2', 'vertical', '6', false, 'top', 'md', 'Inter, system-ui, sans-serif', '16px', '#1e293b', '#ffffff', '#f8fafc')
ON CONFLICT (section_name) DO UPDATE SET
  font_family = COALESCE(section_layouts.font_family, EXCLUDED.font_family),
  font_size = COALESCE(section_layouts.font_size, EXCLUDED.font_size),
  font_color = COALESCE(section_layouts.font_color, EXCLUDED.font_color),
  card_color = COALESCE(section_layouts.card_color, EXCLUDED.card_color),
  card_hover_color = COALESCE(section_layouts.card_hover_color, EXCLUDED.card_hover_color);

-- Verify the changes
SELECT section_name, layout, font_family, font_size, font_color, card_color, card_hover_color FROM section_layouts ORDER BY section_name;
