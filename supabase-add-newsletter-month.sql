-- Add month column to newsletter_issues table
ALTER TABLE newsletter_issues ADD COLUMN IF NOT EXISTS month VARCHAR(50);

-- Update existing records with a default month if needed
UPDATE newsletter_issues SET month = 'December 2025' WHERE month IS NULL OR month = '';
