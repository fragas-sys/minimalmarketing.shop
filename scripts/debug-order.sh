#!/bin/bash

# Script para debugar orders no banco
# Uso: ./scripts/debug-order.sh [session_id]

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SESSION_ID=$1

echo ""
echo -e "${BLUE}🔍 Debug de Orders${NC}"
echo "===================="
echo ""

if [ -z "$SESSION_ID" ]; then
    echo -e "${YELLOW}Mostrando últimas 5 orders...${NC}"
    echo ""
    echo "SELECT id, user_id, product_id, amount, status, stripe_checkout_session_id, created_at FROM orders ORDER BY created_at DESC LIMIT 5;"
else
    echo -e "${YELLOW}Buscando orders com sessionId: $SESSION_ID${NC}"
    echo ""
    echo "SELECT * FROM orders WHERE stripe_checkout_session_id = '$SESSION_ID';"
fi

echo ""
echo -e "${YELLOW}Para executar no banco:${NC}"
echo "1. Acesse: https://console.neon.tech/"
echo "2. Selecione seu projeto"
echo "3. Vá em 'SQL Editor'"
echo "4. Execute a query acima"
echo ""
echo -e "${GREEN}Ou use Drizzle Studio:${NC}"
echo "npm run db:studio"
echo ""
