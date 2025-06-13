import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cphemucuqeqcfgujhatt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwaGVtdWN1cWVxY2ZndWpoYXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MDM0MTksImV4cCI6MjA2NTA3OTQxOX0.sm3Fh1wTBSf8arcov7FKLyYP-VqPIa_7mpZ7wVGNLZY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);