import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "../theme";
import {
  formatCurrency,
  formatQuantity,
  getEstoqueStatus,
  getValorTotal,
} from "../utils/material";
import { StatusBadge } from "./StatusBadge";
export function MaterialCard({ material, onPress }) {
  const status = getEstoqueStatus(material.estoque, material.estoque_minimo);
  const isCritical = status !== "Disponível";
  return (
    <Pressable
      accessibilityHint="Abre os detalhes do material"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isCritical && styles.criticalCard,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconWrap, isCritical && styles.criticalIcon]}>
        <Ionicons
          color={isCritical ? colors.warning : colors.primary}
          name="cube-outline"
          size={23}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.titleWrap}>
            <Text numberOfLines={1} style={styles.title}>
              {material.nome}
            </Text>
            <Text numberOfLines={1} style={styles.category}>
              {material.categoria}
            </Text>
          </View>
          <Ionicons color={colors.textMuted} name="chevron-forward" size={20} />
        </View>

        <View style={styles.badgeRow}>
          <StatusBadge status={status} />
        </View>

        <View style={styles.divider} />

        <View style={styles.valuesRow}>
          <View>
            <Text style={styles.label}>Estoque</Text>
            <Text style={styles.value}>
              {formatQuantity(material.estoque)} {material.unidade}
            </Text>
          </View>
          <View style={styles.rightValue}>
            <Text style={styles.label}>Valor armazenado</Text>
            <Text style={styles.total}>
              {formatCurrency(getValorTotal(material))}
            </Text>
          </View>
        </View>
        <Text style={styles.unitPrice}>
          {formatCurrency(material.preco_unitario)} por {material.unidade}
        </Text>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.medium,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 20,
    marginVertical: 6,
    padding: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  criticalCard: {
    borderColor: "#E8C89D",
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  criticalIcon: {
    backgroundColor: colors.warningSoft,
  },
  content: {
    flex: 1,
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
  },
  category: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 3,
  },
  badgeRow: {
    marginTop: 11,
  },
  divider: {
    backgroundColor: colors.border,
    height: StyleSheet.hairlineWidth,
    marginVertical: 13,
  },
  valuesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rightValue: {
    alignItems: "flex-end",
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  value: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  total: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },
  unitPrice: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 7,
    textAlign: "right",
  },
});
