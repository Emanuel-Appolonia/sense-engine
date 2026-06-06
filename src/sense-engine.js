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
        bn: 'bn-BD', id: 'id-ID'
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
        }
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
        spawn: (key, x, y, style = 'ono-impact') => {
            if(!config.container) return;

            // [EN] Finds exact text using Lexicon ID / [ES] Busca el texto exacto usando el ID Lexicon
            const langData = VOICE_BOX[config.lang];
            const text = langData.lex[key] || langData.ui[key] || "ID_NOT_FOUND";

            // [EN] Security: sanitize style string to prevent CSS injection / [ES] Seguridad: sanitizar el string de estilo para evitar inyección de CSS
            const safeStyle = style.split(' ').filter(s => /^[a-z0-9_-]+$/i.test(s)).join(' ');

            // [EN] DOM element creation / [ES] Creación del elemento DOM
            const el = document.createElement('div');
            el.className = `sense-ono ${safeStyle}`; // [EN] Combines Nature + Skin / [ES] Combina Naturaleza + Skin
            el.setAttribute('aria-hidden', 'true'); 
            el.innerText = text;

            // [EN] Container offset: handle viewport position + container scroll / [ES] Offset del contenedor: maneja posición del viewport + scroll del contenedor
            const rect = config.container.getBoundingClientRect();
            el.style.left = `${x - rect.left + config.container.scrollLeft}px`;
            el.style.top  = `${y - rect.top + config.container.scrollTop}px`;

            config.container.appendChild(el);

            // [EN] Garbage Collector: reads real element animation duration to avoid premature cutting / [ES] Garbage Collector: lee la duración real de animación del elemento para no cortar antes de tiempo
            const animDuration = parseFloat(getComputedStyle(el).animationDuration) * 1000 || 1200;
            setTimeout(() => {
                if (el && el.parentNode) el.remove();
            }, animDuration + 100);

            // [EN] Speech synthesis (if enabled) / [ES] Síntesis de voz (si está activada)
            _speak(text);

            // [EN] Accessibility: enqueue text with limit to avoid flooding / [ES] Accesibilidad: encolar texto con límite para evitar saturación
            _ariaQueue.push(text);
            if (_ariaQueue.length > 10) _ariaQueue.shift(); // [EN] Keep only latest 10 / [ES] Mantener solo los últimos 10
            
            if (!_ariaActive) _processAriaQueue();
        }
    };
})();