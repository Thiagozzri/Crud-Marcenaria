import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, radius } from "../theme";
import { materialToDraft, validateMaterialDraft } from "../utils/material";
function FormField({
  error,
  icon,
  keyboardType = "default",
  label,
  onChangeText,
  placeholder,
  value,
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, error && styles.inputError]}>
        <Ionicons
          color={error ? colors.danger : colors.textMuted}
          name={icon}
          size={19}
        />
        <TextInput
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#949B98"
          style={styles.input}
          value={value}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}
export function MaterialForm({
  material,
  loading,
  onCancel,
  onDelete,
  onSubmit,
}) {
  const [draft, setDraft] = useState(() => materialToDraft(material));
  const [errors, setErrors] = useState({});
  const updateField = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }));
    if (errors[field])
      setErrors((current) => ({ ...current, [field]: undefined }));
  };
  const handleSubmit = async () => {
    const result = validateMaterialDraft(draft);
    setErrors(result.errors);
    if (!result.data) return;
    await onSubmit(result.data);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Voltar"
          onPress={onCancel}
          style={styles.iconButton}
        >
          <Ionicons color={colors.text} name="arrow-back" size={24} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>
            {material ? "EDITAR CADASTRO" : "NOVO CADASTRO"}
          </Text>
          <Text style={styles.title}>
            {material ? "Editar material" : "Adicionar material"}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <View style={styles.introIcon}>
            <Ionicons color={colors.primary} name="hammer-outline" size={24} />
          </View>
          <View style={styles.introText}>
            <Text style={styles.sectionTitle}>Informações do material</Text>
            <Text style={styles.sectionSubtitle}>
              Preencha os dados para manter o estoque organizado.
            </Text>
          </View>
        </View>

        <FormField
          error={errors.nome}
          icon="cube-outline"
          label="Nome do material"
          onChangeText={(value) => updateField("nome", value)}
          placeholder="Ex.: Chapa MDF Carvalho"
          value={draft.nome}
        />
        <FormField
          error={errors.categoria}
          icon="grid-outline"
          label="Categoria"
          onChangeText={(value) => updateField("categoria", value)}
          placeholder="Ex.: Madeira, ferragem, acabamento"
          value={draft.categoria}
        />
        <FormField
          error={errors.unidade}
          icon="resize-outline"
          label="Unidade de medida"
          onChangeText={(value) => updateField("unidade", value)}
          placeholder="Ex.: unidade, metro, litro, caixa"
          value={draft.unidade}
        />

        <View style={styles.row}>
          <View style={styles.halfField}>
            <FormField
              error={errors.estoque}
              icon="layers-outline"
              keyboardType="decimal-pad"
              label="Estoque atual"
              onChangeText={(value) => updateField("estoque", value)}
              placeholder="0"
              value={draft.estoque}
            />
          </View>
          <View style={styles.halfField}>
            <FormField
              error={errors.estoque_minimo}
              icon="alert-circle-outline"
              keyboardType="decimal-pad"
              label="Estoque mínimo"
              onChangeText={(value) => updateField("estoque_minimo", value)}
              placeholder="0"
              value={draft.estoque_minimo}
            />
          </View>
        </View>

        <FormField
          error={errors.preco_unitario}
          icon="cash-outline"
          keyboardType="decimal-pad"
          label="Preço unitário (R$)"
          onChangeText={(value) => updateField("preco_unitario", value)}
          placeholder="0,00"
          value={draft.preco_unitario}
        />
        <FormField
          error={errors.fornecedor}
          icon="business-outline"
          label="Fornecedor"
          onChangeText={(value) => updateField("fornecedor", value)}
          placeholder="Ex.: Madeiras Juazeiro"
          value={draft.fornecedor}
        />

        <View style={styles.tip}>
          <Ionicons
            color={colors.primary}
            name="information-circle-outline"
            size={21}
          />
          <Text style={styles.tipText}>
            O valor armazenado e a situação do estoque são calculados
            automaticamente.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={loading}
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.pressed,
            loading && styles.disabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons
                color={colors.white}
                name="checkmark-circle-outline"
                size={22}
              />
              <Text style={styles.submitText}>
                {material ? "Salvar alterações" : "Cadastrar material"}
              </Text>
            </>
          )}
        </Pressable>

        {material && onDelete ? (
          <Pressable
            disabled={loading}
            onPress={onDelete}
            style={styles.deleteButton}
          >
            <Ionicons color={colors.danger} name="trash-outline" size={20} />
            <Text style={styles.deleteText}>Excluir material</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  header: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 13,
    paddingBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  headerText: { flex: 1 },
  eyebrow: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  title: { color: colors.text, fontSize: 23, fontWeight: "800", marginTop: 2 },
  content: { padding: 20, paddingBottom: 44 },
  intro: { flexDirection: "row", gap: 12, marginBottom: 24 },
  introIcon: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 13,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  introText: { flex: 1 },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: "800" },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },
  fieldWrap: { marginBottom: 17 },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 7,
  },
  inputWrap: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.small,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  inputError: { borderColor: colors.danger },
  input: { color: colors.text, flex: 1, fontSize: 15, paddingVertical: 13 },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginLeft: 3,
    marginTop: 5,
  },
  row: { flexDirection: "row", gap: 12 },
  halfField: { flex: 1 },
  tip: {
    alignItems: "flex-start",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.small,
    flexDirection: "row",
    gap: 9,
    marginBottom: 22,
    padding: 13,
  },
  tipText: { color: colors.primary, flex: 1, fontSize: 12, lineHeight: 18 },
  submitButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 14,
    flexDirection: "row",
    gap: 9,
    justifyContent: "center",
    minHeight: 54,
  },
  submitText: { color: colors.white, fontSize: 15, fontWeight: "800" },
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
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.65 },
});
