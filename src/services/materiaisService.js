import { supabase } from "../lib/supabase";
import { normalizeMaterial } from "../utils/material";
const TABLE = "materiais_marcenaria";
const throwIfError = (error) => {
  if (error) throw new Error(error.message);
};
const getSupabase = () => {
  if (!supabase) {
    throw new Error(
      "Supabase não configurado. Informe a URL e a chave pública em src/config.js.",
    );
  }
  return supabase;
};
export const listarMateriais = async () => {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .order("atualizado_em", { ascending: false });
  throwIfError(error);
  return (data ?? []).map(normalizeMaterial);
};
export const cadastrarMaterial = async (input) => {
  const now = new Date().toISOString();
  const { data, error } = await getSupabase()
    .from(TABLE)
    .insert([{ ...input, criado_em: now, atualizado_em: now }])
    .select()
    .single();
  throwIfError(error);
  if (!data) throw new Error("O Supabase não retornou o material cadastrado.");
  return normalizeMaterial(data);
};
export const editarMaterial = async (id, input) => {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .update({ ...input, atualizado_em: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  throwIfError(error);
  if (!data) throw new Error("O Supabase não retornou o material atualizado.");
  return normalizeMaterial(data);
};
export const excluirMaterial = async (id) => {
  const { error } = await getSupabase().from(TABLE).delete().eq("id", id);
  throwIfError(error);
};
