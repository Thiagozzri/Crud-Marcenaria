import { describe, expect, it } from 'vitest';

import type { MaterialDraft } from '../types/material';
import {
  getEstoqueStatus,
  getValorTotal,
  parseNumber,
  validateMaterialDraft,
} from './material';

const validDraft: MaterialDraft = {
  nome: 'Chapa MDF',
  categoria: 'Madeira',
  unidade: 'unidade',
  estoque: '12,5',
  estoque_minimo: '5',
  preco_unitario: '149,90',
  fornecedor: 'Fornecedor Juá',
};

describe('regras de negócio dos materiais', () => {
  it('calcula o valor total armazenado', () => {
    expect(getValorTotal({ estoque: 4, preco_unitario: 37.5 })).toBe(150);
  });

  it('classifica materiais sem estoque', () => {
    expect(getEstoqueStatus(0, 5)).toBe('Sem estoque');
  });

  it('classifica estoque igual ou abaixo do mínimo como baixo', () => {
    expect(getEstoqueStatus(5, 5)).toBe('Estoque baixo');
    expect(getEstoqueStatus(2, 5)).toBe('Estoque baixo');
  });

  it('classifica estoque acima do mínimo como disponível', () => {
    expect(getEstoqueStatus(6, 5)).toBe('Disponível');
  });

  it('aceita números no formato brasileiro', () => {
    expect(parseNumber('1.234,56')).toBe(1234.56);
    expect(parseNumber('19,90')).toBe(19.9);
  });

  it('converte um formulário válido para os dados do Supabase', () => {
    const result = validateMaterialDraft(validDraft);

    expect(result.errors).toEqual({});
    expect(result.data).toMatchObject({
      estoque: 12.5,
      estoque_minimo: 5,
      preco_unitario: 149.9,
    });
  });

  it.each(['estoque', 'estoque_minimo', 'preco_unitario'] as const)(
    'rejeita valor negativo em %s',
    (field) => {
      const result = validateMaterialDraft({ ...validDraft, [field]: '-1' });
      expect(result.errors[field]).toBe('O valor não pode ser negativo.');
      expect(result.data).toBeUndefined();
    },
  );

  it('exige os campos textuais', () => {
    const result = validateMaterialDraft({
      ...validDraft,
      nome: ' ',
      categoria: '',
      unidade: '',
      fornecedor: '',
    });

    expect(result.errors.nome).toBeTruthy();
    expect(result.errors.categoria).toBeTruthy();
    expect(result.errors.unidade).toBeTruthy();
    expect(result.errors.fornecedor).toBeTruthy();
  });
});
