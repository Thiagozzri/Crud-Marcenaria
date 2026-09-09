import { supabase } from '../lib/supabase';
import type { Material, MaterialInput } from '../types/material';
import { normalizeMaterial } from '../utils/material';

const TABLE = 'materiais_marcenaria';

const throwIfError = (error: { message: string } | null) => {
  if (error) throw new Error(error.message);
};

export const listarMateriais = async (): Promise<Material[]> => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('atualizado_em', { ascending: false });

  throwIfError(error);
  return ((data ?? []) as Material[]).map(normalizeMaterial);
};

export const cadastrarMaterial = async (input: MaterialInput): Promise<Material> => {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ ...input, criado_em: now, atualizado_em: now }])
    .select()
    .single();

  throwIfError(error);
  if (!data) throw new Error('O Supabase não retornou o material cadastrado.');
  return normalizeMaterial(data as Material);
};

export const editarMaterial = async (
  id: number,
  input: MaterialInput,
): Promise<Material> => {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...input, atualizado_em: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  throwIfError(error);
  if (!data) throw new Error('O Supabase não retornou o material atualizado.');
  return normalizeMaterial(data as Material);
};

export const excluirMaterial = async (id: number): Promise<void> => {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  throwIfError(error);
};
