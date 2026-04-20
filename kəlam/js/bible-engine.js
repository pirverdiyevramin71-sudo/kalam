/* =========================================
   KƏLAM PLATFORMASI - İNCİL MÜHƏRRİKİ
   Fayl: js/bible-engine.js
   ========================================= */

// ---------- İNCİL KİTABLARI SİYAHISI ----------
const BIBLE_BOOKS = {
    old_testament: [
        { id: "GEN", name: "Yaradılış", nameRu: "Бытие", nameEn: "Genesis", chapters: 50 },
        { id: "EXO", name: "Çıxış", nameRu: "Исход", nameEn: "Exodus", chapters: 40 },
        { id: "LEV", name: "Levililər", nameRu: "Левит", nameEn: "Leviticus", chapters: 27 },
        { id: "NUM", name: "Saylar", nameRu: "Числа", nameEn: "Numbers", chapters: 36 },
        { id: "DEU", name: "Qanunun Təkrarı", nameRu: "Второзаконие", nameEn: "Deuteronomy", chapters: 34 },
        { id: "JOS", name: "Yeşua", nameRu: "Иисус Навин", nameEn: "Joshua", chapters: 24 },
        { id: "JDG", name: "Hakimlər", nameRu: "Судей", nameEn: "Judges", chapters: 21 },
        { id: "RUT", name: "Rut", nameRu: "Руфь", nameEn: "Ruth", chapters: 4 },
        { id: "1SA", name: "1 Şamuel", nameRu: "1 Царств", nameEn: "1 Samuel", chapters: 31 },
        { id: "2SA", name: "2 Şamuel", nameRu: "2 Царств", nameEn: "2 Samuel", chapters: 24 },
        { id: "1KI", name: "1 Padşahlar", nameRu: "3 Царств", nameEn: "1 Kings", chapters: 22 },
        { id: "2KI", name: "2 Padşahlar", nameRu: "4 Царств", nameEn: "2 Kings", chapters: 25 },
        { id: "1CH", name: "1 Salnamələr", nameRu: "1 Паралипоменон", nameEn: "1 Chronicles", chapters: 29 },
        { id: "2CH", name: "2 Salnamələr", nameRu: "2 Паралипоменон", nameEn: "2 Chronicles", chapters: 36 },
        { id: "EZR", name: "Ezra", nameRu: "Ездра", nameEn: "Ezra", chapters: 10 },
        { id: "NEH", name: "Nehemya", nameRu: "Неемия", nameEn: "Nehemiah", chapters: 13 },
        { id: "EST", name: "Ester", nameRu: "Есфирь", nameEn: "Esther", chapters: 10 },
        { id: "JOB", name: "Əyyub", nameRu: "Иов", nameEn: "Job", chapters: 42 },
        { id: "PSA", name: "Zəbur", nameRu: "Псалтирь", nameEn: "Psalms", chapters: 150 },
        { id: "PRO", name: "Süleymanın Məsəlləri", nameRu: "Притчи", nameEn: "Proverbs", chapters: 31 },
        { id: "ECC", name: "Vaiz", nameRu: "Екклесиаст", nameEn: "Ecclesiastes", chapters: 12 },
        { id: "SNG", name: "Nəğmələr Nəğməsi", nameRu: "Песнь Песней", nameEn: "Song of Solomon", chapters: 8 },
        { id: "ISA", name: "Yeşaya", nameRu: "Исаия", nameEn: "Isaiah", chapters: 66 },
        { id: "JER", name: "Yeremya", nameRu: "Иеремия", nameEn: "Jeremiah", chapters: 52 },
        { id: "LAM", name: "Mərsiyələr", nameRu: "Плач Иеремии", nameEn: "Lamentations", chapters: 5 },
        { id: "EZK", name: "Yezekel", nameRu: "Иезекииль", nameEn: "Ezekiel", chapters: 48 },
        { id: "DAN", name: "Daniel", nameRu: "Даниил", nameEn: "Daniel", chapters: 12 },
        { id: "HOS", name: "Huşə", nameRu: "Осия", nameEn: "Hosea", chapters: 14 },
        { id: "JOL", name: "Yoel", nameRu: "Иоиль", nameEn: "Joel", chapters: 3 },
        { id: "AMO", name: "Amos", nameRu: "Амос", nameEn: "Amos", chapters: 9 },
        { id: "OBA", name: "Avdıya", nameRu: "Авдий", nameEn: "Obadiah", chapters: 1 },
        { id: "JON", name: "Yunus", nameRu: "Иона", nameEn: "Jonah", chapters: 4 },
        { id: "MIC", name: "Mikeya", nameRu: "Михей", nameEn: "Micah", chapters: 7 },
        { id: "NAH", name: "Nahum", nameRu: "Наум", nameEn: "Nahum", chapters: 3 },
        { id: "HAB", name: "Habaqquq", nameRu: "Аввакум", nameEn: "Habakkuk", chapters: 3 },
        { id: "ZEP", name: "Sefanya", nameRu: "Софония", nameEn: "Zephaniah", chapters: 3 },
        { id: "HAG", name: "Haqqay", nameRu: "Аггей", nameEn: "Haggai", chapters: 2 },
        { id: "ZEC", name: "Zəkəriyyə", nameRu: "Захария", nameEn: "Zechariah", chapters: 14 },
        { id: "MAL", name: "Malaki", nameRu: "Малахия", nameEn: "Malachi", chapters: 4 }
    ],
    new_testament: [
        { id: "MAT", name: "Matta", nameRu: "Матфей", nameEn: "Matthew", chapters: 28 },
        { id: "MRK", name: "Mark", nameRu: "Марк", nameEn: "Mark", chapters: 16 },
        { id: "LUK", name: "Luka", nameRu: "Лука", nameEn: "Luke", chapters: 24 },
        { id: "JHN", name: "Yəhya", nameRu: "Иоанн", nameEn: "John", chapters: 21 },
        { id: "ACT", name: "Həvarilərin İşləri", nameRu: "Деяния", nameEn: "Acts", chapters: 28 },
        { id: "ROM", name: "Romalılara", nameRu: "Римлянам", nameEn: "Romans", chapters: 16 },
        { id: "1CO", name: "1 Korinflilərə", nameRu: "1 Коринфянам", nameEn: "1 Corinthians", chapters: 16 },
        { id: "2CO", name: "2 Korinflilərə", nameRu: "2 Коринфянам", nameEn: "2 Corinthians", chapters: 13 },
        { id: "GAL", name: "Qalatiyalılara", nameRu: "Галатам", nameEn: "Galatians", chapters: 6 },
        { id: "EPH", name: "Efeslilərə", nameRu: "Ефесянам", nameEn: "Ephesians", chapters: 6 },
        { id: "PHP", name: "Filipililərə", nameRu: "Филиппийцам", nameEn: "Philippians", chapters: 4 },
        { id: "COL", name: "Kolosselilərə", nameRu: "Колоссянам", nameEn: "Colossians", chapters: 4 },
        { id: "1TH", name: "1 Saloniklilərə", nameRu: "1 Фессалоникийцам", nameEn: "1 Thessalonians", chapters: 5 },
        { id: "2TH", name: "2 Saloniklilərə", nameRu: "2 Фессалоникийцам", nameEn: "2 Thessalonians", chapters: 3 },
        { id: "1TI", name: "1 Timoteyə", nameRu: "1 Тимофею", nameEn: "1 Timothy", chapters: 6 },
        { id: "2TI", name: "2 Timoteyə", nameRu: "2 Тимофею", nameEn: "2 Timothy", chapters: 4 },
        { id: "TIT", name: "Titə", nameRu: "Титу", nameEn: "Titus", chapters: 3 },
        { id: "PHM", name: "Filimona", nameRu: "Филимону", nameEn: "Philemon", chapters: 1 },
        { id: "HEB", name: "İbranilərə", nameRu: "Евреям", nameEn: "Hebrews", chapters: 13 },
        { id: "JAS", name: "Yaqub", nameRu: "Иакова", nameEn: "James", chapters: 5 },
        { id: "1PE", name: "1 Peter", nameRu: "1 Петра", nameEn: "1 Peter", chapters: 5 },
        { id: "2PE", name: "2 Peter", nameRu: "2 Петра", nameEn: "2 Peter", chapters: 3 },
        { id: "1JN", name: "1 Yəhya", nameRu: "1 Иоанна", nameEn: "1 John", chapters: 5 },
        { id: "2JN", name: "2 Yəhya", nameRu: "2 Иоанна", nameEn: "2 John", chapters: 1 },
        { id: "3JN", name: "3 Yəhya", nameRu: "3 Иоанна", nameEn: "3 John", chapters: 1 },
        { id: "JUD", name: "Yəhuda", nameRu: "Иуды", nameEn: "Jude", chapters: 1 },
        { id: "REV", name: "Vəhy", nameRu: "Откровение", nameEn: "Revelation", chapters: 22 }
    ]
};

// ---------- İNCİL MƏLUMAT BAZASI (NÜMUNƏ) ----------
// Bu hissəni siz dolduracaqsınız
const bibleData = {
    az: {
        // Yaradılış 1:1-5 (Nümunə)
        "GEN": {
            "1": {
                "1": "Başlanğıcda Allah göyləri və yeri yaratdı.",
                "2": "Yer boş və quruluşsuz idi; dərinliklər üzərində qaranlıq var idi. Allahın Ruhu suların üzərində dolaşırdı.",
                "3": "Allah dedi: «Qoy işıq olsun». Və işıq oldu.",
                "4": "Allah gördü ki, işıq yaxşıdır. Və Allah işığı qaranlıqdan ayırdı.",
                "5": "Allah işığa «gündüz», qaranlığa isə «gecə» dedi. Axşam oldu, səhər oldu; bu, birinci gün idi."
            }
        },
        // Matta 5:3-5 (Nümunə)
        "MAT": {
            "5": {
                "3": "Nə bəxtiyardır ruhən yoxsullar! Çünki Səmavi Padşahlıq onlarındır.",
                "4": "Nə bəxtiyardır yaslı olanlar! Çünki onlar təsəlli tapacaqlar.",
                "5": "Nə bəxtiyardır həlimlər! Çünki onlar yer üzünü irs alacaqlar."
            }
        },
        // Zəbur 23:1-4 (Nümunə)
        "PSA": {
            "23": {
                "1": "Rəbb çobanımdır, heç nəyə ehtiyacım olmaz.",
                "2": "O məni otlaqlarda yatırır, sakit suların kənarına aparır.",
                "3": "O canımı təzələyir, Öz adı naminə məni salehlik yollarına yönəldir.",
                "4": "Ölüm kölgəsinin dərəsindən keçsəm də, şərdən qorxmaram, çünki Sən mənimləsən; Sənin dəyənəyin və əsan mənə təsəlli verir."
            }
        },
        // Yəhya 3:16 (Nümunə)
        "JHN": {
            "3": {
                "16": "Çünki Allah dünyanı o qədər sevdi ki, yeganə Oğlunu verdi; Ona iman edən hər kəs həlak olmasın, əbədi həyata qovuşsun."
            }
        }
    },
    ru: {},
    en: {}
};

// ---------- KİTAB MƏLUMATINI AL ----------
function getBookInfo(bookId) {
    for (const testament of Object.values(BIBLE_BOOKS)) {
        const book = testament.find(b => b.id === bookId);
        if (book) return book;
    }
    return null;
}

// ---------- KİTAB ADINI AL (DİLƏ GÖRƏ) ----------
function getBookName(bookId, lang = 'az') {
    const book = getBookInfo(bookId);
    if (!book) return bookId;
    
    switch(lang) {
        case 'ru': return book.nameRu;
        case 'en': return book.nameEn;
        default: return book.name;
    }
}

// ---------- BÜTÜN KİTABLARI AL ----------
function getAllBooks(testament = null) {
    if (testament === 'old') return BIBLE_BOOKS.old_testament;
    if (testament === 'new') return BIBLE_BOOKS.new_testament;
    return [...BIBLE_BOOKS.old_testament, ...BIBLE_BOOKS.new_testament];
}

// ---------- AYƏ MƏTNİNİ AL ----------
function getBibleVerse(bookId, chapter, verse, lang = 'az') {
    try {
        return bibleData[lang][bookId][chapter.toString()][verse.toString()] || null;
    } catch (e) {
        return null;
    }
}

// ---------- FƏSİLDƏKİ BÜTÜN AYƏLƏRİ AL ----------
function getBibleChapter(bookId, chapter, lang = 'az') {
    try {
        return bibleData[lang][bookId][chapter.toString()] || {};
    } catch (e) {
        return {};
    }
}

// ---------- İNCİLDA AXTARIŞ ----------
function searchBible(query, lang = 'az') {
    if (!query || query.length < 2) return [];
    
    const results = [];
    const lowerQuery = query.toLowerCase();
    const data = bibleData[lang];
    
    for (const [bookId, chapters] of Object.entries(data)) {
        const bookInfo = getBookInfo(bookId);
        if (!bookInfo) continue;
        
        for (const [chapNum, verses] of Object.entries(chapters)) {
            for (const [verseNum, text] of Object.entries(verses)) {
                if (text.toLowerCase().includes(lowerQuery)) {
                    results.push({
                        source: 'bible',
                        bookId: bookId,
                        bookName: bookInfo.name,
                        chapter: parseInt(chapNum),
                        verse: parseInt(verseNum),
                        text: text.substring(0, 150) + (text.length > 150 ? '...' : ''),
                        fullText: text,
                        reference: `${bookInfo.name} ${chapNum}:${verseNum}`
                    });
                }
            }
        }
    }
    
    return results;
}

// ---------- BÜTÜN MƏNBƏLƏRDƏ AXTARIŞ (İncil + Digər Kitablar) ----------
function searchAll(query, lang = 'az') {
    const bibleResults = searchBible(query, lang);
    const customResults = typeof searchInCustomBooks === 'function' ? searchInCustomBooks(query) : [];
    
    return [...bibleResults, ...customResults].sort((a, b) => {
        // Mətn uyğunluğuna görə sırala (dəqiq uyğunluq öndə)
        return a.text.length - b.text.length;
    });
}

// ---------- AYƏNİ FORMATLA (Matta 5:3) ----------
function formatVerseReference(bookId, chapter, verse, lang = 'az') {
    const bookName = getBookName(bookId, lang);
    return `${bookName} ${chapter}:${verse}`;
}

// ---------- NÖVBƏTİ FƏSİLİ AL ----------
function getNextChapter(bookId, currentChapter) {
    const book = getBookInfo(bookId);
    if (!book) return null;
    
    const nextChap = currentChapter + 1;
    if (nextChap <= book.chapters) {
        return { bookId, chapter: nextChap };
    }
    
    // Növbəti kitaba keç
    const allBooks = getAllBooks();
    const currentIndex = allBooks.findIndex(b => b.id === bookId);
    
    if (currentIndex < allBooks.length - 1) {
        return {
            bookId: allBooks[currentIndex + 1].id,
            chapter: 1
        };
    }
    
    return null; // Son kitab, son fəsil
}

// ---------- ƏVVƏLKİ FƏSİLİ AL ----------
function getPrevChapter(bookId, currentChapter) {
    const prevChap = currentChapter - 1;
    if (prevChap >= 1) {
        return { bookId, chapter: prevChap };
    }
    
    // Əvvəlki kitaba keç
    const allBooks = getAllBooks();
    const currentIndex = allBooks.findIndex(b => b.id === bookId);
    
    if (currentIndex > 0) {
        const prevBook = allBooks[currentIndex - 1];
        return {
            bookId: prevBook.id,
            chapter: prevBook.chapters
        };
    }
    
    return null; // İlk kitab, ilk fəsil
}

// ---------- GÜNÜN SÖZÜ (AVTOMATİK) ----------
function getDailyVerse() {
    // Cache-də varsa onu qaytar
    const cached = getCachedDailyVerse();
    if (cached) return cached;
    
    // Günə görə təyin et (sadə alqoritm)
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    // Məşhur ayələr siyahısı
    const popularVerses = [
        { ref: "Yəhya 3:16", book: "JHN", chapter: 3, verse: 16 },
        { ref: "Zəbur 23:1", book: "PSA", chapter: 23, verse: 1 },
        { ref: "Yeşaya 41:10", book: "ISA", chapter: 41, verse: 10 },
        { ref: "Yeremya 29:11", book: "JER", chapter: 29, verse: 11 },
        { ref: "Filipililərə 4:13", book: "PHP", chapter: 4, verse: 13 },
        { ref: "Romalılara 8:28", book: "ROM", chapter: 8, verse: 28 },
        { ref: "Yeşua 1:9", book: "JOS", chapter: 1, verse: 9 },
        { ref: "Süleymanın Məsəlləri 3:5", book: "PRO", chapter: 3, verse: 5 },
        { ref: "Matta 11:28", book: "MAT", chapter: 11, verse: 28 },
        { ref: "2 Korinflilərə 5:17", book: "2CO", chapter: 5, verse: 17 }
    ];
    
    const selected = popularVerses[dayOfYear % popularVerses.length];
    const verseText = getBibleVerse(selected.book, selected.chapter, selected.verse);
    
    const result = {
        reference: selected.ref,
        text: verseText || "Rəbb səninlədir. Qorxma!",
        bookId: selected.book,
        chapter: selected.chapter,
        verse: selected.verse
    };
    
    // Cache-ə yaz
    cacheDailyVerse(result);
    
    return result;
}

// ---------- DİLİ DƏYİŞ ----------
let currentLanguage = 'az';

function setLanguage(lang) {
    if (['az', 'ru', 'en'].includes(lang)) {
        currentLanguage = lang;
        saveSettings({ language: lang });
        return true;
    }
    return false;
}

function getLanguage() {
    return currentLanguage;
}

// ---------- İNİCİALİZASİYA ----------
function initBibleEngine() {
    // Parametrlərdən dili yüklə
    const settings = getSettings();
    currentLanguage = settings.language || 'az';
    
    console.log(`✅ İncil Mühərriki hazırdır. Dil: ${currentLanguage}`);
}

// Səhifə yüklənəndə işə sal
document.addEventListener('DOMContentLoaded', initBibleEngine);

// Qlobal obyekt
window.BibleEngine = {
    getBookInfo,
    getBookName,
    getAllBooks,
    getBibleVerse,
    getBibleChapter,
    searchBible,
    searchAll,
    formatVerseReference,
    getNextChapter,
    getPrevChapter,
    getDailyVerse,
    setLanguage,
    getLanguage
};

console.log('✅ bible-engine.js yükləndi');