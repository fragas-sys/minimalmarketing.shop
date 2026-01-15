#!/bin/bash

# Script para configurar Stripe em desenvolvimento
# Uso: ./scripts/setup-stripe-dev.sh

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}🚀 Setup Stripe para Desenvolvimento${NC}"
echo "======================================"
echo ""

# Verificar se Stripe CLI está instalado
echo -e "${YELLOW}1️⃣ Verificando Stripe CLI...${NC}"
if ! command -v stripe &> /dev/null; then
    echo -e "${RED}❌ Stripe CLI não encontrado${NC}"
    echo ""
    echo "Instalando via Homebrew..."
    brew install stripe/stripe-cli/stripe

    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Falha na instalação${NC}"
        echo "Instale manualmente: https://stripe.com/docs/stripe-cli"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Stripe CLI instalado${NC}"
    stripe --version
fi

echo ""

# Verificar login
echo -e "${YELLOW}2️⃣ Verificando login no Stripe...${NC}"
if ! stripe config --list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Não está logado. Iniciando login...${NC}"
    stripe login
else
    echo -e "${GREEN}✅ Já está logado no Stripe${NC}"
fi

echo ""

# Verificar .env.local
echo -e "${YELLOW}3️⃣ Verificando variáveis de ambiente...${NC}"
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ Arquivo .env.local não encontrado${NC}"
    echo "Crie o arquivo .env.local com as variáveis necessárias"
    exit 1
fi

# Verificar variáveis necessárias
MISSING_VARS=()

if ! grep -q "STRIPE_SECRET_KEY" .env.local; then
    MISSING_VARS+=("STRIPE_SECRET_KEY")
fi

if ! grep -q "NEXT_PUBLIC_APP_URL" .env.local; then
    MISSING_VARS+=("NEXT_PUBLIC_APP_URL")
fi

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${RED}❌ Variáveis faltando: ${MISSING_VARS[*]}${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Variáveis de ambiente configuradas${NC}"

echo ""

# Gerar novo webhook secret
echo -e "${YELLOW}4️⃣ Gerando webhook secret...${NC}"
echo ""
echo -e "${BLUE}Execute este comando em outro terminal:${NC}"
echo ""
echo -e "${GREEN}stripe listen --forward-to localhost:3000/api/webhooks/stripe${NC}"
echo ""
echo -e "${YELLOW}Depois, copie o 'webhook signing secret' que aparecerá${NC}"
echo -e "${YELLOW}e atualize a variável STRIPE_WEBHOOK_SECRET no .env.local${NC}"
echo ""
echo -e "${RED}IMPORTANTE: Reinicie o servidor Next.js após atualizar!${NC}"
echo ""

# Testar endpoint
echo -e "${YELLOW}5️⃣ Testando endpoint de webhook...${NC}"
echo ""

# Verificar se o servidor está rodando
if curl -s http://localhost:3000/api/webhooks/stripe/test > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Servidor Next.js está rodando${NC}"
    echo ""

    RESPONSE=$(curl -s http://localhost:3000/api/webhooks/stripe/test)
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
else
    echo -e "${RED}❌ Servidor Next.js não está rodando${NC}"
    echo ""
    echo "Inicie o servidor com: npm run dev"
fi

echo ""
echo "======================================"
echo -e "${GREEN}✅ Setup Concluído!${NC}"
echo ""
echo -e "${BLUE}📝 Próximos passos:${NC}"
echo ""
echo "1. Em um terminal, execute:"
echo -e "   ${GREEN}npm run dev${NC}"
echo ""
echo "2. Em outro terminal, execute:"
echo -e "   ${GREEN}stripe listen --forward-to localhost:3000/api/webhooks/stripe${NC}"
echo ""
echo "3. Copie o webhook secret e atualize .env.local"
echo ""
echo "4. Reinicie o servidor Next.js"
echo ""
echo "5. Faça um teste:"
echo -e "   ${GREEN}stripe trigger checkout.session.completed${NC}"
echo ""
echo -e "${YELLOW}📚 Para troubleshooting, veja: WEBHOOK_DEBUG.md${NC}"
echo ""
