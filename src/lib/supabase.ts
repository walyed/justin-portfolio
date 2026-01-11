import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Load from environment variables (set in .env file)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env file');
}

export const supabase = createClient<Database>(supabaseUrl || '', supabaseAnonKey || '');

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
