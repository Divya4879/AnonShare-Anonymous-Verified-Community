#!/bin/bash

# Deployment script for AnonShare platform
# Usage: ./deploy.sh [local|netlify]

set -e

DEPLOY_TYPE=${1:-local}

echo "🚀 Deploying AnonShare platform..."

# Load environment variables from .env file
if [ -f .env ]; then
    echo "📄 Loading environment variables from .env file..."
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  No .env file found, using default values"
fi

# Create environment injection script
create_env_injection() {
    cat > env-inject.js << EOF
// Environment variable injection for client-side
window.ENV = {
    GROQ_API_KEY: '${GROQ_API_KEY}',
    GROQ_API_URL: '${GROQ_API_URL:-https://api.groq.com/openai/v1/chat/completions}',
    GROQ_MODEL: '${GROQ_MODEL:-llama-3.1-8b-instant}',
    FIREBASE_API_KEY: '${FIREBASE_API_KEY}',
    FIREBASE_AUTH_DOMAIN: '${FIREBASE_AUTH_DOMAIN}',
    FIREBASE_PROJECT_ID: '${FIREBASE_PROJECT_ID}',
    FIREBASE_STORAGE_BUCKET: '${FIREBASE_STORAGE_BUCKET}',
    FIREBASE_MESSAGING_SENDER_ID: '${FIREBASE_MESSAGING_SENDER_ID}',
    FIREBASE_APP_ID: '${FIREBASE_APP_ID}',
    MIDNIGHT_NETWORK_URL: '${MIDNIGHT_NETWORK_URL:-https://testnet.midnight.network}',
    MIDNIGHT_API_KEY: '${MIDNIGHT_API_KEY:-demo-midnight-key}'
};
EOF
}

if [ "$DEPLOY_TYPE" = "local" ]; then
    echo "🏠 Local deployment..."
    
    # Create environment injection
    create_env_injection
    
    # Start local server
    echo "✅ Environment variables loaded"
    echo "🌐 Starting local server on http://localhost:8000"
    python3 -m http.server 8000
    
elif [ "$DEPLOY_TYPE" = "netlify" ]; then
    echo "☁️  Netlify deployment..."
    
    # Create environment injection
    create_env_injection
    
    # Deploy to Netlify
    echo "📦 Deploying to Netlify..."
    netlify deploy --prod --dir .
    
    # Clean up
    rm -f env-inject.js
    
    echo "✅ Deployed to Netlify successfully!"
    
else
    echo "❌ Invalid deployment type. Use 'local' or 'netlify'"
    exit 1
fi
