-- =====================================================
-- STORAGE BUCKET POLICIES
-- Run this SQL in Supabase SQL Editor AFTER creating the bucket
-- =====================================================

-- First, create the bucket manually in Supabase Dashboard:
-- 1. Go to Storage
-- 2. Click "New Bucket"
-- 3. Name: portfolio-images
-- 4. Check "Public bucket"
-- 5. Click "Create bucket"

-- Then run these policies:

-- Allow public to read any file in the bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-images');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-images');

-- Allow authenticated users to update their files
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-images');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-images');

-- Alternative: Allow anyone to upload (if you want public uploads)
-- Uncomment these if the above doesn't work:
/*
CREATE POLICY "Anyone can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-images');

CREATE POLICY "Anyone can update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-images');

CREATE POLICY "Anyone can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-images');
*/
