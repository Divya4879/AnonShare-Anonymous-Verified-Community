// Configuration - loads from environment variables only
const CONFIG = {
    // Groq AI Configuration
    GROQ_API_KEY: getEnvVar('GROQ_API_KEY'),
    GROQ_API_URL: getEnvVar('GROQ_API_URL', 'https://api.groq.com/openai/v1/chat/completions'),
    GROQ_MODEL: getEnvVar('GROQ_MODEL', 'llama-3.1-8b-instant'),
    
    // Firebase Configuration
    FIREBASE_CONFIG: {
        apiKey: getEnvVar('FIREBASE_API_KEY'),
        authDomain: getEnvVar('FIREBASE_AUTH_DOMAIN'),
        projectId: getEnvVar('FIREBASE_PROJECT_ID'),
        storageBucket: getEnvVar('FIREBASE_STORAGE_BUCKET'),
        messagingSenderId: getEnvVar('FIREBASE_MESSAGING_SENDER_ID'),
        appId: getEnvVar('FIREBASE_APP_ID')
    },
    
    // Midnight Network Configuration
    MIDNIGHT_NETWORK_URL: getEnvVar('MIDNIGHT_NETWORK_URL', 'https://testnet.midnight.network'),
    MIDNIGHT_API_KEY: getEnvVar('MIDNIGHT_API_KEY', 'demo-midnight-key')
};

function getEnvVar(key, defaultValue = null) {
    if (typeof window !== 'undefined' && window.ENV && window.ENV[key]) {
        return window.ENV[key];
    }
    console.warn(`Environment variable ${key} not found. Please check your .env file.`);
    return defaultValue;
}
