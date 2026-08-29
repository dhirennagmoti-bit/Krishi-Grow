import { createClient } from '@supabase/supabase-js';
 
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://acrzxvxctyhrwhpmozwg.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjcnp4dnhjdHlocndocG1vendnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MDQ0MzEsImV4cCI6MjEwMjk4MDQzMX0.wwZNsC_tZZXWu99yzB9ARvAepJGy1nyNW7yroUG4lwk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

