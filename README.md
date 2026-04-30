# 🎬 Motion Library

Biblioteca de consulta rápida para Motion Designers — efeitos, técnicas, expressões After Effects e muito mais.

---

## 📁 Estrutura do projeto

```
motion-library/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx        ← Toda a lógica e UI
│   ├── main.jsx       ← Entry point React
│   └── index.css      ← Reset e estilos base
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Como rodar localmente

### 1. Instale as dependências
```bash
npm install
```

### 2. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

Acesse **http://localhost:5173** no navegador.

---

## 📦 Como fazer o build para produção

```bash
npm run build
```

Os arquivos finais ficam na pasta `dist/`.

Para testar o build localmente:
```bash
npm run preview
```

---

## ☁️ Como publicar na Vercel

### Opção 1 — Via GitHub (recomendado)

1. Suba o projeto para um repositório no GitHub
2. Acesse [vercel.com](https://vercel.com) e faça login
3. Clique em **"Add New Project"**
4. Importe o repositório do GitHub
5. A Vercel detecta automaticamente que é um projeto Vite
6. Clique em **"Deploy"**

✅ Pronto! A Vercel gera uma URL pública automaticamente.

### Opção 2 — Via Vercel CLI

```bash
# Instale a CLI da Vercel globalmente
npm i -g vercel

# Dentro da pasta do projeto, rode:
vercel

# Siga as instruções no terminal
# Para deploy de produção:
vercel --prod
```

---

## ✨ Funcionalidades

- 🔍 **Busca em tempo real** por nome, alias, técnica, expressão e palavras-chave
- 🗂️ **Filtros por categoria** (After Effects, Expressões, Loops, Partículas, etc.)
- 🎯 **Filtro por nível** (básico, intermediário, avançado)
- 📋 **Cards informativos** com preview de expressão e tags
- 🔎 **Modal de detalhe** com todas as informações completas
- ✏️ **Editar e excluir** qualquer item
- ➕ **Adicionar novos itens** manualmente
- 💾 **Persistência** via localStorage (dados salvos no navegador)
- ↺ **Restaurar dados originais** a qualquer momento
- ⌨️ **Atalho ⌘K** para focar na busca

---

## 🛠️ Tecnologias

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- CSS-in-JS inline (sem dependências de UI externas)
- Google Fonts: DM Sans + DM Mono
