import { createClient } from "@supabase/supabase-js";

// =========================================================================
// REPLACE THESE VARIABLES WITH YOUR ACTUAL SUPABASE CREDENTIALS LATER
// =========================================================================
const SUPABASE_URL = "https://jayngcubneiqotkrkmqi.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_dRoC70CDE-Qm8nNUfOdVDA_z5TmMgpH";

// Create and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
