// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tingamnqrtpatnzjnoig.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpbmdhbW5xcnRwYXRuempub2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NTIyOTAsImV4cCI6MjA2MTMyODI5MH0.H4HQodmEQWX5fdz8yuoJQZdaUFPorA_pTNjw7wFCI-o";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);