// Configuration - secure, no hardcoded keys
const CONFIG = {
    // Groq AI Configuration - keys loaded from .env or Netlify env vars
    GROQ_API_KEY: '', // Will be loaded dynamically
    GROQ_API_URL: 'https://api.groq.com/openai/v1/chat/completions',
    GROQ_MODEL: 'llama-3.3-70b-versatile',
    
    // Firebase Configuration - keys loaded from .env or Netlify env vars  
    FIREBASE_ENABLED: true,
    FIREBASE_CONFIG: {
        apiKey: '', // Will be loaded dynamically
        authDomain: '', // Will be loaded dynamically
        projectId: '', // Will be loaded dynamically
        storageBucket: '', // Will be loaded dynamically
        messagingSenderId: '', // Will be loaded dynamically
        appId: '' // Will be loaded dynamically
    },
    
    // Midnight Network Configuration
    MIDNIGHT_NETWORK_URL: 'https://testnet.midnight.network',
    MIDNIGHT_API_KEY: 'demo-midnight-key'
};

// Load configuration from .env file (for local development)
async function loadConfig() {
    try {
        // Try to load from .env file
        const response = await fetch('.env');
        if (response.ok) {
            const envText = await response.text();
            const env = {};
            
            envText.split('\n').forEach(line => {
                line = line.trim();
                if (line && !line.startsWith('#')) {
                    const [key, ...valueParts] = line.split('=');
                    env[key] = valueParts.join('=');
                }
            });
            
            // Update CONFIG with loaded values
            CONFIG.GROQ_API_KEY = env.GROQ_API_KEY || '';
            CONFIG.FIREBASE_CONFIG.apiKey = env.FIREBASE_API_KEY || '';
            CONFIG.FIREBASE_CONFIG.authDomain = env.FIREBASE_AUTH_DOMAIN || '';
            CONFIG.FIREBASE_CONFIG.projectId = env.FIREBASE_PROJECT_ID || '';
            CONFIG.FIREBASE_CONFIG.storageBucket = env.FIREBASE_STORAGE_BUCKET || '';
            CONFIG.FIREBASE_CONFIG.messagingSenderId = env.FIREBASE_MESSAGING_SENDER_ID || '';
            CONFIG.FIREBASE_CONFIG.appId = env.FIREBASE_APP_ID || '';
            
            console.log('✅ Configuration loaded from .env');
        }
    } catch (error) {
        console.warn('⚠️ Could not load .env, using Netlify environment or demo mode');
    }
}

// Auto-load config when script loads
loadConfig();
