/**
 * SenseEngine.js (Mutepeya) v1.0
 * [EN] Precision Mapping: Sound ID -> Multi-language Translation / [ES] Mapeo de Precisión: ID de Sonido -> Traducción Multi-idioma
 * [EN] Supports: 11 Languages, 20+ Natures, 10 Design Skins / [ES] Soporta: 11 Idiomas, 20+ Naturalezas, 10 Skins de Diseño
 * [EN] Accessibility: aria-live queue + Web Speech API (speech synthesis) / [ES] Accesibilidad: aria-live queue + Web Speech API (síntesis de voz)
 */
const SenseEngine = (() => {
    // [EN] Initial configuration / [ES] Configuración inicial
    let config = { lang: 'es', container: null, voice: false };

    // --- [EN] Accessibility: Announcement queue for screen readers / [ES] Accesibilidad: Cola de anuncios para screen readers ---
    let _ariaQueue = [];
    let _ariaActive = false;

    // --- [EN] Voice module: Web Speech API / [ES] Módulo de voz: Web Speech API ---
    // [EN] Internal language map -> BCP-47 code for SpeechSynthesis / [ES] Mapa de idioma interno -> código BCP-47 para SpeechSynthesis
        const _LANG_BCP47 = {
        es: 'es-ES', en: 'en-US', ar: 'ar-SA',
        hi: 'hi-IN', ja: 'ja-JP', ru: 'ru-RU',
        fr: 'fr-FR', pt: 'pt-BR', zh: 'zh-CN',
        bn: 'bn-BD', id: 'id-ID',
        ko: 'ko-KR', mi: 'mi-NZ', qu: 'quz-PE',
        sw: 'sw-KE', th: 'th-TH', tr: 'tr-TR',
        uk: 'uk-UA', vi: 'vi-VN'
    };

    let _lastSpeak = 0;
    const _speak = (text) => {
        if (!config.voice) return;
        if (!window.speechSynthesis) return;

        // [EN] Throttling: avoid OS audio engine flooding / [ES] Throttling: evitar saturar el motor de audio del SO
        const now = Date.now();
        if (now - _lastSpeak < 50) return;
        _lastSpeak = now;

        window.speechSynthesis.cancel();

        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = _LANG_BCP47[config.lang] || 'es-ES';
        utt.rate  = config.voiceRate  ?? 1.2;
        utt.pitch = config.voicePitch ?? 1.1;
        window.speechSynthesis.speak(utt);
    };

    const _processAriaQueue = () => {
        if (_ariaQueue.length === 0) { _ariaActive = false; return; }
        _ariaActive = true;
        const text = _ariaQueue.shift();

        let announcer = document.getElementById('sense-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'sense-announcer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0;';
            document.body.appendChild(announcer);
        }
        // [EN] Clear first so reader detects change even if text is identical / [ES] Limpiar primero para que el lector detecte el cambio aunque el texto sea igual
        announcer.innerText = '';
        setTimeout(() => {
            announcer.innerText = text;
            // [EN] 600ms between announcements: enough window so reader doesn't overlap next / [ES] 600ms entre anuncios: ventana suficiente para que el lector no pise el siguiente
            setTimeout(_processAriaQueue, 600);
        }, 50);
    };

    // [EN] Master ID Dictionary / [ES] Diccionario Maestro de IDs
    const VOICE_BOX = {
        "es": {
            dir: "ltr",
            lex: {
                "shot": "¡PUM!", "slash": "¡ZAS!", "boom": "¡BOOM!", "hit": "¡TOMA!", "shield": "¡CLANK!",
                "fire": "¡FUEGO!", "bolt": "¡RAYO!", "ice": "¡HIELO!", "wind": "¡FIUU!", "earth": "¡CRAC!",
                "jump": "¡SALTA!", "run": "¡CORRE!", "fall": "¡AAAH!", "death": "¡MUERE!", "ghost": "¡BUU!",
                "toxic": "¡PUAG!", "heal": "¡CURA!", "power": "¡OH!", "break": "¡CRASH!", "alert": "¡OJO!",
                "metal": "¡PLANG!", "water": "¡PLOP!", "wood": "¡TOC!", "magic": "¡SHIN!", "fast": "¡ZUM!",
                "heavy": "¡BUM!", "cyber": "¡BIP!", "success": "¡BIEN!", "fail": "¡NO!", "kick": "¡PAW!"
            },
            ui: { "click": "Click", "send": "Enviado", "load": "Cargando", "ok": "Éxito", "err": "Error", "save": "Guardado", "open": "Abrir", "close": "Cerrar", "next": "Sig.", "back": "Volver" }
        },
        "en": {
            dir: "ltr",
            lex: {
                "shot": "BANG!", "slash": "SLASH!", "boom": "BOOM!", "hit": "HIT!", "shield": "CLANG!",
                "fire": "BURN!", "bolt": "ZAP!", "ice": "FREEZE!", "wind": "SWOOSH!", "earth": "THUD!",
                "jump": "JUMP!", "run": "RUN!", "fall": "AAAH!", "death": "DIE!", "ghost": "BOO!",
                "toxic": "EWW!", "heal": "HEAL!", "power": "POW!", "break": "CRACK!", "alert": "ALERT!",
                "metal": "CLANK!", "water": "SPLASH!", "wood": "THUD!", "magic": "SPARK!", "fast": "ZOOM!",
                "heavy": "THUMP!", "cyber": "BEEP!", "success": "YES!", "fail": "FAIL!", "kick": "KICK!"
            },
            ui: { "click": "Click", "send": "Sent", "load": "Loading", "ok": "Success", "err": "Error", "save": "Saved", "open": "Open", "close": "Close", "next": "Next", "back": "Back" }
        },
        "ar": {
            dir: "rtl",
            lex: {
                "shot": "طاخ", "slash": "فش", "boom": "بوم", "hit": "طاخ", "shield": "رنين",
                "fire": "فشفش", "bolt": "صعق", "ice": "جليد", "wind": "هسهسة", "earth": "دمدمة",
                "jump": "اقفز", "run": "اركض", "fall": "سقوط", "death": "موت", "ghost": "شبح",
                "toxic": "سام", "heal": "شفاء", "power": "قوة", "break": "تحطم", "alert": "تنبيه",
                "metal": "معدن", "water": "رش", "wood": "خشب", "magic": "سحر", "fast": "سريع",
                "heavy": "ثقيل", "cyber": "رقمي", "success": "نجاح", "fail": "فشل", "kick": "ركلة"
            },
            ui: { "click": "نقرة", "send": "أرسل", "load": "تحميل", "ok": "نجاح", "err": "خطأ", "save": "حفظ", "open": "فتح", "close": "إغلاق", "next": "التالي", "back": "رجوع" }
        },
        "hi": {
            dir: "ltr",
            lex: {
                "shot": "धमाका", "slash": "प्रहार", "boom": "बूम", "hit": "ठक", "shield": "झन",
                "fire": "लपलप", "bolt": "तड़प", "ice": "खड़खड़", "wind": "सर", "earth": "धप",
                "jump": "कूदो", "run": "भागो", "fall": "आह", "death": "मरो", "ghost": "शंभ",
                "toxic": "गंदा", "heal": "स्वस्थ", "power": "शक्ति", "break": "कड़क", "alert": "बीप",
                "metal": "धातु", "water": "छपाक", "wood": "लकड़ी", "magic": "जादू", "fast": "तेज़",
                "heavy": "भारी", "cyber": "बीप", "success": "जीते", "fail": "हार", "kick": "लात"
            },
            ui: { "click": "क्लिक", "send": "भेजा", "load": "लोडिंग", "ok": "सफल", "err": "गलत", "save": "सुरक्षित", "open": "खोलो", "close": "बंद", "next": "अगला", "back": "वापस" }
        },
        "ja": {
            dir: "ltr",
            lex: {
                "shot": "バン", "slash": "シュッ", "boom": "ドカン", "hit": "ドス", "shield": "カーン",
                "fire": "ボウ", "bolt": "バチッ", "ice": "カチ", "wind": "ヒュッ", "earth": "ドシ",
                "jump": "トウッ", "run": "タッタッ", "fall": "あああ", "death": "ガクッ", "ghost": "ユラ",
                "toxic": "ドロ", "heal": "ピカッ", "power": "グワ", "break": "パキ", "alert": "ピピッ",
                "metal": "キン", "water": "ピチャ", "wood": "コン", "magic": "ピカ", "fast": "シュン",
                "heavy": "ズシン", "cyber": "ピッ", "success": "やった", "fail": "ダメ", "kick": "キック"
            },
            ui: { "click": "クリック", "send": "送信", "load": "読込中", "ok": "成功", "err": "エラー", "save": "保存", "open": "開く", "close": "閉じる", "next": "次へ", "back": "戻る" }
        },
        "ru": {
            dir: "ltr",
            lex: {
                "shot": "ПАУ!", "slash": "ВЖУХ!", "boom": "БУМ!", "hit": "БАЦ!", "shield": "ДЗЫНЬ!",
                "fire": "ОГОНЬ!", "bolt": "БЛЕСК!", "ice": "ЛЁД!", "wind": "СВИСТ!", "earth": "ТОП!",
                "jump": "ПРЫГ!", "run": "БЕГИ!", "fall": "ААА!", "death": "ПОМЕР!", "ghost": "УУУ!",
                "toxic": "ФУУ!", "heal": "ЛЕЧИ!", "power": "СИЛА!", "break": "ХРУСТЬ!", "alert": "АХТУНГ!",
                "metal": "ДЗЯНЬ!", "water": "ПЛЮХ!", "wood": "ТУК!", "magic": "МАГИЯ!", "fast": "ВЖИК!",
                "heavy": "УХ!", "cyber": "БИП!", "success": "ДА!", "fail": "НЕТ!", "kick": "ПИН!"
            },
            ui: { "click": "Клик", "send": "Ушло", "load": "Ждите", "ok": "ГОТОВО", "err": "ОШИБКА", "save": "Сейв", "open": "ОТКРЫТЬ", "close": "ЗАКРЫТЬ", "next": "Далее", "back": "Назад" }
        },
        "fr": {
            dir: "ltr",
            lex: {
                "shot": "PAN!", "slash": "VLAM!", "boom": "BOUM!", "hit": "COUP!", "shield": "CLING!",
                "fire": "FEU!", "bolt": "FLASH!", "ice": "GEL!", "wind": "FIOU!", "earth": "CRAC!",
                "jump": "SAUTE!", "run": "COURS!", "fall": "AAAA!", "death": "MORT!", "ghost": "BOUH!",
                "toxic": "BEURK!", "heal": "SOIN!", "power": "POUVOIR!", "break": "CASSÉ!", "alert": "ALERTE!",
                "metal": "GLING!", "water": "PLOUF!", "wood": "TOC!", "magic": "MAGIE!", "fast": "VITE!",
                "heavy": "LOURD!", "cyber": "BIP!", "success": "GAGNÉ!", "fail": "RATÉ!", "kick": "KICK!"
            },
            ui: { "click": "Clic", "send": "Envoyé", "load": "Attente", "ok": "Succès", "err": "Erreur", "save": "Sauvé", "open": "Ouvrir", "close": "Fermer", "next": "Suiv.", "back": "Retour" }
        },
        "pt": {
            dir: "ltr",
            lex: {
                "shot": "PUM!", "slash": "ZAS!", "boom": "BOOM!", "hit": "GOLPE!", "shield": "CLANG!",
                "fire": "FOGO!", "bolt": "RAIO!", "ice": "GELO!", "wind": "VUUSH!", "earth": "TUM!",
                "jump": "PULA!", "run": "CORRE!", "fall": "AAAH!", "death": "MORRE!", "ghost": "BUUU!",
                "toxic": "ARGH!", "heal": "CURA!", "power": "PODER!", "break": "CRACK!", "alert": "AVISO!",
                "metal": "PLANG!", "water": "PLASH!", "wood": "TOC!", "magic": "MAGIA!", "fast": "VUP!",
                "heavy": "FORTE!", "cyber": "BIP!", "success": "BOA!", "fail": "ERRO!", "kick": "CHUTE!"
            },
            ui: { "click": "Clique", "send": "Enviado", "load": "CARREGANDO", "ok": "Feito", "err": "Erro", "save": "Salvo", "open": "Abrir", "close": "Fechar", "next": "Prox.", "back": "Voltar" }
        },
        "zh": {
            dir: "ltr",
            lex: {
                "shot": "砰!", "slash": "唰!", "boom": "轰!", "hit": "啪!", "shield": "哐!",
                "fire": "呼呼", "bolt": "啪啦!", "ice": "冰!", "wind": "呼!", "earth": "咚!",
                "jump": "跳!", "run": "跑!", "fall": "啊!", "death": "死!", "ghost": "魂!",
                "toxic": "毒!", "heal": "叮!", "power": "力!", "break": "碎!", "alert": "警!",
                "metal": "金!", "water": "水!", "wood": "木!", "magic": "幻!", "fast": "快!",
                "heavy": "重!", "cyber": "电!", "success": "成!", "fail": "败!", "kick": "踢!"
            },
            ui: { "click": "点击", "send": "发送", "load": "加载", "ok": "成功", "err": "错误", "save": "保存", "open": "打开", "close": "关闭", "next": "下一步", "back": "返回" }
        },
        "bn": {
            dir: "ltr",
            lex: {
                "shot": "ঠাঁই!", "slash": "ঝপাং!", "boom": "ধুম!", "hit": "ঘুষি!", "shield": "ঠং!",
                "fire": "ফড়ফড়", "bolt": "বজ্র!", "ice": "খড়খড়", "wind": "শুঁ!", "earth": "ধপ!",
                "jump": "লাফ!", "run": "দৌড়!", "fall": "আহ!", "death": "মৃত্যু!", "ghost": "ভূত!",
                "toxic": "বিষ!", "heal": "সুস্থ!", "power": "শক্তি!", "break": "ভাঙা!", "alert": "বিপ",
                "metal": "ধাতু!", "water": "ঝপাং!", "wood": "কাঠ!", "magic": "জাদু!", "fast": "দ্রুত!",
                "heavy": "ভারী!", "cyber": "বিপ!", "success": "জয়!", "fail": "ব্যর্থ!", "kick": "লাথি!"
            },
            ui: { "click": "ক্লিক", "send": "পাঠান", "load": "লোড হচ্ছে", "ok": "সফল", "err": "ভুল", "save": "সংরक्षण", "open": "খুলুন", "close": "বন্ধ", "next": "পরবর্তী", "back": "পিছনে" }
        },
        "id": {
            dir: "ltr",
            lex: {
                "shot": "DOR!", "slash": "SRET!", "boom": "DUAR!", "hit": "BUG!", "shield": "TING!",
                "fire": "API!", "bolt": "BLAR!", "ice": "BEKU!", "wind": "WUSH!", "earth": "BRUK!",
                "jump": "LOMPAT!", "run": "LARI!", "fall": "AAAH!", "death": "MATI!", "ghost": "HANTU!",
                "toxic": "RACUN!", "heal": "SEMBUH!", "power": "KUAT!", "break": "HANCUR!", "alert": "AWAS!",
                "metal": "TRENG!", "water": "BYUR!", "wood": "TAK!", "magic": "SIHIR!", "fast": "WUSH!",
                "heavy": "DUM!", "cyber": "BIP!", "success": "BERHASIL!", "fail": "GAGAL!", "kick": "TENDANG!"
            },
            ui: { "click": "Klik", "send": "Kirim", "load": "Memuat", "ok": "Berhasil", "err": "Error", "save": "Simpan", "open": "Buka", "close": "Tutup", "next": "Lanjut", "back": "Kembali" }
        },
        "ko": {"dir":"ltr","lex":{"shot":"펑!","slash":"휙!","boom":"쾅!","hit":"퍽!","shield":"쨍!","fire":"활활!","bolt":"번쩍!","ice":"꽁꽁!","wind":"휭!","earth":"쿵!","jump":"팡!","run":"달려!","fall":"아악!","death":"으악!","ghost":"으스스!","toxic":"윽!","heal":"반짝!","power":"우와!","break":"와장창!","alert":"위험!","metal":"쨍그랑!","water":"첨벙!","wood":"톡!","magic":"반짝반짝!","fast":"쌩!","heavy":"쿵!","cyber":"삐!","success":"성공!","fail":"실패!","kick":"퍽!"},"ui":{"click":"클릭","send":"전송됨","load":"로딩 중","ok":"완료","err":"오류","save":"저장됨","open":"열기","close":"닫기","next":"다음","back":"뒤로"}},
        "mi": {"dir":"ltr","lex":{"shot":"PAOA!","slash":"HAHAE!","boom":"PAKŪ!","hit":"TŪKINO!","shield":"KIRI!","fire":"AHI!","bolt":"UIRA!","ice":"HUKA!","wind":"HOU!","earth":"PAPA!","jump":"PEKE!","run":"OMA!","fall":"HINGA!","death":"MATE!","ghost":"WAIRUA!","toxic":"POKE!","heal":"WHAKAORA!","power":"MANA!","break":"WHATI!","alert":"ĀRAHINA!","metal":"KONGANGI!","water":"PAPAKI!","wood":"TOI!","magic":"MAKUTU!","fast":"TERE!","heavy":"TAIMAHA!","cyber":"PIP!","success":"ANGITŪ!","fail":"HINGA!","kick":"WHANA!"},"ui":{"click":"Pāwhiri","send":"Kua tukuna","load":"E uta ana","ok":"Angitū","err":"Hapa","save":"Kua tiakina","open":"Whakatuwhera","close":"Kati","next":"Panuku","back":"Hoki"}},
        "qu": {"dir":"ltr","lex":{"shot":"PHUM!","slash":"CHAKIY!","boom":"PHATAY!","hit":"MAQAY!","shield":"Q'AQAY!","fire":"NINA!","bolt":"ILLAPA!","ice":"CHULLUY!","wind":"WAYRA!","earth":"ALLPA!","jump":"PHAWAY!","run":"KALLPAY!","fall":"URMAY!","death":"WAÑUY!","ghost":"SUPAY!","toxic":"AWKAY!","heal":"HAMPIY!","power":"SINCHI!","break":"P'AKIY!","alert":"QAWAY!","metal":"Q'ILLAY!","water":"YAKU!","wood":"K'OTOY!","magic":"LAYQAY!","fast":"UTQAY!","heavy":"LLASAQ!","cyber":"PIP!","success":"ATIY!","fail":"MANA!","kick":"SIPHUY!"},"ui":{"click":"Llamk'ay","send":"Kachasqa","load":"Haykuchkasqa","ok":"Atisqa","err":"Pantasqa","save":"Waqaychisqa","open":"Kichay","close":"Wichq'ay","next":"Kaypi","back":"Kutiy"}},
        "sw": {"dir":"ltr","lex":{"shot":"PIGA!","slash":"FWATA!","boom":"BOOM!","hit":"BANA!","shield":"DING!","fire":"MOTO!","bolt":"UMEME!","ice":"GANDA!","wind":"FWUU!","earth":"DUNDA!","jump":"RUKA!","run":"KIMBIA!","fall":"ANGUKA!","death":"KUFA!","ghost":"SHETANI!","toxic":"SUMU!","heal":"PONA!","power":"NGUVU!","break":"VUNJA!","alert":"TAHADHARI!","metal":"CHUMA!","water":"CHAPUO!","wood":"TOK!","magic":"UCHAWI!","fast":"HARAKA!","heavy":"DUNDA!","cyber":"BIP!","success":"IMEFAULU!","fail":"IMESHINDWA!","kick":"TEKE!"},"ui":{"click":"Bonyeza","send":"Imetumwa","load":"Inapakia","ok":"Imefaulu","err":"Hitilafu","save":"Imehifadhiwa","open":"Fungua","close":"Funga","next":"Ifuatayo","back":"Rudi"}},
        "th": {"dir":"ltr","lex":{"shot":"ปัง!","slash":"ฉับ!","boom":"บูม!","hit":"ตูม!","shield":"กริ๊ง!","fire":"ไฟ!","bolt":"แปลบ!","ice":"แข็ง!","wind":"โฉบ!","earth":"ดัง!","jump":"โดด!","run":"วิ่ง!","fall":"อ๊าก!","death":"ตาย!","ghost":"ผี!","toxic":"โอ๊ย!","heal":"วาว!","power":"โอ้โห!","break":"แตก!","alert":"ระวัง!","metal":"กริ๊ง!","water":"ป้อม!","wood":"ทก!","magic":"วิเศษ!","fast":"ซิ่ง!","heavy":"ตุ้ม!","cyber":"บี๊ป!","success":"สำเร็จ!","fail":"ล้มเหลว!","kick":"เตะ!"},"ui":{"click":"คลิก","send":"ส่งแล้ว","load":"กำลังโหลด","ok":"สำเร็จ","err":"ข้อผิดพลาด","save":"บันทึกแล้ว","open":"เปิด","close":"ปิด","next":"ถัดไป","back":"ย้อนกลับ"}},
        "tr": {"dir":"ltr","lex":{"shot":"PAT!","slash":"ŞAKLAT!","boom":"GÜMBÜR!","hit":"ÇARPTIR!","shield":"ŞANGIR!","fire":"ALEV!","bolt":"ÇAKT!","ice":"ÇATIR!","wind":"VIŞŞ!","earth":"GÜDÜK!","jump":"ZIPLA!","run":"KOŞ!","fall":"AAAH!","death":"ÇÖKTÜ!","ghost":"HUU!","toxic":"ÖFFFFF!","heal":"IŞILT!","power":"GÜÇLÜ!","break":"PARÇALA!","alert":"DİKKAT!","metal":"ŞANGIRDAT!","water":"ŞIPIRT!","wood":"TIK!","magic":"IŞILT!","fast":"VIZZ!","heavy":"GÜMBÜRT!","cyber":"BİP!","success":"BAŞARILI!","fail":"BAŞARISIZ!","kick":"TEKME!"},"ui":{"click":"Tıkla","send":"Gönderildi","load":"Yükleniyor","ok":"Tamam","err":"Hata","save":"Kaydedildi","open":"Aç","close":"Kapat","next":"İleri","back":"Geri"}},
        "uk": {"dir":"ltr","lex":{"shot":"БАХ!","slash":"СВИСТ!","boom":"БАБАХ!","hit":"ТРАХ!","shield":"ДЗЕНЬ!","fire":"ВОГОНЬ!","bolt":"БЛИСКАВКА!","ice":"КРИГА!","wind":"СВИШ!","earth":"ГУП!","jump":"СТРИБ!","run":"БІЖИ!","fall":"АААА!","death":"ГИНЬ!","ghost":"УУУ!","toxic":"ФУ!","heal":"ЛІКУЙ!","power":"СИЛА!","break":"ТРІЩИТЬ!","alert":"УВАГА!","metal":"ДЗЕЛЕНЬ!","water":"ПЛЮХ!","wood":"ТУК!","magic":"ЧАРИ!","fast":"ВЖИК!","heavy":"ГУРКІТ!","cyber":"БІП!","success":"ВДАЛОСЬ!","fail":"ПРОВАЛ!","kick":"КОПНЯК!"},"ui":{"click":"Клік","send":"Надіслано","load":"Завантаження","ok":"Готово","err":"Помилка","save":"Збережено","open":"Відкрити","close":"Закрити","next":"Далі","back":"Назад"}},
        "vi": {"dir":"ltr","lex":{"shot":"ĐÙNG!","slash":"VÚT!","boom":"BÙM!","hit":"BỊCH!","shield":"COONG!","fire":"PHỰC!","bolt":"CHOÁNG!","ice":"RÀO!","wind":"VÙN VÙT!","earth":"ẦM!","jump":"VỌT!","run":"CHẠY!","fall":"ÁI!","death":"CHẾT!","ghost":"MA!","toxic":"ÔI TRỜI!","heal":"SÁNG!","power":"UY!","break":"RẦM!","alert":"CẨN THẬN!","metal":"LOẢNG XOẢNG!","water":"TÒM!","wood":"GÕ!","magic":"HUYỀN!","fast":"VÙT!","heavy":"ẦM!","cyber":"BÍP!","success":"THÀNH CÔNG!","fail":"THẤT BẠI!","kick":"ĐÁ!"},"ui":{"click":"Nhấp","send":"Đã gửi","load":"Đang tải","ok":"Thành công","err":"Lỗi","save":"Đã lưu","open":"Mở","close":"Đóng","next":"Tiếp","back":"Quay lại"}}
    };

    return {
        // [EN] Initializes the container where onomatopoeias will be rendered / [ES] Inicializa el contenedor donde se renderizarán las onomatopeyas
        init: (id) => { config.container = document.getElementById(id) || document.body; },
        
        // [EN] Changes language and adjusts LTR/RTL direction / [ES] Cambia el idioma y ajusta la dirección LTR/RTL
        setLanguage: (lang) => { 
            if(VOICE_BOX[lang]) { 
                config.lang = lang; 
                document.documentElement.setAttribute('dir', VOICE_BOX[lang].dir);
            }
        },

        // [EN] Enables speech synthesis — reads onomatopoeia aloud on spawn / [ES] Activa la síntesis de voz — lee la onomatopeya en voz alta al hacer spawn
        // [EN] Usage / [ES] Uso: SenseEngine.enableVoice()
        enableVoice: () => { config.voice = true; },

        // [EN] Disables speech synthesis / [ES] Desactiva la síntesis de voz
        // [EN] Usage / [ES] Uso: SenseEngine.disableVoice()
        disableVoice: () => {
            config.voice = false;
            if (window.speechSynthesis) window.speechSynthesis.cancel();
        },

        // [EN] Adjusts voice speed and pitch if customization is needed / [ES] Ajusta velocidad y tono de la voz si se necesita personalización
        // [EN] Usage / [ES] Uso: SenseEngine.setVoiceParams({ rate: 1.5, pitch: 0.9 })
        setVoiceParams: ({ rate, pitch } = {}) => {
            if (rate  !== undefined) config.voiceRate  = rate;
            if (pitch !== undefined) config.voicePitch = pitch;
        },

        // [EN] Generates visual onomatopoeia (+ voice if enabled) / [ES] Genera la onomatopeya visual (+ voz si está activada)
        spawn: (key, x, y, styleOrConfig = 'ono-impact') => {
            if(!config.container) return;

            // [EN] Performance Security: Hard cap on simultaneous DOM nodes to prevent OOM / [ES] Seguridad de Rendimiento: Límite duro de nodos DOM simultáneos
            if (config.container.querySelectorAll('.sense-container, .sense-ono').length > 50) return;

            const langData = VOICE_BOX[config.lang];
            const text = langData.lex[key] || langData.ui[key] || "ID_NOT_FOUND";

            let style = 'ono-impact';
            let bubbleConfig = null;
            if (typeof styleOrConfig === 'string') {
                style = styleOrConfig;
            } else if (typeof styleOrConfig === 'object' && styleOrConfig !== null) {
                if (styleOrConfig.bubble) {
                    bubbleConfig = typeof styleOrConfig.bubble === 'boolean' ? {} : styleOrConfig.bubble;
                }
                if (styleOrConfig.style) style = styleOrConfig.style;
            }

            const safeStyle = style.split(' ').filter(s => /^[a-z0-9_-]+$/i.test(s)).join(' ');

            const rect = config.container.getBoundingClientRect();
            const posX = x - rect.left + config.container.scrollLeft;
            const posY = y - rect.top + config.container.scrollTop;

            let rootNode = null;
            let animDuration = 1200;

            if (bubbleConfig) {
                const defaults = { variant: 'comic', layout: 'burst', animated: true, customColor: null };
                const bConfig = { ...defaults, ...bubbleConfig };

                const container = document.createElement('div');
                container.className = 'sense-container';
                container.style.position = 'absolute';
                container.style.left = `${posX}px`;
                container.style.top = `${posY}px`;
                container.style.pointerEvents = 'none';

                const bubbleNode = document.createElement('div');
                bubbleNode.classList.add('sense-bubble', `sense-variant-${bConfig.variant}`, `sense-layout-${bConfig.layout}`);
                if (bConfig.animated) bubbleNode.classList.add(`sense-anim-${bConfig.variant}`);
                if (bConfig.customColor) bubbleNode.style.setProperty('--bubble-color', bConfig.customColor);

                const textNode = document.createElement('span');
                textNode.className = `sense-text sense-lang-${config.lang} sense-ono ${safeStyle}`;
                // Remove absolute positioning from textNode when inside a bubble container
                textNode.style.position = 'relative'; 
                textNode.style.left = '0';
                textNode.style.top = '0';
                textNode.innerText = text;

                bubbleNode.appendChild(textNode);
                container.appendChild(bubbleNode);
                config.container.appendChild(container);
                rootNode = container;

                const bDur = parseFloat(getComputedStyle(bubbleNode).animationDuration) * 1000 || 0;
                const tDur = parseFloat(getComputedStyle(textNode).animationDuration) * 1000 || 1200;
                animDuration = Math.max(bDur, tDur);

            } else {
                const el = document.createElement('div');
                el.className = `sense-ono ${safeStyle}`;
                el.setAttribute('aria-hidden', 'true'); 
                el.innerText = text;
                el.style.left = `${posX}px`;
                el.style.top  = `${posY}px`;

                config.container.appendChild(el);
                rootNode = el;

                animDuration = parseFloat(getComputedStyle(el).animationDuration) * 1000 || 1200;
            }

            setTimeout(() => {
                if (rootNode && rootNode.parentNode) rootNode.remove();
            }, animDuration + 100);

            _speak(text);

            _ariaQueue.push(text);
            if (_ariaQueue.length > 10) _ariaQueue.shift();
            
            if (!_ariaActive) _processAriaQueue();
        }
    };
})();