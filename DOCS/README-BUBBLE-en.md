# 🫧 SenseEngine: Bubble System (BETA)

> [!WARNING]
> **Status:** BETA / Active Development.
> The API for this module is subject to change in future iterations.

The **Bubble System** is an advanced architectural module introduced in SenseEngine v1.0 that overlays onomatopoeias inside dynamic speech bubbles (comic, manga, or webtoon styles).

True to SenseEngine's philosophy, this system **requires zero image assets (no JPG, PNG, or external SVGs)**. All visual geometry is built exclusively using pure CSS mathematics (`clip-path`, `box-shadow`, `border-radius`, etc.), ensuring the engine's footprint remains under 1MB with flawless graphic performance (FPS).

## 📐 Adaptive Architecture (DOM Nesting)
To ensure absolute readability and visual consistency, the system uses a nested DOM model with stacked *Z-Indexes*:

```html
<div class="sense-container">
    <div class="sense-bubble sense-variant-cyberpunk sense-layout-scream sense-anim-cyberpunk">
        <span class="sense-text sense-lang-en sense-ono ono-fire">BAM!</span>
    </div>
</div>
```

**Key Advantage:** By injecting the text node *inside* the bubble node and leveraging Flexbox properties (`inline-flex` + `padding`), the geometric bubble **automatically scales mathematically** based on the word's width. A short Thai word will generate a tight bubble, while a long scream in Swahili will dynamically stretch the container.

---

## 🎨 Visual Combinatorics: Variants + Layouts

The Bubble System splits visual aesthetics into two mixable properties, unlocking dozens of unique combinations.

### 1. Color & Aesthetics (`variant`)
Controls the color palette, shadows, glows (neon), and container borders. It also triggers hardware-accelerated entrance animations.
- **`comic`**: Western style (vibrant yellow background, hard black borders). `bubble-pop` animation.
- **`cyberpunk`**: Dark aesthetic with turquoise neon glows. `bubble-glitch` animation.
- **`sharp`**: Violent impact or blood aesthetic (red and white). `bubble-flash` animation.
- **`cloud`**: Soft, ethereal, and round aesthetic. `bubble-float` animation.

### 2. Geometric Shape (`layout`)
Defines the structural cutout of the container using CSS `clip-path` or `border-radius`. There are 10 base shapes:

| Layout | Description (Inspiration) |
|---|---|
| `speech` | Classic Western oval speech bubble. |
| `thought` | Soft pill or thought cloud shape. |
| `scream` | Spiky irregular star (Horror / Scream). |
| `whisper` | Soft shape with dashed borders. |
| `impact` | Heavy radial explosion (Shonen Manga). |
| `speed` | Skewed structure for fast action. |
| `angst` | Unstable, shaky, or broken box. |
| `webtoon` | Clean and polished vertical capsule. |
| `narrator` | Rigid square block with double frame. |
| `cyber` | Diamond / Octagon with precision cut corners. |

---

## 💻 JavaScript Usage

To use the Bubble System, pass a configuration object instead of the typical style string when calling `spawn`. The engine will detect the object automatically (backwards compatible).

```javascript
SenseEngine.spawn('boom', x, y, {
    style: 'ono-fire skin-cartoon', // The classic nature of the word
    bubble: {
        variant: 'cyberpunk', // Color/Borders/Animation
        layout: 'scream',     // Bubble Shape
        animated: true        // Trigger entrance animation
    }
});
```

## ⚡ Performance Limit (Hard Cap)
To prevent browser freezes or *Out Of Memory (OOM)* scenarios caused by Auto-Clickers or spamming, the bubble system features an internal hard cap of **50 simultaneous nodes**. If more than 50 bubbles are being rendered on screen at the exact same time, subsequent events will be ignored until the Garbage Collector cleans up the previous ones.
