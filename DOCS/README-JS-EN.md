# ⚙️ sense-engine.js — Technical Documentation

Main **SenseEngine** engine script. It hosts the entire logic for resolving onomatopoeias, the asynchronous DOM rendering system, the multilingual dictionary, the strict accessibility queue for screen readers, and the native voice synthesis module. It is the sole JavaScript file comprising the system — **zero dependencies, no build steps, no external bundling.**

---

## 🏛️ Generic Architecture

The engine is wrapped entirely as an **IIFE** (_Immediately Invoked Function Expression_) isolating a solitary global `SenseEngine` object holding the public API. Every internal variable resides exclusively within a closure boundaries, making it inaccessible to developers or browser extensions, granting strict tamper-protection to inner statuses.

```text
SenseEngine (Singleton Object)
│
├── Public API
│   ├── init()
│   ├── setLanguage()
│   ├── spawn()
│   ├── enableVoice()
│   ├── disableVoice()
│   └── setVoiceParams()
│
└── Internals (Private Closure)
    ├── config            { lang, container, voice, voiceRate, voicePitch }
    ├── VOICE_BOX         Master layout of 8 dictionaries
    ├── _LANG_BCP47       Language router for BCP-47 identifiers
    ├── _speak()          Voice synthesis wrapper
    ├── _ariaQueue        FIFO Queue array for screen readers
    ├── _ariaActive       Queue Processing Flag
    └── _processAriaQueue() Async garbage collector for ARIA
```

---

## 🔒 Internal State (`config`)

```javascript
let config = { lang: 'es', container: null, voice: false };
```

The `config` block acts as the singular source of truth. Properties:

| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `lang` | string | `'es'` | Active language context. Keys strictly match `VOICE_BOX`. |
| `container` | Element/null | `null` | Rendering anchor point. `spawn()` behaves dead until `init()` triggers. |
| `voice` | boolean | `false` | Enables/Disables real-time synthesis read-outs. |
| `voiceRate` | number | `undefined` | Voice cadence. Gracefully falls back to `1.2`. |
| `voicePitch`| number | `undefined` | Speech pitch. Gracefully falls back to `1.1`. |

> [!NOTE]
> `voiceRate` and `voicePitch` are processed securely using the `??` (Nullish coalescing) operator. This enables legitimate inputs of `0` to bypass defaults without false `falsy` triggering.

---

## 📖 The Master Lexicon (`VOICE_BOX`)

The immutable database of the framework.

### Baseline Structure
```javascript
"es": {
    dir: "ltr",       // DOM Direction "ltr" or "rtl"
    lex: { ... },     // Physics & conceptual game cries
    ui:  { ... }      // Navigational & parametric texts
}
```

> [!IMPORTANT]
> The engine fundamentally isolates logic between `lex` (Hits, Magic, Fire) and `ui` (Save, Load, Empty). Through `spawn()` execution, it natively searches `lex`; mapping through `ui` acts as a fail-safe secondary net.

### Partial Sound DB `lex`

| Logic ID | Español | English |
| :--- | :--- | :--- |
| `shot` | ¡PUM! | BANG! |
| `slash` | ¡ZAS! | SLASH! |
| `boom` | ¡BOOM! | BOOM! |
| `fire` | ¡FUEGO! | BURN! |
| `magic`| ¡SHIN! | SPARK! |

*(For the complete 40+ string listing, inspect the internal JS Object).*

---

## 🌐 Public Flow (API)

### `init(id)`
Ties the engine wrapper. If an invalid ID fails to match, it defaults to the `document.body` to prevent catastrophic visual errors. **The host must strictly rely upon CSS position properties relative/absolute.**

### `setLanguage(lang)`
Updates global page orientation logic automatically (Necessary switch for RTL logic like Arabic/Hebrew): `document.documentElement.setAttribute('dir', VOICE_BOX[lang].dir);`.

> [!TIP]
> To fully understand how to handle complex layouts, coordinates, and direction changes, see the i18n and RTL Guide ([**ES**](./i18n-guia.md) / [**EN**](./i18n-guide.md)).

### `spawn(key, x, y, style)` -> The reactive core

1.  **Resolves raw text:** Returns `"ID_NOT_FOUND"` string if missing — failing silently isn't an option during dev environments.
2.  **DOM Node Generation:** Synthesizes `aria-hidden="true"` nodes avoiding reader duplication.
3.  **Absolute Math:** Injects coordinates via `container.getBoundingClientRect()`.
4.  **Garbage Collecting Protocol:** 
```javascript
const animDuration = parseFloat(getComputedStyle(el).animationDuration) * 1000 || 1200;
setTimeout(() => { if (el && el.parentNode) el.remove(); }, animDuration + 100);
```
> [!CAUTION]
> The garbage collector natively traces out computed CSS duration endpoints. For instances of rapid iterations, refrain from forcing `infinite` translation bounds inside `sense-engine.css` to prevent memory leaking scenarios on specific devices.

---

## 🎙️ Synthesis & Access (A11y)

### `enableVoice()` / `disableVoice()`
Gatekeeps the Web Speech API `SpeechSynthesisUtterance`.

### `_processAriaQueue()` [Private Scope]
Highly restrictive logical FIFO loop. Circumvents standard native browser bugs:
```text
_ariaQueue.push(text)
    ↓
Clears Virtual Target Reader => (Forced 50ms Timeout delay)
    ↓
Re-injects textual prompt => (Lengthy 600ms Timeout)
    ↓
Iterates recursive lags (Empties Stack Arrays)
```
_This entirely resolves architectural conflicts with **JAWS and NVDA** bypassing identical string iterations._
