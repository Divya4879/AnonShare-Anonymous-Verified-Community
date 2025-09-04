// Configuration - secure, loads from .env or uses real values
const CONFIG = {
    // Groq AI Configuration - Replace with your actual API key
    GROQ_API_KEY: 'your_groq_api_key_here',
    GROQ_API_URL: 'https://api.groq.com/openai/v1/chat/completions',
    GROQ_MODEL: 'llama-3.3-70b-versatile',
    
    // Firebase Configuration
    FIREBASE_ENABLED: true,
    FIREBASE_CONFIG: {
        apiKey: 'AIzaSyBvOkBjWi40VpYXRhieWn-wdVxGSfXpgdg',
        authDomain: 'anonshare-platform.firebaseapp.com',
        projectId: 'anonshare-platform',
        storageBucket: 'anonshare-platform.appspot.com',
        messagingSenderId: '123456789012',
        appId: '1:123456789012:web:abcdef1234567890'
    },
    
    // Midnight Network Configuration
    MIDNIGHT_NETWORK_URL: 'https://testnet.midnight.network',
    MIDNIGHT_API_KEY: 'demo-midnight-key'
};
