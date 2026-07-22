import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nolnaehzirlimzodfqgg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vbG5hZWh6aXJsaW16b2RmcWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MDMzNTksImV4cCI6MjEwMDI3OTM1OX0.6qH4LMknaJ2xYzdk6LvBCkpqktn6CY7mPYWnL1DwpOc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
