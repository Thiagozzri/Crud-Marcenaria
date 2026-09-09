import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';
import type { EstoqueStatus } from '../types/material';

interface StatusBadgeProps {
  status: EstoqueStatus;
}

const statusColors: Record<EstoqueStatus, { background: string; text: string; dot: string }> = {
  'Sem estoque': {
    background: colors.dangerSoft,
    text: colors.danger,
    dot: colors.danger,
  },
  'Estoque baixo': {
    background: colors.warningSoft,
    text: colors.warning,
    dot: colors.warning,
  },
  Disponível: {
    background: colors.successSoft,
    text: colors.success,
    dot: colors.success,
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const palette = statusColors[status];

  return (
    <View style={[styles.badge, { backgroundColor: palette.background }]}>
      <View style={[styles.dot, { backgroundColor: palette.dot }]} />
      <Text style={[styles.text, { color: palette.text }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  dot: {
    borderRadius: 4,
    height: 7,
    width: 7,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
