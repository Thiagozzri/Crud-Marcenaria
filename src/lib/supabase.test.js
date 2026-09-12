import { describe, expect, it, vi } from "vitest";

const { createClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
}));

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {},
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: createClientMock,
}));

vi.mock("react-native-url-polyfill", () => ({
  setupURLPolyfill: vi.fn(),
}));

vi.mock("../config", () => ({
  SNACK_SUPABASE_URL: "",
  SNACK_SUPABASE_ANON_KEY: "",
}));

import { isSupabaseConfigured, supabase } from "./supabase";

describe("configuração do Supabase", () => {
  it("não cria o cliente enquanto URL e chave estiverem vazias", () => {
    expect(isSupabaseConfigured).toBe(false);
    expect(supabase).toBeNull();
    expect(createClientMock).not.toHaveBeenCalled();
  });
});
