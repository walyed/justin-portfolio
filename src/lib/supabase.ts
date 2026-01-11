import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://lrwpfndkkdfesmjdtupg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyd3BmbmRra2RmZXNtamR0dXBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwODcyOTQsImV4cCI6MjA4MzY2MzI5NH0.NmdskLsD1kOeYcV-WA11k6DDBxre-5snZuqWba7MAeU';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function for image uploads
export const uploadImage = async (file: File, bucket: string, path: string): Promise<string | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${path}/${Date.now()}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);
  
  if (error) {
    console.error('Upload error:', error);
    return null;
  }
  
  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
};

// Delete image from storage
export const deleteImage = async (bucket: string, url: string): Promise<boolean> => {
  try {
    const path = url.split(`${bucket}/`)[1];
    if (!path) return false;
    
    const { error } = await supabase.storage.from(bucket).remove([path]);
    return !error;
  } catch {
    return false;
  }
};
