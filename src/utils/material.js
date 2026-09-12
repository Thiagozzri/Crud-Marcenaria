export const getEstoqueStatus = (estoque, estoqueMinimo) => {
  if (estoque === 0) return "Sem estoque";
  if (estoque <= estoqueMinimo) return "Estoque baixo";
  return "Disponível";
};
export const getValorTotal = (material) =>
  material.estoque * material.preco_unitario;
export const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
export const formatQuantity = (value) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(value);
export const parseNumber = (value) => {
  const normalized = value.trim().replace(/\s/g, "");
  if (normalized.includes(",") && normalized.includes(".")) {
    return Number(normalized.replace(/\./g, "").replace(",", "."));
  }
  return Number(normalized.replace(",", "."));
};
export const materialToDraft = (material) => ({
  nome: material?.nome ?? "",
  categoria: material?.categoria ?? "",
  unidade: material?.unidade ?? "",
  estoque: material ? String(material.estoque).replace(".", ",") : "",
  estoque_minimo: material
    ? String(material.estoque_minimo).replace(".", ",")
    : "",
  preco_unitario: material
    ? String(material.preco_unitario).replace(".", ",")
    : "",
  fornecedor: material?.fornecedor ?? "",
});
export const validateMaterialDraft = (draft) => {
  const errors = {};
  const nome = draft.nome.trim();
  const categoria = draft.categoria.trim();
  const unidade = draft.unidade.trim();
  const fornecedor = draft.fornecedor.trim();
  const estoque = parseNumber(draft.estoque);
  const estoqueMinimo = parseNumber(draft.estoque_minimo);
  const precoUnitario = parseNumber(draft.preco_unitario);
  if (!nome) errors.nome = "Informe o nome do material.";
  if (!categoria) errors.categoria = "Informe a categoria.";
  if (!unidade) errors.unidade = "Informe a unidade de medida.";
  if (!fornecedor) errors.fornecedor = "Informe o fornecedor.";
  const validateNonNegative = (key, value, label) => {
    if (!draft[key].trim() || Number.isNaN(value)) {
      errors[key] = `Informe ${label} válido.`;
    } else if (value < 0) {
      errors[key] = "O valor não pode ser negativo.";
    }
  };
  validateNonNegative("estoque", estoque, "um estoque");
  validateNonNegative("estoque_minimo", estoqueMinimo, "um estoque mínimo");
  validateNonNegative("preco_unitario", precoUnitario, "um preço");
  if (Object.keys(errors).length > 0) return { errors };
  return {
    errors,
    data: {
      nome,
      categoria,
      unidade,
      estoque,
      estoque_minimo: estoqueMinimo,
      preco_unitario: precoUnitario,
      fornecedor,
    },
  };
};
export const normalizeMaterial = (material) => ({
  ...material,
  id: Number(material.id),
  estoque: Number(material.estoque),
  estoque_minimo: Number(material.estoque_minimo),
  preco_unitario: Number(material.preco_unitario),
});
