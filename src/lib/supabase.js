import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { setupURLPolyfill } from "react-native-url-polyfill";

import { SNACK_SUPABASE_ANON_KEY, SNACK_SUPABASE_URL } from "../config";

setupURLPolyfill();

const envSupabaseUrl =
  typeof process !== "undefined"
    ? process.env.EXPO_PUBLIC_SUPABASE_URL
    : undefined;
const envSupabaseAnonKey =
  typeof process !== "undefined"
    ? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    : undefined;

const supabaseUrl = envSupabaseUrl || SNACK_SUPABASE_URL;
const supabaseAnonKey =
  envSupabaseAnonKey || SNACK_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;
