import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCard } from "../components/MaterialCard";
import { colors, radius } from "../theme";
import {
  formatCurrency,
  getEstoqueStatus,
  getValorTotal,
} from "../utils/material";
const statusFilters = ["Todos", "Disponível", "Estoque baixo", "Sem estoque"];
export function HomeScreen({
  configured,
  error,
  loading,
  materials,
  onAdd,
  onRefresh,
  onSelect,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [status, setStatus] = useState("Todos");
  const categories = useMemo(
    () => [
      "Todas",
      ...Array.from(new Set(materials.map((item) => item.categoria))).sort(),
    ],
    [materials],
  );
  const filteredMaterials = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return materials.filter((material) => {
      const matchesSearch =
        !term ||
        material.nome.toLocaleLowerCase("pt-BR").includes(term) ||
        material.fornecedor.toLocaleLowerCase("pt-BR").includes(term);
      const matchesCategory =
        category === "Todas" || material.categoria === category;
      const materialStatus = getEstoqueStatus(
        material.estoque,
        material.estoque_minimo,
      );
      const matchesStatus = status === "Todos" || materialStatus === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [category, materials, search, status]);
  const totalValue = materials.reduce(
    (sum, material) => sum + getValorTotal(material),
    0,
  );
  const lowStockCount = materials.filter(
    (material) =>
      getEstoqueStatus(material.estoque, material.estoque_minimo) !==
      "Disponível",
  ).length;
  const header = (
    <View>
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.logo}>
            <Ionicons color={colors.white} name="hammer" size={24} />
          </View>
          <View>
            <Text style={styles.brandOverline}>CONTROLE DE ESTOQUE</Text>
            <Text style={styles.brand}>Marcenaria Juá</Text>
          </View>
        </View>
        <Pressable
          accessibilityLabel="Atualizar materiais"
          onPress={onRefresh}
          style={styles.refreshButton}
        >
          <Ionicons color={colors.primary} name="refresh" size={21} />
        </Pressable>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroLabel}>VALOR TOTAL EM ESTOQUE</Text>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={styles.heroValue}
            >
              {formatCurrency(totalValue)}
            </Text>
          </View>
          <View style={styles.heroIcon}>
            <Ionicons color={colors.white} name="wallet-outline" size={24} />
          </View>
        </View>
        <View style={styles.heroDivider} />
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>{materials.length}</Text>
            <Text style={styles.heroStatLabel}>Materiais</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.heroStat}>
            <Text
              style={[
                styles.heroStatValue,
                lowStockCount > 0 && styles.alertValue,
              ]}
            >
              {lowStockCount}
            </Text>
            <Text style={styles.heroStatLabel}>Para repor</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>
              {Math.max(materials.length - lowStockCount, 0)}
            </Text>
            <Text style={styles.heroStatLabel}>Disponíveis</Text>
          </View>
        </View>
      </View>

      {!configured ? (
        <View style={styles.notice}>
          <Ionicons color={colors.warning} name="key-outline" size={22} />
          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>Conecte seu projeto Supabase</Text>
            <Text style={styles.noticeText}>
              No Snack, informe a URL e a chave pública do projeto em
              src/config.js.
            </Text>
          </View>
        </View>
      ) : null}

      {error ? (
        <Pressable onPress={onRefresh} style={styles.errorNotice}>
          <Ionicons
            color={colors.danger}
            name="cloud-offline-outline"
            size={22}
          />
          <View style={styles.noticeContent}>
            <Text style={styles.errorTitle}>Não foi possível carregar</Text>
            <Text numberOfLines={2} style={styles.noticeText}>
              {error} Toque para tentar novamente.
            </Text>
          </View>
        </Pressable>
      ) : null}

      <View style={styles.searchWrap}>
        <Ionicons color={colors.textMuted} name="search" size={20} />
        <TextInput
          onChangeText={setSearch}
          placeholder="Pesquisar material ou fornecedor"
          placeholderTextColor="#8B938F"
          style={styles.searchInput}
          value={search}
        />
        {search ? (
          <Pressable
            accessibilityLabel="Limpar pesquisa"
            onPress={() => setSearch("")}
          >
            <Ionicons color={colors.textMuted} name="close-circle" size={20} />
          </Pressable>
        ) : null}
      </View>

      <Text style={styles.filterLabel}>Categoria</Text>
      <ScrollView
        contentContainerStyle={styles.chips}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((item) => (
          <Pressable
            key={item}
            onPress={() => setCategory(item)}
            style={[styles.chip, category === item && styles.chipActive]}
          >
            <Text
              style={[
                styles.chipText,
                category === item && styles.chipTextActive,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.filterLabel}>Situação</Text>
      <ScrollView
        contentContainerStyle={styles.chips}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {statusFilters.map((item) => (
          <Pressable
            key={item}
            onPress={() => setStatus(item)}
            style={[styles.chip, status === item && styles.chipActive]}
          >
            <Text
              style={[
                styles.chipText,
                status === item && styles.chipTextActive,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.listTitleRow}>
        <Text style={styles.listTitle}>Materiais</Text>
        <Text style={styles.resultCount}>
          {filteredMaterials.length}{" "}
          {filteredMaterials.length === 1 ? "item" : "itens"}
        </Text>
      </View>
    </View>
  );
  return (
    <View style={styles.screen}>
      <FlatList
        ListEmptyComponent={
          loading ? (
            <View style={styles.empty}>
              <ActivityIndicator color={colors.primary} size="large" />
              <Text style={styles.emptyText}>Carregando materiais...</Text>
            </View>
          ) : (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  color={colors.primary}
                  name="file-tray-outline"
                  size={34}
                />
              </View>
              <Text style={styles.emptyTitle}>
                {materials.length
                  ? "Nenhum resultado"
                  : "Seu estoque está vazio"}
              </Text>
              <Text style={styles.emptyText}>
                {materials.length
                  ? "Altere a pesquisa ou os filtros para encontrar um material."
                  : "Cadastre o primeiro material para começar o controle."}
              </Text>
            </View>
          )
        }
        ListFooterComponent={<View style={styles.footerSpace} />}
        ListHeaderComponent={header}
        contentContainerStyle={styles.listContent}
        data={filteredMaterials}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            onRefresh={onRefresh}
            refreshing={loading && materials.length > 0}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <MaterialCard material={item} onPress={() => onSelect(item)} />
        )}
        showsVerticalScrollIndicator={false}
      />

      <Pressable
        accessibilityLabel="Adicionar material"
        accessibilityRole="button"
        onPress={onAdd}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Ionicons color={colors.white} name="add" size={25} />
        <Text style={styles.fabText}>Adicionar</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  listContent: { flexGrow: 1 },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  brandRow: { alignItems: "center", flexDirection: "row", gap: 11 },
  logo: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 13,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  brandOverline: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.25,
  },
  brand: { color: colors.text, fontSize: 20, fontWeight: "900", marginTop: 2 },
  refreshButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: radius.large,
    marginHorizontal: 20,
    marginTop: 7,
    overflow: "hidden",
    padding: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 13,
    elevation: 5,
  },
  heroTop: { flexDirection: "row", justifyContent: "space-between" },
  heroLabel: {
    color: "#BFD3CB",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
  },
  heroValue: {
    color: colors.white,
    fontSize: 29,
    fontWeight: "900",
    marginTop: 7,
  },
  heroIcon: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 13,
    height: 45,
    justifyContent: "center",
    width: 45,
  },
  heroDivider: {
    backgroundColor: "rgba(255,255,255,0.13)",
    height: 1,
    marginVertical: 17,
  },
  heroStats: { flexDirection: "row" },
  heroStat: { alignItems: "center", flex: 1 },
  heroStatValue: { color: colors.white, fontSize: 19, fontWeight: "900" },
  alertValue: { color: "#FFD296" },
  heroStatLabel: { color: "#BFD3CB", fontSize: 11, marginTop: 3 },
  verticalDivider: { backgroundColor: "rgba(255,255,255,0.15)", width: 1 },
  notice: {
    alignItems: "flex-start",
    backgroundColor: colors.warningSoft,
    borderColor: "#E7CB92",
    borderRadius: radius.medium,
    borderWidth: 1,
    flexDirection: "row",
    gap: 11,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 14,
  },
  errorNotice: {
    alignItems: "flex-start",
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.medium,
    flexDirection: "row",
    gap: 11,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 14,
  },
  noticeContent: { flex: 1 },
  noticeTitle: { color: colors.warning, fontSize: 13, fontWeight: "800" },
  errorTitle: { color: colors.danger, fontSize: 13, fontWeight: "800" },
  noticeText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
  searchWrap: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 14,
  },
  searchInput: { color: colors.text, flex: 1, fontSize: 14, minHeight: 50 },
  filterLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginHorizontal: 20,
    marginTop: 16,
    textTransform: "uppercase",
  },
  chips: { gap: 8, paddingHorizontal: 20 },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textMuted, fontSize: 12, fontWeight: "700" },
  chipTextActive: { color: colors.white },
  listTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
    marginHorizontal: 20,
    marginTop: 24,
  },
  listTitle: { color: colors.text, fontSize: 20, fontWeight: "900" },
  resultCount: { color: colors.textMuted, fontSize: 12, fontWeight: "600" },
  empty: { alignItems: "center", marginHorizontal: 35, paddingVertical: 42 },
  emptyIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 24,
    height: 68,
    justifyContent: "center",
    marginBottom: 15,
    width: 68,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
    textAlign: "center",
  },
  footerSpace: { height: 105 },
  fab: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 18,
    bottom: 22,
    flexDirection: "row",
    gap: 7,
    minHeight: 56,
    paddingHorizontal: 19,
    position: "absolute",
    right: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabPressed: { opacity: 0.86, transform: [{ scale: 0.97 }] },
  fabText: { color: colors.white, fontSize: 14, fontWeight: "800" },
});
