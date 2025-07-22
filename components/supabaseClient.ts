import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gaoqhodspfguajauvltl.supabase.co'; // Replace with your Project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdhb3Fob2RzcGZndWFqYXV2bHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwODUyNTYsImV4cCI6MjA2ODY2MTI1Nn0.MaaFMbZmSjYgD2Yp-yQiwuTf6L1h6sJgPN6ZAHzHVMU'; // Replace with your anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);