/* =========================================
   KƏLAM PLATFORMASI - ÇAT ƏLAVƏ FUNKSİYALARI
   Fayl: js/chat.js
   ========================================= */

// Bu fayl chat.html tərəfindən istifadə olunur
// Firebase konfiqurasiyasını yoxlamaq və çat funksiyalarını genişləndirmək üçün

// ===== FIREBASE KONFİQURASİYASINI YOXLA =====
function getFirebaseConfig() {
    const configStr = localStorage.getItem('kəlam_firebase_config');
    
    if (!configStr) {
        console.warn('Firebase konfiqurasiyası tapılmadı.');
        return null;
    }
    
    try {
        return JSON.parse(configStr);
    } catch (e) {
        console.error('Firebase konfiqurasiyası yanlış formatdadır:', e);
        return null;
    }
}

// ===== FIREBASE-I İNİCİALİZASİYA ET =====
async function initializeFirebaseForChat() {
    const config = getFirebaseConfig();
    
    if (!config) {
        return { success: false, error: 'Konfiqurasiya tapılmadı' };
    }
    
    try {
        // Əgər artıq inicializə edilibsə
        if (firebase.apps.length > 0) {
            return { success: true, app: firebase.apps[0] };
        }
        
        const app = firebase.initializeApp(config);
        const db = firebase.firestore();
        
        return { success: true, app, db };
    } catch (e) {
        console.error('Firebase inicializasiya xətası:', e);
        return { success: false, error: e.message };
    }
}

// ===== ONLAYN İSTİFADƏÇİLƏRİ İZLƏ =====
class OnlineUsersTracker {
    constructor(firestore, userId, userName) {
        this.db = firestore;
        this.userId = userId;
        this.userName = userName;
        this.userRef = null;
    }
    
    async join() {
        if (!this.db) return;
        
        this.userRef = this.db.collection('online_users').doc(this.userId);
        
        try {
            await this.userRef.set({
                name: this.userName,
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
                isOnline: true
            });
            
            // Səhifə bağlananda avtomatik sil
            window.addEventListener('beforeunload', () => this.leave());
            
            return true;
        } catch (e) {
            console.error('Onlayn istifadəçi əlavə edilə bilmədi:', e);
            return false;
        }
    }
    
    async leave() {
        if (this.userRef) {
            try {
                await this.userRef.update({
                    isOnline: false,
                    lastSeen: firebase.firestore.FieldValue.serverTimestamp()
                });
            } catch (e) {
                await this.userRef.delete();
            }
        }
    }
    
    listenToOnlineUsers(callback) {
        if (!this.db) return () => {};
        
        return this.db.collection('online_users')
            .where('isOnline', '==', true)
            .onSnapshot((snapshot) => {
                const users = [];
                snapshot.forEach(doc => {
                    users.push({ id: doc.id, ...doc.data() });
                });
                callback(users);
            });
    }
}

// ===== MESAJ REAKSİYALARI =====
async function addReaction(messageId, userId, reaction) {
    const config = getFirebaseConfig();
    if (!config) return false;
    
    try {
        const db = firebase.firestore();
        const reactionRef = db.collection('chat_messages').doc(messageId).collection('reactions').doc(userId);
        
        await reactionRef.set({
            reaction: reaction,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        return true;
    } catch (e) {
        console.error('Reaksiya əlavə edilə bilmədi:', e);
        return false;
    }
}

// ===== MESAJ SİL (YALNIZ ÖZ MESAJLARINI) =====
async function deleteMessage(messageId, userId) {
    const config = getFirebaseConfig();
    if (!config) return false;
    
    try {
        const db = firebase.firestore();
        const messageRef = db.collection('chat_messages').doc(messageId);
        const doc = await messageRef.get();
        
        if (doc.exists && doc.data().userId === userId) {
            await messageRef.delete();
            return true;
        }
        
        return false;
    } catch (e) {
        console.error('Mesaj silinə bilmədi:', e);
        return false;
    }
}

// ===== BİLDİRİŞ GÖNDƏR =====
function sendNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💬</text></svg>'
        });
    }
}

// ===== MESAJ SƏSİ =====
let audioContext = null;

function playMessageSound() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Səs çalına bilmədi - problem deyil
    }
}

// ===== MESAJ FORMATLAMASI =====
function formatMessage(text) {
    // Linkləri aşkarla
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    text = text.replace(urlRegex, '<a href="$1" target="_blank" style="color: inherit; text-decoration: underline;">$1</a>');
    
    // İncil ayəsinə keçid formatı: [Matta 5:3]
    const verseRegex = /\[([^\]]+)\]/g;
    text = text.replace(verseRegex, '<span style="color: #D4AF37; cursor: pointer;" onclick="window.openVerse(\'$1\')">$1</span>');
    
    return text;
}

// ===== AYƏ AÇ =====
window.openVerse = function(reference) {
    // Format: "Matta 5:3" -> reader.html-ə keçid
    const parts = reference.split(' ');
    if (parts.length >= 2) {
        const book = parts.slice(0, -1).join(' ');
        const chapterVerse = parts[parts.length - 1].split(':');
        const chapter = chapterVerse[0];
        const verse = chapterVerse[1] || '1';
        
        // Kitab ID-sini tap
        const bookInfo = BibleEngine?.getAllBooks()?.find(b => b.name === book);
        if (bookInfo) {
            window.location.href = `reader.html?type=bible&book=${bookInfo.id}&chapter=${chapter}&verse=${verse}`;
        }
    }
};

// ===== ÇAT STATİSTİKASI =====
async function getChatStats() {
    const config = getFirebaseConfig();
    if (!config) return null;
    
    try {
        const db = firebase.firestore();
        const messagesSnapshot = await db.collection('chat_messages').count().get();
        
        return {
            totalMessages: messagesSnapshot.data().count,
            activeUsers: 0 // Real say üçün online_users kolleksiyasına baxmaq lazımdır
        };
    } catch (e) {
        console.error('Statistika alına bilmədi:', e);
        return null;
    }
}

// ===== ÇIXIŞ =====
function logoutFromChat() {
    sessionStorage.removeItem('kəlam_chat_user');
    window.location.reload();
}

// Qlobal obyekt
window.ChatUtils = {
    getFirebaseConfig,
    initializeFirebaseForChat,
    OnlineUsersTracker,
    addReaction,
    deleteMessage,
    sendNotification,
    playMessageSound,
    formatMessage,
    getChatStats,
    logoutFromChat
};

console.log('✅ chat.js yükləndi');