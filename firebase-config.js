// Firebase Configuration
let db = null;

function initializeFirebase() {
    if (!CONFIG.FIREBASE_ENABLED) {
        console.log('Firebase disabled - using demo mode');
        return false;
    }
    
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(CONFIG.FIREBASE_CONFIG);
        db = firebase.firestore();
        console.log('Firebase initialized successfully');
        return true;
    }
    console.error('Firebase SDK not loaded');
    return false;
}

// Hardcoded demo posts - always show these with content
const DEMO_POSTS = [
    {
        id: 'demo1',
        author: 'Verified Student',
        organization: 'Harvard University',
        role: 'Student',
        content: 'Incredible learning environment with world-class professors and cutting-edge research opportunities. The computer science program here is absolutely phenomenal!',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        score: 9,
        likes: 24
    },
    {
        id: 'demo2', 
        author: 'Verified Employee',
        organization: 'Google',
        role: 'Employee',
        content: 'Amazing innovation culture and incredible growth opportunities. Working on cutting-edge AI projects with brilliant minds from around the world!',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        score: 10,
        likes: 18
    }
];

// Storage Manager - re-enable Firebase with demo posts
const StorageManager = {
    async loadPosts() {
        let userPosts = [];
        
        if (CONFIG.FIREBASE_ENABLED && db) {
            try {
                const snapshot = await db.collection('posts')
                    .orderBy('timestamp', 'desc')
                    .limit(50)
                    .get();
                
                userPosts = snapshot.docs.map(doc => ({ 
                    id: doc.id, 
                    ...doc.data() 
                }));
                
                console.log(`Loaded ${userPosts.length} user posts from Firebase`);
            } catch (error) {
                console.error('Firebase load error:', error);
            }
        }
        
        // Combine user posts with demo posts
        const allPosts = [...userPosts, ...DEMO_POSTS];
        
        // Sort by timestamp
        allPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        return allPosts;
    },

    async savePost(post) {
        if (CONFIG.FIREBASE_ENABLED && db) {
            try {
                const docRef = await db.collection('posts').add({
                    ...post,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log('Post saved to Firebase with ID:', docRef.id);
                return true;
            } catch (error) {
                console.error('Firebase save error:', error);
                return false;
            }
        }
        
        console.log('Firebase disabled - post not saved');
        return false;
    }
};
