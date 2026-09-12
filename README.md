# Marcenaria Juá

Aplicativo em JavaScript para controlar materiais, estoque, fornecedores e valores de uma marcenaria. Compatível com Expo Snack, Expo Go, Android, iOS e web.

## Abrir no Expo Snack

1. Crie um projeto vazio em [snack.expo.dev](https://snack.expo.dev/).
2. Use o SDK 57 e copie para o Snack o `App.js` e a pasta `src` deste projeto.
3. No painel de dependências do Snack, adicione:

   - `@expo/vector-icons`
   - `@react-native-async-storage/async-storage`
   - `@supabase/supabase-js`
   - `expo-status-bar`
   - `react-native-safe-area-context`
   - `react-native-url-polyfill`

4. Abra `src/config.js` e informe a URL e a chave pública do Supabase:

   ```js
   export const SNACK_SUPABASE_URL = 'https://seu-projeto.supabase.co';
   export const SNACK_SUPABASE_ANON_KEY = 'sua-chave-publica';
   ```

5. Execute o Snack em Android, iOS ou web.

Use apenas a chave pública `anon`/`publishable`. Nunca coloque a chave `service_role` no aplicativo ou no Snack, pois o código executado no cliente é público.

## Executar localmente

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

Preencha as variáveis:

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
```

Inicie o Expo:

```bash
npm start
```

Também estão disponíveis `npm run android`, `npm run ios` e `npm run web`.

## Banco de dados

O projeto espera uma tabela chamada `materiais_marcenaria` no Supabase, com os campos:

- `id`
- `nome`
- `categoria`
- `unidade`
- `estoque`
- `estoque_minimo`
- `preco_unitario`
- `fornecedor`
- `criado_em`
- `atualizado_em`

Se o RLS estiver ativo, configure políticas que permitam as operações `select`, `insert`, `update` e `delete` usadas pelo aplicativo.

## Funcionalidades

- Dashboard com quantidade de materiais, valor total e itens para reposição.
- Pesquisa por nome ou fornecedor.
- Filtros por categoria e situação do estoque.
- Cadastro, edição, detalhes e exclusão de materiais.
- Validação de valores negativos e campos obrigatórios.
- Persistência no Supabase e sessão com AsyncStorage.

## Testes

```bash
npm test
```

## Estrutura usada pelo Snack

```text
App.js
src/
├── components/
├── lib/
├── screens/
├── services/
├── utils/
├── config.js
└── theme.js
```
