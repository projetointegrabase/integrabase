# Projeto Integração

**Sport Club Internacional**

Sistema completo de acompanhamento psicossocial para atletas em transição da base para o profissional.

## 🎯 Sobre o Projeto

Este sistema foi desenvolvido para auxiliar o Serviço Social do Sport Club Internacional no acompanhamento integral de atletas que estão em transição das categorias de base para o time profissional. O objetivo é garantir que esses jovens recebam suporte psicossocial adequado durante essa fase crítica de suas vidas.

## 🏗️ Tecnologias

- **Frontend:** React 19 + Vite + Tailwind CSS 4
- **Backend:** Cloudflare Workers + tRPC 11
- **Banco de Dados:** Cloudflare D1 (SQLite serverless)
- **Autenticação:** Manus OAuth
- **Deploy:** Cloudflare Pages

## 📋 Funcionalidades

### Fase 1 (MVP - Implementada)
- ✅ Autenticação com OAuth
- ✅ Dashboard com navegação por setores
- ✅ Estrutura para formulários de Serviço Social
- ✅ Sistema de roles e permissões (RBAC)
- ✅ Design profissional com cores do Internacional

### Fase 2 (Planejada)
- 📋 Formulários completos de Serviço Social
- 📋 Gestão de atletas
- 📋 Algoritmos de análise de dados
- 📋 Relatórios e dashboards
- 📋 Alertas de risco

### Fase 3 (Futura)
- 📋 Formulários de Psicologia
- 📋 Formulários de Pedagogia
- 📋 Formulários de Nutrição
- 📋 Formulários de Medicina
- 📋 IA para análise preditiva

## 🚀 Como Começar

### Pré-requisitos

- Node.js 18+
- pnpm 8+
- Conta Cloudflare (gratuita)
- Wrangler CLI

### Instalação Local

```bash
# Clonar repositório
git clone <seu-repositorio>
cd projeto-integracao

# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm dev
```

### Deploy

Consulte o arquivo `GUIA_DEPLOY_CLOUDFLARE.md` para instruções completas de deploy.

## 📁 Estrutura do Projeto

```
projeto-integracao/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── contexts/      # Contextos React
│   │   └── lib/           # Utilitários
│   └── public/            # Arquivos estáticos
├── server/                # Backend Cloudflare Workers
│   ├── routers.ts         # Rotas tRPC
│   ├── db.ts              # Queries do banco
│   └── _core/             # Configurações do servidor
├── drizzle/               # Migrações do banco
│   └── schema.ts          # Schema do banco de dados
└── shared/                # Código compartilhado

```

## 🎨 Design System

O sistema utiliza as cores oficiais do Sport Club Internacional:

- **Primary Red:** #C8102E
- **Secondary Red:** #A00D24
- **Dark Red:** #7A0A1B

## 📚 Documentação

- `GUIA_DEPLOY_CLOUDFLARE.md` - Guia completo de deploy
- `ARQUITETURA_SISTEMA_ACOMPANHAMENTO.md` - Arquitetura técnica
- `formularios_servico_social.md` - Formulários com base científica
- `todo.md` - Lista de tarefas e roadmap

## 🔐 Segurança

- Autenticação OAuth segura
- JWT para sessões
- RBAC para controle de acesso
- Logs de auditoria
- Criptografia de dados sensíveis

## 📊 Banco de Dados

### Tabelas

- `users` - Usuários do sistema
- `athletes` - Atletas em transição
- `forms` - Formulários preenchidos
- `formResponses` - Respostas dos formulários
- `auditLogs` - Logs de auditoria
- `analysisCache` - Cache de análises

## 🤝 Contribuindo

Este é um projeto interno do Sport Club Internacional. Para contribuir:

1. Crie uma branch para sua feature
2. Faça commit das alterações
3. Abra um Pull Request

## 📄 Licença

Propriedade do Sport Club Internacional. Todos os direitos reservados.

## 👥 Equipe

Desenvolvido para o Serviço Social do Sport Club Internacional.

## 📞 Suporte

Para dúvidas ou suporte, consulte a documentação ou entre em contato com a equipe de TI do clube.

---

**Versão:** 1.0.0  
**Última atualização:** Janeiro 2025
