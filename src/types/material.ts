export type EstoqueStatus = 'Sem estoque' | 'Estoque baixo' | 'Disponível';

export interface Material {
  id: number;
  nome: string;
  categoria: string;
  unidade: string;
  estoque: number;
  estoque_minimo: number;
  preco_unitario: number;
  fornecedor: string;
  criado_em: string;
  atualizado_em: string;
}

export type MaterialInput = Omit<Material, 'id' | 'criado_em' | 'atualizado_em'>;

export interface MaterialDraft {
  nome: string;
  categoria: string;
  unidade: string;
  estoque: string;
  estoque_minimo: string;
  preco_unitario: string;
  fornecedor: string;
}
