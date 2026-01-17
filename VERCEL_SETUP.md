# Configuração do Projeto na Vercel

## Informações do Projeto

- **URL Vercel**: https://vercel.com/leonardo-fragas-projects/minimalmarketing-shop
- **Repositório GitHub**: https://github.com/fragas-sys/minimalmarketing.shop
- **Blob Storage**: minimalmarketing-shop-blob

---

## 1. Configurar Vercel Blob Storage

### Passo 1: Criar/Conectar o Blob Storage

1. Acesse: https://vercel.com/leonardo-fragas-projects/minimalmarketing-shop/stores
2. Clique em **"Create Database"** → **"Blob"**
3. Configure:
   - **Store Name**: `minimalmarketing-shop-blob`
   - Clique em **"Create"**

### Passo 2: Obter o Token

Depois de criar, a Vercel vai gerar automaticamente a variável de ambiente:
- `BLOB_READ_WRITE_TOKEN`

Esta variável já estará disponível no seu projeto.

---

## 2. Configurar Variáveis de Ambiente

Acesse: https://vercel.com/leonardo-fragas-projects/minimalmarketing-shop/settings/environment-variables

### Variáveis Obrigatórias

#### Database (Neon PostgreSQL)
```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```
**Como obter**: No painel do Neon (https://console.neon.tech/)

#### Stripe
```env
STRIPE_SECRET_KEY=sk_live_... ou sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... ou pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
**Como obter**:
- Dashboard: https://dashboard.stripe.com/apikeys
- Webhook: https://dashboard.stripe.com/webhooks

#### App
```env
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
```
**Valor**: Sua URL do Vercel (será preenchida automaticamente)

#### Cloudinary (Upload de Vídeos)
```env
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=sua_api_secret
```
**Como obter**:
1. Crie conta em: https://cloudinary.com/users/register/free
2. No Dashboard, copie: Cloud Name, API Key, API Secret
3. Dashboard: https://console.cloudinary.com/

#### Vercel Blob (Upload de Arquivos)
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```
**Como obter**:
- Criado automaticamente ao conectar o Blob Storage
- Ou acesse: https://vercel.com/leonardo-fragas-projects/minimalmarketing-shop/stores/minimalmarketing-shop-blob

---

## 3. Adicionar Variáveis na Vercel

### Via Interface Web

1. Acesse: https://vercel.com/leonardo-fragas-projects/minimalmarketing-shop/settings/environment-variables

2. Para cada variável:
   - Clique em **"Add New"**
   - **Key**: Nome da variável (ex: `DATABASE_URL`)
   - **Value**: Valor da variável
   - **Environments**: Marque **Production**, **Preview**, **Development**
   - Clique em **"Save"**

### Via Vercel CLI (Alternativa)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Link do projeto
vercel link

# Adicionar variáveis
vercel env add DATABASE_URL production
vercel env add STRIPE_SECRET_KEY production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add CLOUDINARY_CLOUD_NAME production
vercel env add CLOUDINARY_API_KEY production
vercel env add CLOUDINARY_API_SECRET production
```

---

## 4. Configurar Webhook do Stripe

Depois de fazer o deploy, você precisa configurar o webhook do Stripe:

1. Acesse: https://dashboard.stripe.com/webhooks
2. Clique em **"Add endpoint"**
3. Configure:
   - **Endpoint URL**: `https://seu-dominio.vercel.app/api/webhooks/stripe`
   - **Events to send**:
     - `checkout.session.completed`
     - `checkout.session.async_payment_succeeded`
   - Clique em **"Add endpoint"**
4. Copie o **Signing secret** (`whsec_...`)
5. Adicione na Vercel como `STRIPE_WEBHOOK_SECRET`

---

## 5. Fazer Deploy

### Automático (Recomendado)

Toda vez que você fizer push para o GitHub, a Vercel fará deploy automaticamente:

```bash
git add .
git commit -m "feat: sua mensagem"
git push origin main
```

### Manual via Vercel CLI

```bash
vercel --prod
```

---

## 6. Checklist de Configuração

- [ ] Vercel Blob criado e conectado
- [ ] `DATABASE_URL` configurado
- [ ] `STRIPE_SECRET_KEY` configurado
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` configurado
- [ ] `STRIPE_WEBHOOK_SECRET` configurado
- [ ] `NEXT_PUBLIC_APP_URL` configurado
- [ ] `CLOUDINARY_CLOUD_NAME` configurado
- [ ] `CLOUDINARY_API_KEY` configurado
- [ ] `CLOUDINARY_API_SECRET` configurado
- [ ] `BLOB_READ_WRITE_TOKEN` configurado (automático)
- [ ] Webhook do Stripe configurado
- [ ] Deploy realizado com sucesso

---

## 7. Testar o Projeto

Após o deploy:

1. **Homepage**: https://seu-dominio.vercel.app
2. **Admin**: https://seu-dominio.vercel.app/admin
3. **Upload de Vídeos**: Testar em `/admin/produto/[id]`

---

## 8. Troubleshooting

### Erro: "Missing environment variable"
- Verifique se todas as variáveis foram adicionadas
- Refaça o deploy após adicionar variáveis

### Erro: Upload de vídeos não funciona
- Verifique credenciais do Cloudinary
- Verifique se o Blob Storage está conectado

### Erro: Webhook do Stripe não funciona
- Verifique se o endpoint está correto
- Verifique se o `STRIPE_WEBHOOK_SECRET` está correto
- Teste com Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Erro: Database connection
- Verifique se o `DATABASE_URL` está correto
- Verifique se o banco Neon está ativo
- Verifique se as migrations foram executadas

---

## 9. Migrations do Banco de Dados

Se for o primeiro deploy, você precisa executar as migrations:

```bash
# Localmente
npm run db:push

# Ou via Vercel CLI
vercel env pull .env.local
npm run db:push
```

---

## 10. Domínio Customizado (Opcional)

Para usar um domínio próprio:

1. Acesse: https://vercel.com/leonardo-fragas-projects/minimalmarketing-shop/settings/domains
2. Clique em **"Add"**
3. Digite seu domínio (ex: `minimalmarketing.shop`)
4. Configure os DNS do seu domínio:
   - Tipo: `A` / Nome: `@` / Valor: `76.76.21.21`
   - Tipo: `CNAME` / Nome: `www` / Valor: `cname.vercel-dns.com`
5. Aguarde propagação (até 48h)

---

## Links Úteis

- **Dashboard Vercel**: https://vercel.com/leonardo-fragas-projects/minimalmarketing-shop
- **Logs**: https://vercel.com/leonardo-fragas-projects/minimalmarketing-shop/logs
- **Deployments**: https://vercel.com/leonardo-fragas-projects/minimalmarketing-shop/deployments
- **Environment Variables**: https://vercel.com/leonardo-fragas-projects/minimalmarketing-shop/settings/environment-variables
- **Domains**: https://vercel.com/leonardo-fragas-projects/minimalmarketing-shop/settings/domains
