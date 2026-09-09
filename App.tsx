import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { MaterialForm } from './src/components/MaterialForm';
import { isSupabaseConfigured } from './src/lib/supabase';
import { DetailsScreen } from './src/screens/DetailsScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import {
  cadastrarMaterial,
  editarMaterial,
  excluirMaterial,
  listarMateriais,
} from './src/services/materiaisService';
import { colors } from './src/theme';
import type { Material, MaterialInput } from './src/types/material';

type Route =
  | { name: 'home' }
  | { name: 'create' }
  | { name: 'details'; material: Material }
  | { name: 'edit'; material: Material };

const getErrorMessage = (error: unknown) => {
  if (!(error instanceof Error)) return 'Ocorreu um erro inesperado.';
  if (error.message.toLowerCase().includes('row-level security')) {
    return 'A política de acesso do Supabase bloqueou a operação. Confira as políticas RLS da tabela.';
  }
  if (error.message.toLowerCase().includes('network')) {
    return 'Não foi possível acessar o Supabase. Confira sua internet e as variáveis do arquivo .env.';
  }
  return error.message;
};

function MarcenariaApp() {
  const [route, setRoute] = useState<Route>({ name: 'home' });
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMaterials = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setMaterials(await listarMateriais());
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMaterials();
  }, [loadMaterials]);

  const requireConfiguration = () => {
    if (isSupabaseConfigured) return true;
    Alert.alert(
      'Supabase não configurado',
      'Crie o arquivo .env a partir do .env.example e reinicie o Expo.',
    );
    return false;
  };

  const handleCreate = async (input: MaterialInput) => {
    if (!requireConfiguration()) return;
    setBusy(true);
    try {
      const created = await cadastrarMaterial(input);
      setMaterials((current) => [created, ...current]);
      setRoute({ name: 'home' });
    } catch (createError) {
      Alert.alert('Não foi possível cadastrar', getErrorMessage(createError));
    } finally {
      setBusy(false);
    }
  };

  const handleUpdate = async (material: Material, input: MaterialInput) => {
    if (!requireConfiguration()) return;
    setBusy(true);
    try {
      const updated = await editarMaterial(material.id, input);
      setMaterials((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setRoute({ name: 'details', material: updated });
    } catch (updateError) {
      Alert.alert('Não foi possível salvar', getErrorMessage(updateError));
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = (material: Material) => {
    Alert.alert(
      'Excluir material?',
      `${material.nome} será removido permanentemente do estoque.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            if (!requireConfiguration()) return;
            setBusy(true);
            void excluirMaterial(material.id)
              .then(() => {
                setMaterials((current) => current.filter((item) => item.id !== material.id));
                setRoute({ name: 'home' });
              })
              .catch((deleteError: unknown) => {
                Alert.alert('Não foi possível excluir', getErrorMessage(deleteError));
              })
              .finally(() => setBusy(false));
          },
        },
      ],
    );
  };

  let content;

  if (route.name === 'create') {
    content = (
      <MaterialForm
        loading={busy}
        onCancel={() => setRoute({ name: 'home' })}
        onSubmit={handleCreate}
      />
    );
  } else if (route.name === 'edit') {
    content = (
      <MaterialForm
        loading={busy}
        material={route.material}
        onCancel={() => setRoute({ name: 'details', material: route.material })}
        onDelete={() => confirmDelete(route.material)}
        onSubmit={(input) => handleUpdate(route.material, input)}
      />
    );
  } else if (route.name === 'details') {
    content = (
      <DetailsScreen
        deleting={busy}
        material={route.material}
        onBack={() => setRoute({ name: 'home' })}
        onDelete={() => confirmDelete(route.material)}
        onEdit={() => setRoute({ name: 'edit', material: route.material })}
      />
    );
  } else {
    content = (
      <HomeScreen
        configured={isSupabaseConfigured}
        error={error}
        loading={loading}
        materials={materials}
        onAdd={() => setRoute({ name: 'create' })}
        onRefresh={() => void loadMaterials()}
        onSelect={(material) => setRoute({ name: 'details', material })}
      />
    );
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <StatusBar style="dark" />
      {content}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MarcenariaApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
});
