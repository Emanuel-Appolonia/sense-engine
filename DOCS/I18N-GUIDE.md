# 🌐 Internationalization (i18n) & RTL/LTR Guide
> [**ES**](./i18n-guia.md) / [**EN**](./i18n-guide.md)


SenseEngine has been designed from the ground up to be a global engine. This guide explains how the system handles multiple languages, text directions, and how to extend these capabilities.

---

## 🌍 Multilingual Support

The engine uses a **Master Dictionary** (`VOICE_BOX`) that centralizes all translations. Each language entry contains:
- `dir`: Text direction (`ltr` or `rtl`).
- `lex`: Onomatopoeia dictionary for physical/game events.
- `ui`: Text for UI elements.
- [**Lexicon Master Table**](./LEXICON-MASTER-EN.md): Comparative table of all words in all 11 languages.

### How to add a new language

To add a language (e.g., German), you must extend the `VOICE_BOX` object in `sense-engine.js`:

```javascript
"de": {
    dir: "ltr",
    lex: { "shot": "PENG!", "boom": "KRACH!", ... },
    ui: { "click": "Klick", "load": "Laden...", ... }
}
```

---

## ↔️ RTL (Right-to-Left) vs LTR (Left-to-Right) Logic

When a language like Arabic (`ar`) is selected, SenseEngine performs two critical actions:

### 1. Automatic Direction Injection
The engine automatically executes:
```javascript
document.documentElement.setAttribute('dir', 'rtl');
```
This changes the global direction of the document. It is vital for punctuation and text structure to render correctly according to the language's grammar rules.

### 2. Coordinate System
A common question is: *Should I flip my X coordinates in RTL mode?*
**The answer is NO.**
SenseEngine uses absolute positioning relative to the container:
- `x`: Pixel distance from the left edge.
- `y`: Pixel distance from the top edge.

Even in RTL mode, the engine respects the physical position sent by the game or application, ensuring the onomatopoeia appears exactly where the sound event occurred.

---

## 🎨 CSS Adjustments for RTL

The `sense-engine.css` file includes specific support to adjust internal text alignment without breaking the positioning:

```css
[dir="rtl"] .sense-ono {
    direction: rtl;
    text-align: right;
}
```

### Customization Tips:
- **Icons:** If you use icons next to text, consider using `transform: scaleX(-1)` to mirror them in RTL if they are directional.
- **Paddings:** Avoid `padding-left` or `padding-right`. Use logical properties like `padding-inline-start` so the browser handles them automatically based on direction.

---

## 🎙️ Speech Synthesis (BCP-47)

For voice to work correctly, the engine internally maps the language code to a valid **BCP-47** code for the Web Speech API:

| Engine ID | BCP-47 |
| :--- | :--- |
| `es` | `es-ES` |
| `ar` | `ar-SA` |
| `hi` | `hi-IN` |

If you add a language, make sure to also update the internal `_LANG_BCP47` map.

---

## 📏 Weight Metric
SenseEngine maintains a strict lightness policy:
- **Maximum limit:** 1MB.
- **Current weight:** < 100KB (including logic, styles, and documentation).
- **Dependencies:** 0.

---
**SenseEngine — Universal Sensory Mapping**

> [!NOTE]
> **Language Note:** Due to the vast complexity of global writing systems, any orthographic or linguistic inconsistencies are responsibility of the current development state and are not intentional. Feedback for improvement is always welcome.
