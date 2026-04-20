/* =========================================
   KƏLAM PLATFORMASI - DİGƏR KİTABLAR
   Fayl: data/custom_books.js
   ========================================= */

// ---------- KİTAB SİYAHISI ----------
// Bu siyahı Ana Səhifədə "Digər Kitablar" bölməsində görünəcək
const customBooksList = [
    {
        id: "enokh",
        name: "Book of Enokh",
        nameAz: "Enokh Kitabı",
        icon: "fa-scroll",
        color: "#8B6914",
        description: "Qədim Əhdi-Ətiq apokrifi",
        chapters: 108  // Ümumi fəsil sayı
    },
    {
        id: "jubilees",
        name: "Book of Jubilees",
        nameAz: "Yubileylər Kitabı",
        icon: "fa-calendar-alt",
        color: "#6B3A2A",
        description: "Kiçik Yaradılış",
        chapters: 50
    },
    {
        id: "thomas",
        name: "Gospel of Thomas",
        nameAz: "Tomas İncili",
        icon: "fa-dove",
        color: "#4A6B4A",
        description: "İsanın gizli kəlamları",
        chapters: 1  // Tək fəsil, 114 ayə
    },
    {
        id: "philip",
        name: "Gospel of Philip",
        nameAz: "Filip İncili",
        icon: "fa-book",
        color: "#6B4A6B",
        description: "Naq Hammadi kitabxanasından",
        chapters: 1
    },
    {
        id: "mary",
        name: "Gospel of Mary",
        nameAz: "Məryəm İncili",
        icon: "fa-female",
        color: "#8B4A6B",
        description: "Maqdalenalı Məryəmin incili",
        chapters: 1
    },
    {
        id: "judas",
        name: "Gospel of Judas",
        nameAz: "Yəhuda İncili",
        icon: "fa-hands",
        color: "#4A4A6B",
        description: "Yəhuda İskaryotun nəqli",
        chapters: 1
    }
];

// ---------- KİTAB MƏTNLƏRİ ----------
// Bu obyektə kitabların faktiki mətnlərini əlavə edin
// Format: customBooksData["kitab_id"]["fəsil_nömrəsi"]["ayə_nömrəsi"] = "mətn"
const customBooksData = {
    // ENOKH KİTABI (Nümunə - İlk 2 fəsil)
    "enokh": {
        "1": {
            "1": "Enokhun xeyir-dua sözləri. O, seçilmişlərə və salehlərə xeyir-dua verdi. Onlar qəm-qüssə günündə, bütün günahkarlar və pis adamlar məhv ediləndə sağ qalacaqlar.",
            "2": "Enokh dedi: «Gözləri açılmış saleh bir adam kimi danışıram. Mən Müqəddəs Olanın ağzından bir görüntü gördüm. Göylərin sirlərini göstərdi mənə...»",
            "3": "Hər şeyi bilən Böyük Allahın sözləri bunlardır. Mən dünyanın sonuna qədər bütün nəsillərə danışacağam.",
            "4": "Müqəddəs dağdan çıxanda gördüm ki, Rəbb Öz izzəti ilə gəlir. Onun ayaqları altında şimşəklər çaxır.",
            "5": "Bütün insanlar qorxacaq, dağlar titrəyəcək, təpələr yerlə bir olacaq. Lakin salehlərlə əhd bağlanacaq."
        },
        "2": {
            "1": "Göylərin bütün işlərinə baxın: onlar öz yollarını necə də dəyişmirlər!",
            "2": "Yayda günəşin necə yandırdığını, qışda isə necə uzaqlaşdığını görün.",
            "3": "Buludlara baxın: onlar nə vaxt su daşıyıb yağış yağdıracaqlarını bilirlər.",
            "4": "Ağacların yarpaqlarını tökməsini və təzədən cücərməsini seyr edin.",
            "5": "Bütün bunlar Allahın izzətini və hikmətini göstərir."
        }
    },
    
    // YUBİLEYLƏR KİTABI (Nümunə)
    "jubilees": {
        "1": {
            "1": "Musa Sina dağında olarkən Rəbb ona dedi: «Bu dağa qalx, sənə daş lövhələri, qanunu və əmrləri verəcəm...»",
            "2": "Musa Rəbbin hüzuruna qalxdı. Rəbbin izzəti Sina dağının üzərində idi. Bulud dağı altı gün örtdü.",
            "3": "Yeddinci gün Rəbb Musanı buludun içindən çağırdı. O, Rəbbin izzətini dağın zirvəsində yanan bir od kimi gördü."
        }
    },
    
    // TOMAS İNCİLİ (Nümunə)
    "thomas": {
        "1": {
            "1": "Bunlar dirilərin arasında olan İsanın söylədiyi gizli kəlamlardır. Didimus Yəhuda Tomas onları yazdı.",
            "2": "İsa dedi: «Axtaran axtarmaqdan əl çəkməsin, tapana qədər. Tapanda isə çaşqınlıq keçirəcək.»",
            "3": "Çaşqınlıq keçirəndə heyrətlənəcək. Və hər şey üzərində hökmranlıq edəcək.",
            "4": "İsa dedi: «Qoca adam bir körpəyə yeddi günlük həyat barədə soruşmaqdan çəkinməsin. Onda biləcəksən ki, birincilər sonuncular olacaq.»"
        }
    }
};

// ---------- AXTARIŞ İNDEKSİ (Avtomatik Qurulur) ----------
// Bu funksiya bütün kitablarda axtarış etmək üçün istifadə olunacaq
function searchInCustomBooks(query) {
    if (!query || query.length < 2) return [];
    
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    for (const [bookId, chapters] of Object.entries(customBooksData)) {
        const bookInfo = customBooksList.find(b => b.id === bookId);
        if (!bookInfo) continue;
        
        for (const [chapNum, verses] of Object.entries(chapters)) {
            for (const [verseNum, text] of Object.entries(verses)) {
                if (text.toLowerCase().includes(lowerQuery)) {
                    results.push({
                        source: bookInfo.nameAz,
                        bookId: bookId,
                        chapter: parseInt(chapNum),
                        verse: parseInt(verseNum),
                        text: text.substring(0, 150) + (text.length > 150 ? '...' : ''),
                        fullText: text,
                        icon: bookInfo.icon
                    });
                }
            }
        }
    }
    
    return results;
}

// ---------- KİTAB MƏTNİNİ ALMA ----------
function getCustomBookVerse(bookId, chapter, verse) {
    try {
        return customBooksData[bookId][chapter.toString()][verse.toString()] || null;
    } catch (e) {
        return null;
    }
}

// ---------- FƏSİLDƏKİ BÜTÜN AYƏLƏRİ ALMA ----------
function getCustomBookChapter(bookId, chapter) {
    try {
        return customBooksData[bookId][chapter.toString()] || {};
    } catch (e) {
        return {};
    }
}

// ---------- KİTAB HAQQINDA MƏLUMAT ----------
function getCustomBookInfo(bookId) {
    return customBooksList.find(b => b.id === bookId) || null;
}

// ---------- YENİ KİTAB ƏLAVƏ ETMƏK ÜÇÜN NÜMUNƏ ----------
/*
customBooksData["yeni_kitab_id"] = {
    "1": {
        "1": "Birinci ayənin mətni...",
        "2": "İkinci ayənin mətni..."
    },
    "2": {
        "1": "İkinci fəsil, birinci ayə..."
    }
};

customBooksList.push({
    id: "yeni_kitab_id",
    name: "Kitabın Adı",
    nameAz: "Azərbaycanca Adı",
    icon: "fa-book",
    color: "#RRGGBB",
    description: "Qısa təsvir",
    chapters: 10
});
*/

// Konsola məlumat ver (Developer üçün)
console.log(`✅ Kəlam: ${customBooksList.length} əlavə kitab yükləndi.`);