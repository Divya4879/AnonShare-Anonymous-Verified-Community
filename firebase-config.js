// Firebase Configuration
let db = null;

function initializeFirebase() {
    if (typeof firebase !== 'undefined') {
        try {
            const firebaseConfig = CONFIG.FIREBASE_CONFIG;
            
            if (!firebaseConfig.apiKey || firebaseConfig.apiKey === '') {
                console.log('Firebase config not available - using demo mode');
                return false;
            }
            
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            console.log('Firebase initialized successfully');
            return true;
        } catch (error) {
            console.error('Firebase initialization failed:', error);
            return false;
        }
    }
    
    console.log('Firebase SDK not loaded');
    return false;
}

const DEMO_POSTS = [
    {
        id: 'demo1',
        author: 'Verified Student',
        organization: 'Harvard University',
        role: 'Student',
        content: 'Incredible learning environment with world-class professors and cutting-edge research opportunities. The computer science program here is absolutely phenomenal!',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        score: 9,
        likes: 24,
        likedBy: ['user1', 'user2', 'user3'],
        replies: []
    },
    {
        id: 'demo2', 
        author: 'Verified Employee',
        organization: 'Google',
        role: 'Employee',
        content: 'Amazing innovation culture and incredible growth opportunities. Working on cutting-edge AI projects with brilliant minds from around the world!',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        score: 10,
        likes: 18,
        likedBy: ['user4', 'user5'],
        replies: []
    }
];

const StorageManager = {
    async loadPosts() {
        if (!db) return DEMO_POSTS;
        
        try {
            const snapshot = await db.collection('posts').orderBy('timestamp', 'desc').get();
            
            if (snapshot.empty) {
                // First time - save demo posts to Firebase
                for (const post of DEMO_POSTS) {
                    await db.collection('posts').doc(post.id).set(post);
                }
                return DEMO_POSTS;
            }
            
            return snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data(),
                likedBy: doc.data().likedBy || [],
                replies: doc.data().replies || [],
                likes: doc.data().likes || 0
            }));
        } catch (error) {
            console.error('Firebase load error:', error);
            return DEMO_POSTS;
        }
    },

    async savePost(post) {
        if (!db) return false;
        try {
            const docRef = await db.collection('posts').add(post);
            return { id: docRef.id, ...post };
        } catch (error) {
            console.error('Error saving post:', error);
            return false;
        }
    }
};
