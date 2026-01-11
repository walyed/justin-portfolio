-- Add link column to leadership table
ALTER TABLE leadership
ADD COLUMN IF NOT EXISTS link TEXT;

-- Add link column to awards table
ALTER TABLE awards
ADD COLUMN IF NOT EXISTS link TEXT;

-- Add link column to endorsements table
ALTER TABLE endorsements
ADD COLUMN IF NOT EXISTS link TEXT;

-- Add link column to projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS link TEXT;

-- Add link column to special_awards table
ALTER TABLE special_awards
ADD COLUMN IF NOT EXISTS link TEXT;

-- Note: press, publications, newsletter_issues, and community tables should already have link columns
