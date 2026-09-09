# Marcenaria Juá


Aplicativo mobile para controlar materiais, estoque, fornecedores e valores de uma marcenaria. Construído com React Native, Expo, TypeScript e Supabase.

## Funcionalidades

- Dashboard com quantidade de materiais, valor total armazenado e itens para reposição.
- Listagem com pesquisa por nome ou fornecedor.
- Filtros por categoria e situação do estoque.
- Cadastro e edição com validação de todos os campos.
- Tela de detalhes com valor total e situação calculados automaticamente.
- Exclusão mediante confirmação.
- Destaque visual para materiais sem estoque e com estoque baixo.
- Dados persistidos no PostgreSQL do Supabase e recarregados ao abrir o aplicativo.
- Sessão do Supabase preparada para persistência com AsyncStorage.

## Pré-requisitos

- Node.js 20 ou superior.
- Aplicativo Expo Go ou um emulador Android/iOS.
- Projeto Supabase com a tabela `materiais_marcenaria` já criada.

> A criação da tabela não faz parte deste repositório. Caso o RLS esteja ativo, as políticas da tabela precisam permitir as operações `select`, `insert`, `update` e `delete` usadas pelo aplicativo.

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie o arquivo `.env` a partir do exemplo. No PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Substitua os valores do `.env` pela URL e pela chave pública (anon/publishable) do seu projeto:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
   ```

4. Inicie o projeto:

   ```bash
   npm start
   ```

Use `npm run android`, `npm run ios` ou `npm run web` para abrir uma plataforma diretamente.

## Regras de estoque

- Estoque igual a zero: **Sem estoque**.
- Estoque maior que zero e menor ou igual ao mínimo: **Estoque baixo**.
- Estoque acima do mínimo: **Disponível**.
- O valor armazenado é `estoque × preço unitário`.
- Estoque, estoque mínimo e preço unitário não aceitam valores negativos.

## Validação

Execute a checagem de tipos e os testes automatizados:

```bash
npm run typecheck
npm test
```

Os testes cobrem cálculos, classificação do estoque, validação de números negativos e as quatro operações do serviço Supabase. A persistência real deve ser conferida com as credenciais do projeto: cadastre um item, encerre o Expo, abra novamente e confirme que o item é carregado.

## Estrutura

```text
├── App.tsx
├── app.json
├── .env.example
├── src
│   ├── components
│   │   ├── MaterialCard.tsx
│   │   ├── MaterialForm.tsx
│   │   └── StatusBadge.tsx
│   ├── lib
│   │   └── supabase.ts
│   ├── screens
│   │   ├── DetailsScreen.tsx
│   │   └── HomeScreen.tsx
│   ├── services
│   │   └── materiaisService.ts
│   ├── types
│   │   └── material.ts
│   └── utils
│       └── material.ts
└── README.md
```
