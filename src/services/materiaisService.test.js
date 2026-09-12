import { beforeEach, describe, expect, it, vi } from "vitest";
const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }));
vi.mock("../lib/supabase", () => ({
  supabase: { from: fromMock },
}));
import {
  cadastrarMaterial,
  editarMaterial,
  excluirMaterial,
  listarMateriais,
} from "./materiaisService";
const input = {
  nome: "Dobradiça caneco",
  categoria: "Ferragem",
  unidade: "unidade",
  estoque: 20,
  estoque_minimo: 8,
  preco_unitario: 7.5,
  fornecedor: "Casa das Ferragens",
};
const material = {
  id: 1,
  ...input,
  criado_em: "2026-09-09T10:00:00.000Z",
  atualizado_em: "2026-09-09T10:00:00.000Z",
};
describe("serviço de materiais", () => {
  beforeEach(() => {
    fromMock.mockReset();
  });
  it("lista os dados persistidos no Supabase ao abrir o app", async () => {
    const order = vi.fn().mockResolvedValue({ data: [material], error: null });
    const select = vi.fn().mockReturnValue({ order });
    fromMock.mockReturnValue({ select });
    await expect(listarMateriais()).resolves.toEqual([material]);
    expect(fromMock).toHaveBeenCalledWith("materiais_marcenaria");
    expect(order).toHaveBeenCalledWith("atualizado_em", { ascending: false });
  });
  it("cadastra e devolve o material criado", async () => {
    const single = vi.fn().mockResolvedValue({ data: material, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const insert = vi.fn().mockReturnValue({ select });
    fromMock.mockReturnValue({ insert });
    await expect(cadastrarMaterial(input)).resolves.toEqual(material);
    expect(insert).toHaveBeenCalledWith([
      expect.objectContaining({
        ...input,
        criado_em: expect.any(String),
        atualizado_em: expect.any(String),
      }),
    ]);
  });
  it("edita o material selecionado", async () => {
    const updated = { ...material, estoque: 30 };
    const single = vi.fn().mockResolvedValue({ data: updated, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const eq = vi.fn().mockReturnValue({ select });
    const update = vi.fn().mockReturnValue({ eq });
    fromMock.mockReturnValue({ update });
    await expect(editarMaterial(1, { ...input, estoque: 30 })).resolves.toEqual(
      updated,
    );
    expect(eq).toHaveBeenCalledWith("id", 1);
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        ...input,
        estoque: 30,
        atualizado_em: expect.any(String),
      }),
    );
  });
  it("exclui somente o material informado", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const deleteMock = vi.fn().mockReturnValue({ eq });
    fromMock.mockReturnValue({ delete: deleteMock });
    await expect(excluirMaterial(1)).resolves.toBeUndefined();
    expect(eq).toHaveBeenCalledWith("id", 1);
  });
  it("propaga erros retornados pelo Supabase", async () => {
    const order = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: "Falha remota" } });
    fromMock.mockReturnValue({ select: vi.fn().mockReturnValue({ order }) });
    await expect(listarMateriais()).rejects.toThrow("Falha remota");
  });
});
