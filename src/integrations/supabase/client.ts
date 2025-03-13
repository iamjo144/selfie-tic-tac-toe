
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nsnpcefkeclmkiegnaeg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zbnBjZWZrZWNsbWtpZWduYWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NDQwMjgsImV4cCI6MjA1NzQyMDAyOH0.sLDtWx6Gb3AlamVi62Nm018Nau9oYglR8V3dfIa27QU";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
