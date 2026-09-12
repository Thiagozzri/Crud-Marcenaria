import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

import { SNACK_SUPABASE_ANON_KEY, SNACK_SUPABASE_URL } from "../config";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || SNACK_SUPABASE_URL;
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || SNACK_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = createClient(
  supabaseUrl ?? "https://configuracao-pendente.supabase.co",
  supabaseAnonKey ?? "configuracao-pendente",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
