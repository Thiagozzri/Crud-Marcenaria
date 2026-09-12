import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { setupURLPolyfill } from "react-native-url-polyfill";

import { SNACK_SUPABASE_ANON_KEY, SNACK_SUPABASE_URL } from "../config";

setupURLPolyfill();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || SNACK_SUPABASE_URL;
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || SNACK_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = createClient(
  supabaseUrl ?? "https://qvsoxrzpeermckxxwevw.supabase.co",
  supabaseAnonKey ?? "3m15ZVedEIOBdMG4",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
