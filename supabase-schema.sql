-- =====================================================
-- SUPABASE SCHEMA FOR JOEL AMALDAS PORTFOLIO CMS
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- Enable RLS (Row Level Security)
-- We'll set policies to allow public read, admin write

-- 1. HERO CONTENT TABLE
CREATE TABLE IF NOT EXISTS hero_content (
  id SERIAL PRIMARY KEY,
  badge_text TEXT NOT NULL DEFAULT 'TOP 20 UNDER 20: 2026 SELECTION',
  subtitle TEXT NOT NULL DEFAULT 'Awarded by Avenue Magazine, YMCA and Calgary Foundation',
  name TEXT NOT NULL DEFAULT 'JOEL AMALDAS',
  tagline TEXT NOT NULL DEFAULT 'Engineering a Future for',
  tagline_highlight TEXT NOT NULL DEFAULT 'Assistive Humanity',
  stat_1_value TEXT NOT NULL DEFAULT '$22.5k',
  stat_1_label TEXT NOT NULL DEFAULT 'Non-Dilutive Funding',
  stat_2_value TEXT NOT NULL DEFAULT '4x',
  stat_2_label TEXT NOT NULL DEFAULT 'Gold Medalist (CYSF)',
  stat_3_value TEXT NOT NULL DEFAULT '2x',
  stat_3_label TEXT NOT NULL DEFAULT 'National Medalist',
  stat_4_value TEXT NOT NULL DEFAULT '200+',
  stat_4_label TEXT NOT NULL DEFAULT 'Students Mentored',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ABOUT CONTENT TABLE
CREATE TABLE IF NOT EXISTS about_content (
  id SERIAL PRIMARY KEY,
  paragraph_1 TEXT NOT NULL DEFAULT 'My name is Joel Amaldas. My journey is defined by a curiosity to explore new technologies and a drive to develop low-cost solutions that enhance accessibility for everyone. I have earned multiple science fair awards for innovative projects, including an AI-powered device for the visually impaired and a brain-controlled wheelchair.',
  paragraph_2 TEXT NOT NULL DEFAULT 'Beyond the lab, I volunteer at the Calgary Public Library teaching coding to children and serve as a Youth Leadership Program Leader at Toastmasters International. My goal is to combine technical mastery with social impact to build a more inclusive future.',
  image_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800',
  tags TEXT[] DEFAULT ARRAY['Robotics', 'Neuroscience', 'AI & ML', 'Karate (Green Belt)', 'Piano (RCM)'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  awards TEXT[] DEFAULT ARRAY[]::TEXT[],
  funding TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  color TEXT NOT NULL DEFAULT 'blue',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LEADERSHIP TABLE
CREATE TABLE IF NOT EXISTS leadership (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  role TEXT NOT NULL,
  organization TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Crown',
  color TEXT NOT NULL DEFAULT 'violet',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AWARDS TABLE
CREATE TABLE IF NOT EXISTS awards (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SPECIAL AWARDS TABLE
CREATE TABLE IF NOT EXISTS special_awards (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COMMUNITY TABLE
CREATE TABLE IF NOT EXISTS community (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Silver AI Initiative',
  description TEXT NOT NULL DEFAULT 'Bridging the generational gap. We conduct seminars, provide books, and training to educate seniors in the AI era.',
  cta_text TEXT NOT NULL DEFAULT 'Donate via GoFundMe',
  cta_link TEXT NOT NULL DEFAULT '#',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PRESS TABLE
CREATE TABLE IF NOT EXISTS press (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  source TEXT NOT NULL,
  link TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_video BOOLEAN DEFAULT FALSE,
  color TEXT NOT NULL DEFAULT 'red',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PUBLICATIONS TABLE
CREATE TABLE IF NOT EXISTS publications (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'MEDIUM',
  link TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ENDORSEMENTS TABLE
CREATE TABLE IF NOT EXISTS endorsements (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  initial TEXT NOT NULL,
  quote TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'pink',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. NEWSLETTER ISSUES TABLE
CREATE TABLE IF NOT EXISTS newsletter_issues (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  link TEXT NOT NULL DEFAULT '#',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ADMIN USERS TABLE (for authentication)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE community ENABLE ROW LEVEL SECURITY;
ALTER TABLE press ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_issues ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES (anyone can read)
CREATE POLICY "Public read hero_content" ON hero_content FOR SELECT USING (true);
CREATE POLICY "Public read about_content" ON about_content FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read leadership" ON leadership FOR SELECT USING (true);
CREATE POLICY "Public read awards" ON awards FOR SELECT USING (true);
CREATE POLICY "Public read special_awards" ON special_awards FOR SELECT USING (true);
CREATE POLICY "Public read community" ON community FOR SELECT USING (true);
CREATE POLICY "Public read press" ON press FOR SELECT USING (true);
CREATE POLICY "Public read publications" ON publications FOR SELECT USING (true);
CREATE POLICY "Public read endorsements" ON endorsements FOR SELECT USING (true);
CREATE POLICY "Public read newsletter_issues" ON newsletter_issues FOR SELECT USING (true);

-- AUTHENTICATED USER WRITE POLICIES (logged in users can write)
CREATE POLICY "Auth write hero_content" ON hero_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write about_content" ON about_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write leadership" ON leadership FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write awards" ON awards FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write special_awards" ON special_awards FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write community" ON community FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write press" ON press FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write publications" ON publications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write endorsements" ON endorsements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write newsletter_issues" ON newsletter_issues FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Insert default hero content
INSERT INTO hero_content (id, badge_text, subtitle, name, tagline, tagline_highlight, stat_1_value, stat_1_label, stat_2_value, stat_2_label, stat_3_value, stat_3_label, stat_4_value, stat_4_label)
VALUES (1, 'TOP 20 UNDER 20: 2026 SELECTION', 'Awarded by Avenue Magazine, YMCA and Calgary Foundation', 'JOEL AMALDAS', 'Engineering a Future for', 'Assistive Humanity', '$22.5k', 'Non-Dilutive Funding', '4x', 'Gold Medalist (CYSF)', '2x', 'National Medalist', '200+', 'Students Mentored')
ON CONFLICT (id) DO NOTHING;

-- Insert default about content
INSERT INTO about_content (id, paragraph_1, paragraph_2, image_url, tags)
VALUES (1, 'My name is Joel Amaldas. My journey is defined by a curiosity to explore new technologies and a drive to develop low-cost solutions that enhance accessibility for everyone. I have earned multiple science fair awards for innovative projects, including an AI-powered device for the visually impaired and a brain-controlled wheelchair.', 'Beyond the lab, I volunteer at the Calgary Public Library teaching coding to children and serve as a Youth Leadership Program Leader at Toastmasters International. My goal is to combine technical mastery with social impact to build a more inclusive future.', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800', ARRAY['Robotics', 'Neuroscience', 'AI & ML', 'Karate (Green Belt)', 'Piano (RCM)'])
ON CONFLICT (id) DO NOTHING;

-- Insert default community content
INSERT INTO community (id, title, description, cta_text, cta_link)
VALUES (1, 'Silver AI Initiative', 'Bridging the generational gap. We conduct seminars, provide books, and training to educate seniors in the AI era.', 'Donate via GoFundMe', '#')
ON CONFLICT (id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (title, subtitle, description, image_url, tags, awards, funding, status, color, order_index) VALUES
('HEROChair', 'Brain-Controlled Wheelchair', 'A BCI wheelchair using EEG signals to detect facial expressions, converting them into movement commands. Includes integrated IoT safety features for real-world navigation.', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800', ARRAY['EEG', 'BCI', 'IoT', 'Accessibility'], ARRAY['CWSF 2025 Bronze', 'CYSF Gold', 'Samsung SFT 2nd Place'], '$15,000', 'Active', 'blue', 0),
('SonicVision', 'AI Glasses for the Blind', 'Smart glasses using computer vision to describe surroundings in real-time, helping visually impaired users navigate independently.', 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800', ARRAY['Computer Vision', 'TTS', 'Wearable', 'AI'], ARRAY['CWSF 2024 Bronze', 'CYSF Gold'], NULL, 'Active', 'emerald', 1);

-- Insert sample leadership
INSERT INTO leadership (title, date, role, organization, icon, color, order_index) VALUES
('Calgary Youth Mayor Council', '2025-2026', 'Council Member', 'CITY OF CALGARY', 'Crown', 'violet', 0),
('Young Canadians Parliament', '2025-2026', 'Parliament Member', 'FEDERAL INITIATIVE', 'Globe', 'blue', 1),
('Royal Canadian Air Cadets', 'Active', 'Air Cadet', 'LEADERSHIP & FLIGHT', 'Award', 'emerald', 2),
('CAYAC', 'Advisor', 'Board Advisor', 'HEALTHCARE ADVOCACY', 'Heart', 'pink', 3);

-- Insert sample awards
INSERT INTO awards (title, description, is_featured, order_index) VALUES
('Samsung Solve for Tomorrow', 'National 2nd Place ($10k) + Fan Favourite ($5k)', true, 0),
('CWSF National', '2x Bronze Medalist (2024, 2025)', false, 1),
('CYSF Regional', '4x Gold Medalist (2021, 2023, 2024, 2025)', false, 2);

-- Insert special awards
INSERT INTO special_awards (name, order_index) VALUES
('Pfizer Oncology Award', 0),
('Spartan Controls Innovation', 1),
('Schulich Engineering', 2),
('Buckley Family Award', 3);

-- Insert sample press
INSERT INTO press (title, description, source, link, is_featured, is_video, color, order_index) VALUES
('Top 20 Under 20: Class of 2026', 'Awarded by Avenue Magazine & Calgary YMCA. Recognized for leadership and innovation. Recipient of Governor''s Award.', 'Headline Honour', '#', true, false, 'red', 0),
('Calgary Team Regional Finalist', 'Featured coverage of the HEROChair project.', 'CTV NEWS', '#', false, false, 'red', 1),
('Winners Announcement', '2nd Place National & Fan Favourite Award.', 'SAMSUNG', '#', false, false, 'blue', 2),
('National Finals Presentation', 'Watch the live pitch presentation.', 'Watch Live Pitch', '#', false, true, 'red', 3);

-- Insert sample publications
INSERT INTO publications (title, description, platform, link, order_index) VALUES
('Scintix: AI-Driven Radiotherapy at Stanford', 'Technical analysis of RefleXion''s biology-guided radiotherapy.', 'MEDIUM', 'https://medium.com/@joel.amaldas/scintix-how-ai-driven-radiotherapy-from-reflexion-is-revolutionizing-cancer-treatment-at-stanford-2575b5e43755', 0);

-- Insert sample endorsements
INSERT INTO endorsements (name, role, initial, quote, color, order_index) VALUES
('Dr. David Barzilai', 'Longevity Medicine', 'DB', 'Praise for dedication to Precision Health & Longevity.', 'pink', 0),
('Interaxon Inc.', 'Muse Neurotech', 'M', 'Official recognition of the ''brilliant students'' using Muse technology.', 'violet', 1),
('Lisa Davis', 'Samsung Canada', 'LD', 'Announcement of National Winners and recognition of student innovation.', 'blue', 2),
('Darrol Baker', 'Tech Industry Leader', 'DB', 'Recommendation regarding AI passion and future potential.', 'emerald', 3);

-- Insert sample newsletter issues
INSERT INTO newsletter_issues (title, link, order_index) VALUES
('The Ethics of BCI Data', '#', 0),
('Generative AI in School', '#', 1);

-- =====================================================
-- STORAGE BUCKET FOR IMAGES
-- Run this in Supabase Dashboard > Storage
-- =====================================================
-- Create a bucket called 'portfolio-images' with public access

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hero_content_updated_at BEFORE UPDATE ON hero_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_content_updated_at BEFORE UPDATE ON about_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leadership_updated_at BEFORE UPDATE ON leadership FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_awards_updated_at BEFORE UPDATE ON awards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_updated_at BEFORE UPDATE ON community FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_press_updated_at BEFORE UPDATE ON press FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_publications_updated_at BEFORE UPDATE ON publications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_endorsements_updated_at BEFORE UPDATE ON endorsements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
