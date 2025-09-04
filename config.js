// Debug: Check if window.ENV is loaded
if (typeof window !== 'undefined') {
    console.log('window.ENV available:', !!window.ENV);
    if (window.ENV) {
        console.log('Environment variables loaded:', Object.keys(window.ENV));
    }
}

// Configuration - hardcoded values except sensitive API keys
const CONFIG = {
    // Groq AI Configuration - only API key from env
    GROQ_API_KEY: getEnvVar('GROQ_API_KEY'),
    GROQ_API_URL: 'https://api.groq.com/openai/v1/chat/completions',
    GROQ_MODEL: 'llama-3.1-8b-instant',
    
    // Firebase Configuration - only API key from env
    FIREBASE_CONFIG: {
        apiKey: getEnvVar('FIREBASE_API_KEY'),
        authDomain: 'anonshare-platform.firebaseapp.com',
        projectId: 'anonshare-platform',
        storageBucket: 'anonshare-platform.appspot.com',
        messagingSenderId: '123456789012',
        appId: '1:123456789012:web:abcdef1234567890'
    },
    
    // Midnight Network Configuration - hardcoded
    MIDNIGHT_NETWORK_URL: 'https://testnet.midnight.network',
    MIDNIGHT_API_KEY: 'demo-midnight-key'
};

function getEnvVar(key, defaultValue = null) {
    // Check if env-inject.js loaded the variables
    if (typeof window !== 'undefined' && window.ENV && window.ENV[key]) {
        return window.ENV[key];
    }
    
    // Check if running in Node.js environment
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return process.env[key];
    }
    
    // Only show warning if no default value provided
    if (defaultValue === null) {
        console.warn(`Environment variable ${key} not found. Please check your .env file.`);
    }
    
    return defaultValue;
}
