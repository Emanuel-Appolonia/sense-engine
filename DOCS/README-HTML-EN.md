# 🧪 index.html — Technical Documentation

**SenseEngine** Interactive Laboratory. It is the official testing interface for the engine: it allows exploring all possible combinations of language, sound ID, visual nature, skin design, custom classes, and voice synthesis in real-time, without writing code.

> [!NOTE]
> It deploys directly to GitHub Pages as a public demo of the project. **It is not part of the engine** — it is strictly the environment where the engine is tested. You do not need to modify this or take this file to use SenseEngine in your own project.

---

## 🎯 What is it for?

The laboratory addresses two distinct needs:

1. **For those evaluating the engine:** It lets you see and hear any combination prior to integrating it into an ecosystem. Instead of reading documentation and imagining what `ono-fire` with `skin-neon` would look like in Russian, you can natively test it.
2. **For those developing the engine:** Any new _nature_, _skin_ or _ID_ added to the CSS or JS can be visually verified here without booting up complex servers. You can inject custom CSS directly using the live form field.

---

## 🏗️ File Structure

The layout is sharply divided into three sections:

```text
index.html
├── <head>
│   ├── Link → src/sense-engine.css
│   └── <style> — Lab exclusive styles
│
├── <body>
│   ├── <aside> — Control panel (sidebar)
│   │   ├── .header — Title & Subtitle block
│   │   └── .config-group — The 6 functional parameters
│   │
│   └── <main id="test-bench"> — Canvas testing area
│       └── .stats — Footer watermark
│
└── <script>
    ├── src/sense-engine.js — Base Engine Import
    └── Inline Script — Lab specific UI logic
```

---

## 🎨 Visual Theming (`<style>`)

```css
:root {
    --bg:     #0a0a0c;  /* Deep black background */
    --panel:  #16161a;  /* Dark gray for the sidebar */
    --accent: #00f2ff;  /* Interconnecting cyan line */
}
```

> [!TIP]
> These three CSS variables control the entire palette of the lab. If you need to embed this lab within a bright-theme project, simply alter `--bg` and `--panel` and the global unified layout will adapt seamlessly.

The testing area `#test-bench` is set with `position: relative`, because the javascript engine demands a bounding-box wrapper to correctly offset absolute collision coordinates.

---

## 🎛️ The 6 Parametric Controls

### 1️⃣ Language (`#lang`)
Triggers `SenseEngine.setLanguage()` in real-time. Alters the loaded database matrix and the `RTL` (Right-To-Left) mode (Ex: Arabic) seamlessly.

### 2️⃣ Sound ID (`#sound-key`)
Exposes the engine's _Lexicons_. Perfect for simulating damage yells or swift electric bursts.

### 3️⃣ Physics Nature (`#preset-style`)
Graphically lists the native `ono-*` classes stored within `sense-engine.css`.

### 4️⃣ Textural Skin (`#skin-style`)
Injects CSS overrides that bypass physics without destroying the engine's animation loops. You can leave this empty.

### 5️⃣ CSS Injector (`#custom-class`)
Directly concatenates the live text to the `spawn` engine output. Example:
```javascript
const finalStyles = `${presetSel.value} ${skinSel.value} ${customInp.value}`;
```

### 6️⃣ Voice Control (`#voice-toggle`)
Safely toggles the `SenseEngine.enableVoice()` pipeline.

---

## ⚡ The JavaScript Logic

```javascript
document.addEventListener('DOMContentLoaded', () => {
    SenseEngine.init('test-bench');

    bench.addEventListener('mousedown', (e) => {
        const finalStyles = `${presetSel.value} ${skinSel.value} ${customInp.value}`;
        SenseEngine.spawn(soundID, e.clientX, e.clientY, finalStyles);
    });
});
```

We deliberately enforce `mousedown` instead of `click`. `mousedown` reacts immediately upon physical actuation, minimizing perceived browser latency while clicking repetitively across the test bench.

---

## ♿ Native Accessibility (A11y)
- The `<aside>` informs itself to readers via `<aside aria-label="Engine Config...">`.
- Interactive regions apply `role="application"`.
- Action toggle buttons like the Voice Controller dynamically supply `aria-pressed` boolean states to virtual readers.

---

## 🛠️ Modding or Hacking the Lab

If you wish to orchestrate heavy automated tests, you can build an **Auto-Spawning loop**:

```javascript
// Stress-Testing the browser's local Garbage Collector
setInterval(() => {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    SenseEngine.spawn("boom", x, y, "ono-fire skin-glitch");
}, 300);
```

You can optionally override the grid's `<style>` logic over `<main id="test-bench">` by appending a solid image of your game level utilizing `background-image: url('my-stage.jpg')` to execute trustworthy preliminary check-ups prior to hard integration.
