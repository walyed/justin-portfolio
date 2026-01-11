-- =====================================================
-- CARD STYLING MIGRATION
-- Run this SQL AFTER the main schema to add card customization
-- =====================================================

-- Add card styling columns to leadership table
ALTER TABLE leadership ADD COLUMN IF NOT EXISTS card_style JSONB DEFAULT '{
  "borderRadius": "xl",
  "padding": "6",
  "shadow": "lg",
  "textAlign": "left",
  "titleSize": "lg",
  "descSize": "sm"
}'::jsonb;

-- Add card styling columns to awards table  
ALTER TABLE awards ADD COLUMN IF NOT EXISTS card_style JSONB DEFAULT '{
  "borderRadius": "xl",
  "padding": "6",
  "shadow": "lg",
  "textAlign": "left",
  "titleSize": "xl",
  "descSize": "sm"
}'::jsonb;

-- Add card styling columns to press table
ALTER TABLE press ADD COLUMN IF NOT EXISTS card_style JSONB DEFAULT '{
  "borderRadius": "2xl",
  "padding": "8",
  "shadow": "lg",
  "textAlign": "left",
  "titleSize": "xl",
  "descSize": "base"
}'::jsonb;

-- Add card styling columns to publications table
ALTER TABLE publications ADD COLUMN IF NOT EXISTS card_style JSONB DEFAULT '{
  "borderRadius": "xl",
  "padding": "6",
  "shadow": "lg",
  "textAlign": "left",
  "titleSize": "xl",
  "descSize": "sm"
}'::jsonb;

-- Add card styling columns to endorsements table
ALTER TABLE endorsements ADD COLUMN IF NOT EXISTS card_style JSONB DEFAULT '{
  "borderRadius": "2xl",
  "padding": "8",
  "shadow": "lg",
  "textAlign": "left",
  "quoteSize": "base"
}'::jsonb;

-- Add card styling columns to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS card_style JSONB DEFAULT '{
  "borderRadius": "2xl",
  "padding": "8",
  "shadow": "xl",
  "textAlign": "left",
  "titleSize": "2xl",
  "descSize": "base"
}'::jsonb;
