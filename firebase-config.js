// Firebase Configuration
let db = null;

function initializeFirebase() {
    if (typeof firebase !== 'undefined') {
        try {
            const firebaseConfig = CONFIG.FIREBASE_CONFIG;
            
            // Validate config
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
        
        if (db) {
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
        if (db) {
            try {
                const docRef = await db.collection('posts').add(post);
                console.log('Post saved to Firebase:', docRef.id);
                return docRef.id;
            } catch (error) {
                console.error('Error saving post:', error);
                return false;
            }
        }
        return false;
    },

    async likePost(postId, userId) {
        if (db) {
            try {
                const postRef = db.collection('posts').doc(postId);
                const doc = await postRef.get();
                
                if (doc.exists) {
                    const data = doc.data();
                    const likedBy = data.likedBy || [];
                    const likes = data.likes || 0;
                    
                    if (likedBy.includes(userId)) {
                        await postRef.update({
                            likes: Math.max(0, likes - 1),
                            likedBy: likedBy.filter(id => id !== userId)
                        });
                        return false;
                    } else {
                        await postRef.update({
                            likes: likes + 1,
                            likedBy: [...likedBy, userId]
                        });
                        return true;
                    }
                }
            } catch (error) {
                console.error('Error updating like:', error);
            }
        }
        return null;
    },

    async addReply(postId, reply) {
        if (db) {
            try {
                const postRef = db.collection('posts').doc(postId);
                const doc = await postRef.get();
                
                if (doc.exists) {
                    const data = doc.data();
                    const replies = data.replies || [];
                    
                    await postRef.update({
                        replies: [...replies, reply]
                    });
                    return true;
                }
            } catch (error) {
                console.error('Error adding reply:', error);
            }
        }
        return false;
    }
};
