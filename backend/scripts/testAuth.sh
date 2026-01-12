#!/bin/bash

# Test Script for Authentication Endpoints
# Make executable: chmod +x scripts/testAuth.sh
# Run: ./scripts/testAuth.sh

BASE_URL="http://localhost:5000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🧪 Testing Authentication System${NC}\n"

# Test 1: Health Check
echo -e "${YELLOW}1. Testing Health Check...${NC}"
HEALTH=$(curl -s "$BASE_URL/health")
if [[ $HEALTH == *"success"* ]]; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
    echo $HEALTH
    exit 1
fi

# Test 2: Signup
echo -e "\n${YELLOW}2. Testing User Signup...${NC}"
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser'$(date +%s)'",
    "email": "test'$(date +%s)'@example.com",
    "password": "password123"
  }')

if [[ $SIGNUP_RESPONSE == *"token"* ]]; then
    echo -e "${GREEN}✅ Signup successful${NC}"
    TOKEN=$(echo $SIGNUP_RESPONSE | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
    echo -e "${GREEN}   Token extracted: ${TOKEN:0:20}...${NC}"
else
    echo -e "${RED}❌ Signup failed${NC}"
    echo $SIGNUP_RESPONSE
    exit 1
fi

# Test 3: Login
echo -e "\n${YELLOW}3. Testing User Login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "test'$(date +%s -d "1 minute ago")'@example.com",
    "password": "password123"
  }')

if [[ $LOGIN_RESPONSE == *"token"* ]]; then
    echo -e "${GREEN}✅ Login successful${NC}"
else
    echo -e "${RED}❌ Login failed (this might be expected if user doesn't exist)${NC}"
fi

# Test 4: Protected Route
echo -e "\n${YELLOW}4. Testing Protected Route (GET /api/auth/me)...${NC}"
if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ No token available for testing${NC}"
else
    ME_RESPONSE=$(curl -s -X GET "$BASE_URL/api/auth/me" \
      -H "Authorization: Bearer $TOKEN")
    
    if [[ $ME_RESPONSE == *"username"* ]]; then
        echo -e "${GREEN}✅ Protected route access successful${NC}"
    else
        echo -e "${RED}❌ Protected route access failed${NC}"
        echo $ME_RESPONSE
    fi
fi

# Test 5: Protected Route Without Token
echo -e "\n${YELLOW}5. Testing Protected Route Without Token...${NC}"
NO_TOKEN_RESPONSE=$(curl -s -X GET "$BASE_URL/api/auth/me")
if [[ $NO_TOKEN_RESPONSE == *"Unauthorized"* ]] || [[ $NO_TOKEN_RESPONSE == *"authorized"* ]]; then
    echo -e "${GREEN}✅ Correctly rejected request without token${NC}"
else
    echo -e "${RED}❌ Should have rejected request${NC}"
    echo $NO_TOKEN_RESPONSE
fi

echo -e "\n${GREEN}🎉 Testing complete!${NC}"

