"server only"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL as string;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY as string;
const supabase = createClient(supabaseUrl, serviceRoleKey);
export default supabase;