#!/bin/bash

# Script para testar se o webhook está acessível
# Uso: ./scripts/test-webhook.sh

echo "🧪 Testando endpoint de webhook..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Testar endpoint de teste
echo "1️⃣ Testando GET /api/webhooks/stripe/test"
RESPONSE=$(curl -s http://localhost:3000/api/webhooks/stripe/test)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Endpoint acessível${NC}"
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
else
    echo -e "${RED}❌ Endpoint não acessível${NC}"
    exit 1
fi

echo ""
echo "2️⃣ Testando POST /api/webhooks/stripe/test"
curl -X POST http://localhost:3000/api/webhooks/stripe/test \
  -H "Content-Type: application/json" \
  -H "stripe-signature: test_signature" \
  -d '{"test": true}' \
  | jq '.' 2>/dev/null

echo ""
echo -e "${YELLOW}ℹ️  Para webhooks funcionarem em desenvolvimento:${NC}"
echo "   Execute: stripe listen --forward-to localhost:3000/api/webhooks/stripe"
echo ""
echo -e "${YELLOW}ℹ️  Para testar um webhook real:${NC}"
echo "   Execute: stripe trigger checkout.session.completed"
