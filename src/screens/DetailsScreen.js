import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBadge } from "../components/StatusBadge";
import { colors, radius } from "../theme";
import {
  formatCurrency,
  formatQuantity,
  getEstoqueStatus,
  getValorTotal,
} from "../utils/material";
function DetailRow({ icon, label, value }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Ionicons color={colors.primary} name={icon} size={19} />
      </View>
      <View style={styles.detailText}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}
export function DetailsScreen({
  deleting,
  material,
  onBack,
  onDelete,
  onEdit,
}) {
  const status = getEstoqueStatus(material.estoque, material.estoque_minimo);
  const updatedAt = new Date(material.atualizado_em);
  const formattedDate = Number.isNaN(updatedAt.getTime())
    ? "Não informada"
    : updatedAt.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Voltar"
          onPress={onBack}
          style={styles.iconButton}
        >
          <Ionicons color={colors.text} name="arrow-back" size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Detalhes do material</Text>
        <Pressable
          accessibilityLabel="Editar material"
          onPress={onEdit}
          style={styles.iconButton}
        >
          <Ionicons color={colors.primary} name="create-outline" size={22} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.materialHeading}>
          <View style={styles.materialIcon}>
            <Ionicons color={colors.primary} name="cube" size={30} />
          </View>
          <Text style={styles.category}>
            {material.categoria.toUpperCase()}
          </Text>
          <Text style={styles.name}>{material.nome}</Text>
          <StatusBadge status={status} />
        </View>

        <View style={styles.valueCard}>
          <View>
            <Text style={styles.valueLabel}>VALOR TOTAL ARMAZENADO</Text>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={styles.totalValue}
            >
              {formatCurrency(getValorTotal(material))}
            </Text>
          </View>
          <View style={styles.walletIcon}>
            <Ionicons color={colors.white} name="wallet" size={23} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Estoque e valores</Text>
        <View style={styles.detailsCard}>
          <DetailRow
            icon="layers-outline"
            label="Quantidade disponível"
            value={`${formatQuantity(material.estoque)} ${material.unidade}`}
          />
          <View style={styles.divider} />
          <DetailRow
            icon="alert-circle-outline"
            label="Estoque mínimo"
            value={`${formatQuantity(material.estoque_minimo)} ${material.unidade}`}
          />
          <View style={styles.divider} />
          <DetailRow
            icon="cash-outline"
            label="Preço unitário"
            value={`${formatCurrency(material.preco_unitario)} / ${material.unidade}`}
          />
        </View>

        <Text style={styles.sectionTitle}>Outras informações</Text>
        <View style={styles.detailsCard}>
          <DetailRow
            icon="business-outline"
            label="Fornecedor"
            value={material.fornecedor}
          />
          <View style={styles.divider} />
          <DetailRow
            icon="grid-outline"
            label="Categoria"
            value={material.categoria}
          />
          <View style={styles.divider} />
          <DetailRow
            icon="resize-outline"
            label="Unidade de medida"
            value={material.unidade}
          />
          <View style={styles.divider} />
          <DetailRow
            icon="calendar-outline"
            label="Última atualização"
            value={formattedDate}
          />
        </View>

        <Pressable
          onPress={onEdit}
          style={({ pressed }) => [
            styles.editButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons color={colors.white} name="create-outline" size={21} />
          <Text style={styles.editText}>Editar material</Text>
        </Pressable>
        <Pressable
          disabled={deleting}
          onPress={onDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.pressed,
          ]}
        >
          {deleting ? (
            <ActivityIndicator color={colors.danger} />
          ) : (
            <>
              <Ionicons color={colors.danger} name="trash-outline" size={20} />
              <Text style={styles.deleteText}>Excluir material</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  header: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    height: 43,
    justifyContent: "center",
    width: 43,
  },
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: "800" },
  content: { padding: 20, paddingBottom: 40 },
  materialHeading: { alignItems: "center", paddingBottom: 20 },
  materialIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 22,
    height: 67,
    justifyContent: "center",
    marginBottom: 13,
    width: 67,
  },
  category: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  name: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "900",
    marginBottom: 11,
    marginTop: 4,
    textAlign: "center",
  },
  valueCard: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.large,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 26,
    padding: 20,
  },
  valueLabel: {
    color: "#BFD3CB",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },
  totalValue: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "900",
    marginTop: 6,
    maxWidth: 245,
  },
  walletIcon: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.13)",
    borderRadius: 13,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
    marginTop: 2,
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.medium,
    borderWidth: 1,
    marginBottom: 24,
    paddingHorizontal: 15,
  },
  detailRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingVertical: 14,
  },
  detailIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 10,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  detailText: { flex: 1 },
  detailLabel: { color: colors.textMuted, fontSize: 11, fontWeight: "600" },
  detailValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 3,
  },
  divider: { backgroundColor: colors.border, height: StyleSheet.hairlineWidth },
  editButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 14,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 54,
  },
  editText: { color: colors.white, fontSize: 15, fontWeight: "800" },
  deleteButton: {
    alignItems: "center",
    borderColor: colors.danger,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 12,
    minHeight: 50,
  },
  deleteText: { color: colors.danger, fontSize: 14, fontWeight: "700" },
  pressed: { opacity: 0.8 },
});
