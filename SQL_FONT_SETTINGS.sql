-- SQL Queries to Add Font Settings Columns to section_layouts Table
-- Run these queries in your Supabase SQL Editor

-- Add font_family column (default: 'Inter, system-ui, sans-serif')
ALTER TABLE section_layouts 
ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'Inter, system-ui, sans-serif';

-- Add font_size column (default: '16px')
ALTER TABLE section_layouts 
ADD COLUMN IF NOT EXISTS font_size TEXT DEFAULT '16px';

-- Add font_color column (default: '#1e293b')
ALTER TABLE section_layouts 
ADD COLUMN IF NOT EXISTS font_color TEXT DEFAULT '#1e293b';

-- Update existing rows with default values (optional - only needed if table already has data)
UPDATE section_layouts 
SET 
  font_family = COALESCE(font_family, 'Inter, system-ui, sans-serif'),
  font_size = COALESCE(font_size, '16px'),
  font_color = COALESCE(font_color, '#1e293b')
WHERE font_family IS NULL OR font_size IS NULL OR font_color IS NULL;

-- Verify the columns were added (run to check)
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'section_layouts' 
AND column_name IN ('font_family', 'font_size', 'font_color');
