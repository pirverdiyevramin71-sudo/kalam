/* =========================================
   KƏLAM PLATFORMASI - YADDAŞ SİSTEMİ
   Fayl: js/storage.js
   ========================================= */

// ---------- YADDAŞ AÇARLARI ----------
const STORAGE_KEYS = {
    READING_PROGRESS: 'kəlam_reading_progress',  // Oxuma irəliləyişi
    NOTES: 'kəlam_notes',                        // Ayə qeydləri
    BOOKMARKS: 'kəlam_bookmarks',                // Sevimli ayələr
    HIGHLIGHTS: 'kəlam_highlights',              // Rəngli vurğular
    SETTINGS: 'kəlam_settings',                  // İstifadəçi parametrləri
    DAILY_VERSE: 'kəlam_daily_verse',            // Günün sözü (cache)
    HISTORY: 'kəlam_history'                     // Oxuma tarixçəsi
};

// =============================================
// 1. OXUMA İRƏLİLƏYİŞİ (DAVAM ET)
// =============================================

/**
 * İstifadəçinin qaldığı yeri yadda saxla
 * @param {string} bookType - "bible" və ya "custom"
 * @param {string} bookId - Kitabın ID-si (məs: "GEN", "enokh")
 * @param {number} chapter - Fəsil
 * @param {number} verse - Ayə
 */
function saveReadingProgress(bookType, bookId, chapter, verse) {
    const progress = getAllReadingProgress();
    const key = `${bookType}_${bookId}`;
    
    progress[key] = {
        bookType: bookType,
        bookId: bookId,
        chapter: chapter,
        verse: verse,
        timestamp: Date.now(),
        lastRead: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.READING_PROGRESS, JSON.stringify(progress));
    
    // Tarixçəyə də əlavə et
    addToHistory(bookType, bookId, chapter, verse);
    
    console.log(`✅ Yadda saxlandı: ${bookId} ${chapter}:${verse}`);
}

/**
 * Bütün kitablar üzrə oxuma irəliləyişini al
 */
function getAllReadingProgress() {
    const data = localStorage.getItem(STORAGE_KEYS.READING_PROGRESS);
    return data ? JSON.parse(data) : {};
}

/**
 * Müəyyən bir kitab üçün qaldığı yeri al
 */
function getReadingProgress(bookType, bookId) {
    const progress = getAllReadingProgress();
    const key = `${bookType}_${bookId}`;
    return progress[key] || null;
}

/**
 * "Davam Et" üçün bütün aktiv kitabları al
 * (Son 30 gün ərzində oxunanlar)
 */
function getContinueReadingList() {
    const progress = getAllReadingProgress();
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    return Object.values(progress)
        .filter(item => item.timestamp > thirtyDaysAgo)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10); // Maksimum 10 kitab
}

// =============================================
// 2. QEYDLƏR SİSTEMİ
// =============================================

/**
 * Ayə üçün qeyd əlavə et / yenilə
 */
function saveNote(bookType, bookId, chapter, verse, noteText) {
    const notes = getAllNotes();
    const key = `${bookType}_${bookId}_${chapter}_${verse}`;
    
    if (noteText && noteText.trim() !== '') {
        notes[key] = {
            bookType: bookType,
            bookId: bookId,
            chapter: chapter,
            verse: verse,
            text: noteText.trim(),
            updated: Date.now()
        };
    } else {
        // Boş qeydi sil
        delete notes[key];
    }
    
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    return true;
}

/**
 * Bütün qeydləri al
 */
function getAllNotes() {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    return data ? JSON.parse(data) : {};
}

/**
 * Müəyyən ayə üçün qeydi al
 */
function getNote(bookType, bookId, chapter, verse) {
    const notes = getAllNotes();
    const key = `${bookType}_${bookId}_${chapter}_${verse}`;
    return notes[key] || null;
}

/**
 * Müəyyən kitab/fəsil üçün bütün qeydləri al
 */
function getNotesForChapter(bookType, bookId, chapter) {
    const notes = getAllNotes();
    const prefix = `${bookType}_${bookId}_${chapter}_`;
    
    return Object.entries(notes)
        .filter(([key]) => key.startsWith(prefix))
        .map(([_, note]) => note)
        .sort((a, b) => a.verse - b.verse);
}

/**
 * Qeydi sil
 */
function deleteNote(bookType, bookId, chapter, verse) {
    return saveNote(bookType, bookId, chapter, verse, '');
}

// =============================================
// 3. SEVİMLİLƏR / ƏLFİCİNLƏR
// =============================================

/**
 * Ayəni sevimlilərə əlavə et / çıxar
 */
function toggleBookmark(bookType, bookId, chapter, verse, verseText = '') {
    const bookmarks = getAllBookmarks();
    const key = `${bookType}_${bookId}_${chapter}_${verse}`;
    
    if (bookmarks[key]) {
        delete bookmarks[key];
        const result = false; // Çıxarıldı
    } else {
        bookmarks[key] = {
            bookType: bookType,
            bookId: bookId,
            chapter: chapter,
            verse: verse,
            text: verseText.substring(0, 100),
            added: Date.now()
        };
        const result = true; // Əlavə edildi
    }
    
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    return !bookmarks[key]; // true = əlavə edildi, false = çıxarıldı
}

/**
 * Ayənin sevimlilərdə olub-olmadığını yoxla
 */
function isBookmarked(bookType, bookId, chapter, verse) {
    const bookmarks = getAllBookmarks();
    const key = `${bookType}_${bookId}_${chapter}_${verse}`;
    return !!bookmarks[key];
}

/**
 * Bütün sevimliləri al
 */
function getAllBookmarks() {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : {};
}

/**
 * Sevimliləri siyahı şəklində al
 */
function getBookmarksList() {
    const bookmarks = getAllBookmarks();
    return Object.values(bookmarks)
        .sort((a, b) => b.added - a.added);
}

// =============================================
// 4. RƏNGLİ VURĞULAR (HIGHLIGHTS)
// =============================================

/**
 * Ayəni rənglə vurğula
 */
function saveHighlight(bookType, bookId, chapter, verse, color = '#D4AF37') {
    const highlights = getAllHighlights();
    const key = `${bookType}_${bookId}_${chapter}_${verse}`;
    
    highlights[key] = {
        bookType: bookType,
        bookId: bookId,
        chapter: chapter,
        verse: verse,
        color: color,
        timestamp: Date.now()
    };
    
    localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights));
}

/**
 * Vurğunu sil
 */
function removeHighlight(bookType, bookId, chapter, verse) {
    const highlights = getAllHighlights();
    const key = `${bookType}_${bookId}_${chapter}_${verse}`;
    delete highlights[key];
    localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights));
}

/**
 * Ayənin vurğu rəngini al
 */
function getHighlight(bookType, bookId, chapter, verse) {
    const highlights = getAllHighlights();
    const key = `${bookType}_${bookId}_${chapter}_${verse}`;
    return highlights[key] || null;
}

/**
 * Bütün vurğuları al
 */
function getAllHighlights() {
    const data = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
    return data ? JSON.parse(data) : {};
}

// =============================================
// 5. İSTİFADƏÇİ PARAMETRLƏRİ
// =============================================

/**
 * Parametrləri yadda saxla
 */
function saveSettings(settings) {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
}

/**
 * Parametrləri al
 */
function getSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const defaults = {
        fontSize: 'medium',        // small, medium, large
        fontFamily: 'default',     // default, serif, sans
        theme: 'light',            // light, dark, oled
        language: 'az',            // az, ru, en
        autoSaveProgress: true,    // Avtomatik yaddaş
        voiceSpeed: 1.0,           // Səs sürəti
        showVerseNumbers: true,    // Ayə nömrələrini göstər
        lineSpacing: 'normal'      // compact, normal, spacious
    };
    
    return data ? { ...defaults, ...JSON.parse(data) } : defaults;
}

/**
 * Tək bir parametri al
 */
function getSetting(key) {
    const settings = getSettings();
    return settings[key];
}

// =============================================
// 6. OXUMA TARİXÇƏSİ
// =============================================

/**
 * Tarixçəyə əlavə et
 */
function addToHistory(bookType, bookId, chapter, verse) {
    const history = getHistory();
    
    history.unshift({
        bookType: bookType,
        bookId: bookId,
        chapter: chapter,
        verse: verse,
        timestamp: Date.now()
    });
    
    // Maksimum 100 qeyd saxla
    const trimmed = history.slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
}

/**
 * Tarixçəni al
 */
function getHistory() {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
}

// =============================================
// 7. GÜNÜN SÖZÜ (CACHE)
// =============================================

/**
 * Günün sözünü cache-ə yaz
 */
function cacheDailyVerse(verse) {
    const cache = {
        verse: verse,
        date: new Date().toDateString(),
        timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.DAILY_VERSE, JSON.stringify(cache));
}

/**
 * Cache-dən günün sözünü al
 */
function getCachedDailyVerse() {
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_VERSE);
    if (!data) return null;
    
    const cache = JSON.parse(data);
    const today = new Date().toDateString();
    
    // Əgər bu gün üçündürsə qaytar
    if (cache.date === today) {
        return cache.verse;
    }
    
    return null;
}

// =============================================
// 8. BÜTÜN MƏLUMATLARI İXRAC/İDXAL
// =============================================

/**
 * Bütün məlumatları JSON olaraq ixrac et
 */
function exportAllData() {
    const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        readingProgress: getAllReadingProgress(),
        notes: getAllNotes(),
        bookmarks: getAllBookmarks(),
        highlights: getAllHighlights(),
        settings: getSettings(),
        history: getHistory()
    };
    
    return JSON.stringify(data, null, 2);
}

/**
 * JSON məlumatlarını idxal et
 */
function importAllData(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        
        if (data.readingProgress) {
            localStorage.setItem(STORAGE_KEYS.READING_PROGRESS, JSON.stringify(data.readingProgress));
        }
        if (data.notes) {
            localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(data.notes));
        }
        if (data.bookmarks) {
            localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(data.bookmarks));
        }
        if (data.highlights) {
            localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(data.highlights));
        }
        if (data.settings) {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
        }
        if (data.history) {
            localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(data.history));
        }
        
        return true;
    } catch (e) {
        console.error('İdxal xətası:', e);
        return false;
    }
}

/**
 * Bütün məlumatları təmizlə (Sıfırla)
 */
function clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
}

// =============================================
// 9. KÖMƏKÇİ FUNKSİYALAR
// =============================================

/**
 * Statistik məlumatları al
 */
function getStatistics() {
    const progress = getAllReadingProgress();
    const notes = getAllNotes();
    const bookmarks = getAllBookmarks();
    const highlights = getAllHighlights();
    
    return {
        booksInProgress: Object.keys(progress).length,
        totalNotes: Object.keys(notes).length,
        totalBookmarks: Object.keys(bookmarks).length,
        totalHighlights: Object.keys(highlights).length,
        lastRead: getHistory()[0] || null
    };
}

/**
 * Yaddaş istifadəsini hesabla (KB ilə)
 */
function getStorageUsage() {
    let total = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
        const data = localStorage.getItem(key);
        if (data) total += data.length * 2; // UTF-16 təqribi
    });
    return Math.round(total / 1024);
}

// Konsola məlumat
console.log(`✅ Kəlam Storage Sistemi aktivdir. İstifadə: ${getStorageUsage()} KB`);