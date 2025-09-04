#!/bin/bash
cat > env-inject.js << EOF
window.ENV = {
  GROQ_API_KEY: "${GROQ_API_KEY}",
  FIREBASE_API_KEY: "${FIREBASE_API_KEY}"
};
EOF
