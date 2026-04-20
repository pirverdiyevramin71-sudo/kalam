/* =========================================
   KƏLAM PLATFORMASI - ƏSAS TƏTBİQ
   Fayl: js/app.js
   ========================================= */

// ---------- DOM ELEMENTLƏRİ ----------
let searchOverlay, searchInput, searchResults, closeSearch, searchIcon;
let continueList, dailyVerseText, dailyVerseRef;
let customBooksGrid, bottomNavItems, mainContent;

// ---------- Cari Səhifə ----------
let currentPage = 'home';

// =============================================
// 1. SƏHİFƏ İNİCİALİZASİYASI
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // Elementləri seç
    searchOverlay = document.getElementById('searchOverlay');
    searchInput = document.getElementById('globalSearchInput');
    searchResults = document.getElementById('globalSearchResults');
    closeSearch = document.getElementById('closeSearch');
    searchIcon = document.getElementById('searchIcon');
    continueList = document.getElementById('continueList');
    dailyVerseText = document.getElementById('dailyVerseText');
    dailyVerseRef = document.getElementById('dailyVerseRef');
    customBooksGrid = document.getElementById('customBooksGrid');
    bottomNavItems = document.querySelectorAll('.nav-item');
    mainContent = document.getElementById('mainContent');
    
    // Başlanğıc funksiyaları işə sal
    initApp();
    loadContinueReading();
    loadDailyVerse();
    loadCustomBooks();
    setupEventListeners();
    
    console.log('✅ Kəlam Platforması hazırdır!');
});

// =============================================
// 2. EVENT LISTENERLƏR
// =============================================

function setupEventListeners() {
    // Axtarış ikonu klik
    if (searchIcon) {
        searchIcon.addEventListener('click', openSearch);
    }
    
    // Axtarışı bağla
    if (closeSearch) {
        closeSearch.addEventListener('click', closeSearchOverlay);
    }
    
    // Axtarış input
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Nəticələrə klik (delegasiya)
    if (searchResults) {
        searchResults.addEventListener('click', handleSearchResultClick);
    }
    
    // Alt menyu
    bottomNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            navigateTo(page);
        });
    });
    
    // Kateqoriya kartları
    document.querySelectorAll('.cat-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            if (category === 'old_testament' || category === 'new_testament') {
                // Kitablar siyahısına get (gələcək funksiya)
                alert(`${category} kitabları siyahısı açılacaq.`);
            }
        });
    });
    
    // ESC ilə axtarışı bağla
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('active')) {
            closeSearchOverlay();
        }
    });
}

// =============================================
// 3. AXTARIŞ FUNKSİYALARI
// =============================================

function openSearch() {
    if (searchOverlay) {
        searchOverlay.classList.add('active');
        searchInput.focus();
    }
}

function closeSearchOverlay() {
    if (searchOverlay) {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
    }
}

function handleSearch() {
    const query = searchInput.value.trim();
    
    if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
    }
    
    // Bütün mənbələrdə axtar
    const results = window.BibleEngine ? window.BibleEngine.searchAll(query) : [];
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: var(--text-secondary);">
                <i class="fas fa-search" style="font-size: 2rem; opacity: 0.3; margin-bottom: 16px;"></i>
                <p>"${query}" üzrə nəticə tapılmadı.</p>
            </div>
        `;
        return;
    }
    
    // Nəticələri göstər
    searchResults.innerHTML = results.map(result => {
        const icon = result.icon || 'fa-book';
        return `
            <div class="search-result-item" data-book-type="${result.source}" data-book-id="${result.bookId}" data-chapter="${result.chapter}" data-verse="${result.verse}">
                <div class="ref">
                    <i class="fas ${icon}" style="margin-right: 8px; font-size: 0.8rem;"></i>
                    ${result.reference || result.bookName + ' ' + result.chapter + ':' + result.verse}
                </div>
                <div class="text">${result.text}</div>
            </div>
        `;
    }).join('');
}

function handleSearchResultClick(e) {
    const item = e.target.closest('.search-result-item');
    if (!item) return;
    
    const bookType = item.dataset.bookType;
    const bookId = item.dataset.bookId;
    const chapter = item.dataset.chapter;
    const verse = item.dataset.verse;
    
    // Oxu səhifəsinə keçid
    if (bookType === 'bible') {
        window.location.href = `reader.html?type=bible&book=${bookId}&chapter=${chapter}&verse=${verse}`;
    } else {
        window.location.href = `reader.html?type=custom&book=${bookId}&chapter=${chapter}&verse=${verse}`;
    }
}

// =============================================
// 4. DAVAM ET FUNKSİYALARI
// =============================================

function loadContinueReading() {
    if (!continueList) return;
    
    const books = getContinueReadingList();
    
    if (books.length === 0) {
        continueList.innerHTML = `
            <div class="continue-card" style="opacity: 0.7; cursor: default;">
                <div class="book-icon">
                    <i class="fas fa-book-open"></i>
                </div>
                <h4>Hələ oxumamısınız</h4>
                <p>Kitab oxumağa başlayın, qaldığınız yer burada görünəcək.</p>
            </div>
        `;
        return;
    }
    
    continueList.innerHTML = books.map(book => {
        let bookName = book.bookId;
        let icon = 'fa-book';
        
        if (book.bookType === 'bible') {
            const info = window.BibleEngine ? window.BibleEngine.getBookInfo(book.bookId) : null;
            bookName = info ? info.name : book.bookId;
            icon = 'fa-bible';
        } else {
            const info = typeof getCustomBookInfo === 'function' ? getCustomBookInfo(book.bookId) : null;
            bookName = info ? info.nameAz : book.bookId;
            icon = info ? info.icon : 'fa-book';
        }
        
        return `
            <div class="continue-card" data-book-type="${book.bookType}" data-book-id="${book.bookId}" data-chapter="${book.chapter}" data-verse="${book.verse}">
                <div class="book-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <h4>${bookName}</h4>
                <p>Fəsil ${book.chapter}, Ayə ${book.verse}</p>
                <div class="progress">
                    <i class="far fa-clock"></i> Davam et →
                </div>
            </div>
        `;
    }).join('');
    
    // Kartlara klik əlavə et
    continueList.querySelectorAll('.continue-card').forEach(card => {
        card.addEventListener('click', () => {
            const bookType = card.dataset.bookType;
            const bookId = card.dataset.bookId;
            const chapter = card.dataset.chapter;
            const verse = card.dataset.verse;
            
            if (bookId) {
                window.location.href = `reader.html?type=${bookType}&book=${bookId}&chapter=${chapter}&verse=${verse}`;
            }
        });
    });
}

// =============================================
// 5. GÜNÜN SÖZÜ
// =============================================

function loadDailyVerse() {
    if (!dailyVerseText || !dailyVerseRef) return;
    
    const verse = window.BibleEngine ? window.BibleEngine.getDailyVerse() : null;
    
    if (verse) {
        dailyVerseText.textContent = verse.text;
        dailyVerseRef.textContent = verse.reference;
        
        // Kliklə oxu səhifəsinə get
        const card = document.querySelector('.daily-verse-card');
        if (card) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                window.location.href = `reader.html?type=bible&book=${verse.bookId}&chapter=${verse.chapter}&verse=${verse.verse}`;
            });
        }
    } else {
        dailyVerseText.textContent = "Rəbb səninlədir. Qorxma!";
        dailyVerseRef.textContent = "Yeşaya 41:10";
    }
}

// =============================================
// 6. DİGƏR KİTABLAR
// =============================================

function loadCustomBooks() {
    if (!customBooksGrid) return;
    
    // custom_books.js-dən gələn siyahı
    if (typeof customBooksList === 'undefined') {
        customBooksGrid.innerHTML = '<p style="grid-column: span 2; text-align: center; opacity: 0.6;">Kitablar yüklənir...</p>';
        return;
    }
    
    customBooksGrid.innerHTML = customBooksList.slice(0, 6).map(book => `
        <div class="cat-card" data-custom-book="${book.id}">
            <i class="fas ${book.icon}" style="color: ${book.color};"></i>
            <span>${book.nameAz}</span>
            <small style="display: block; font-size: 0.7rem; opacity: 0.6; margin-top: 4px;">${book.chapters} fəsil</small>
        </div>
    `).join('');
    
    // Klik hadisəsi
    customBooksGrid.querySelectorAll('.cat-card').forEach(card => {
        card.addEventListener('click', () => {
            const bookId = card.dataset.customBook;
            window.location.href = `reader.html?type=custom&book=${bookId}&chapter=1&verse=1`;
        });
    });
}

// =============================================
// 7. NAVİQASİYA
// =============================================

function navigateTo(page) {
    currentPage = page;
    
    // Aktiv sinfi yenilə
    bottomNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });
    
    switch(page) {
        case 'home':
            // Ana səhifədə qal
            break;
        case 'library':
            // Kitablar kitabxanası (gələcək)
            alert('Kitablar kitabxanası tezliklə əlavə olunacaq.');
            break;
        case 'chat':
            // Söhbət səhifəsi
            window.location.href = 'chat.html';
            break;
        case 'profile':
            // Profil səhifəsi
            alert('Profil səhifəsi tezliklə əlavə olunacaq.');
            break;
    }
}

// =============================================
// 8. KÖMƏKÇİ FUNKSİYALAR
// =============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function initApp() {
    // Tema parametrini yoxla
    const settings = getSettings();
    if (settings.theme === 'oled') {
        document.body.classList.add('dark-oled');
    }
    
    // İstifadəçini salamla (günə görə)
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) greeting = 'Sabahınız xeyir';
    else if (hour < 18) greeting = 'Günortanız xeyir';
    else greeting = 'Axşamınız xeyir';
    
    console.log(`🌿 ${greeting}! Kəlam platformasına xoş gəlmisiniz.`);
}

// =============================================
// 9. QLOBAL FUNKSİYALAR
// =============================================

window.Kəlam = {
    openSearch,
    closeSearchOverlay,
    navigateTo,
    refreshContinueReading: loadContinueReading,
    refreshDailyVerse: loadDailyVerse
};

console.log('✅ app.js yükləndi');