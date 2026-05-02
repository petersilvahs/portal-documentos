# Portal de Documentos

Sistema de solicitação de documentos cartorários desenvolvido com Next.js, TypeScript e Tailwind CSS.

## Tecnologias

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- JSON Server (API REST local)
- ContextAPI

## Pré-requisitos

- Node.js 18+
- npm

## Como executar

Clone o repositório e instale as dependências:

```bash
npm install
```

Inicie a aplicação junto com o servidor de API:

```bash
npm run dev
```

Isso inicializa dois processos em paralelo:
- Frontend Next.js em `http://localhost:3000`
- API JSON Server em `http://localhost:3001`

Para rodar separadamente:

```bash
# Apenas o frontend
npm run dev:next

# Apenas a API
npm run dev:api
```

## Funcionalidades

- Listagem de documentos com contagem atualizada em tempo real
- Cadastro de documentos com validação de campos obrigatórios
- Máscara automática para CPF, CNPJ e CEP
- Preenchimento automático de endereço via ViaCEP
- Remoção de documentos com modal de confirmação
- Visualização detalhada de cada documento
- Empty state quando não há documentos cadastrados
- Feedback visual (toast) para cadastro e remoção
- Paginação automática quando a lista ultrapassa 10 itens
- Loading state durante requisições
- Responsivo para dispositivos móveis

