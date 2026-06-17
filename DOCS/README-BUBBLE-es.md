# 🫧 SenseEngine: Bubble System (BETA)

> [!WARNING]
> **Estado:** BETA / En desarrollo activo.
> La API de este módulo puede sufrir cambios en futuras iteraciones.

El **Bubble System** es un módulo arquitectónico avanzado introducido en SenseEngine v1.0 que permite sobreyectar onomatopeyas dentro de globos de diálogo dinámicos (estilo cómic, manga o webtoon). 

Fiel a la filosofía de SenseEngine, este sistema **no requiere de archivos de imagen (ni JPG, ni PNG, ni SVG externos)**. Toda la geometría visual está construida exclusivamente a base de matemáticas en CSS puro (`clip-path`, `box-shadow`, `border-radius`, etc.), garantizando que el peso del motor siga por debajo de 1MB y que el rendimiento gráfico (FPS) sea impecable.

## 📐 Arquitectura Adaptativa (El Nido DOM)
Para garantizar legibilidad absoluta y consistencia visual, el sistema utiliza un modelo de DOM anidado y *Z-Index* apilado:

```html
<div class="sense-container">
    <div class="sense-bubble sense-variant-cyberpunk sense-layout-scream sense-anim-cyberpunk">
        <span class="sense-text sense-lang-es sense-ono ono-fire">¡BAM!</span>
    </div>
</div>
```

**Ventaja Clave:** Al inyectar el nodo de texto *dentro* del nodo de la burbuja y utilizar propiedades Flexbox (`inline-flex` + `padding`), la burbuja geométrica se **auto-escala matemáticamente** según el ancho de la palabra. Una onomatopeya en Tailandés pequeña tendrá un globo ajustado, mientras que un chillido largo en Suajili provocará que la burbuja se estire dinámicamente.

---

## 🎨 Combinatoria Visual: Variantes + Layouts

El Bubble System divide la estética visual en dos propiedades combinables, otorgando decenas de resultados distintos.

### 1. Color y Estética (`variant`)
Controla la paleta de colores, sombras, brillos (neón) y el marco del contenedor. También define la animación acelerada por hardware de entrada.
- **`comic`**: Estilo americano (fondo amarillo vibrante, bordes duros negros). Animación `bubble-pop`.
- **`cyberpunk`**: Estética oscura con brillos de neón turquesa. Animación `bubble-glitch`.
- **`sharp`**: Estética de impacto violento o sangre (rojo y blanco). Animación `bubble-flash`.
- **`cloud`**: Estética suave, etérea y redonda. Animación `bubble-float`.

### 2. Forma Geométrica (`layout`)
Define el recorte estructural del contenedor mediante CSS `clip-path` o `border-radius`. Existen 10 formas base:

| Layout | Descripción (Inspiración) |
|---|---|
| `speech` | Óvalo clásico de diálogo occidental. |
| `thought` | Píldora suave o nube de pensamiento. |
| `scream` | Estrella irregular puntiaguda (Terror / Grito). |
| `whisper` | Forma suave con borde punteado (`dashed`). |
| `impact` | Explosión radial pesada (Manga Shonen). |
| `speed` | Estructura inclinada para acción rápida. |
| `angst` | Caja inestable o destartalada. |
| `webtoon` | Cápsula vertical limpia y pulida. |
| `narrator` | Bloque cuadrado rígido de doble marco. |
| `cyber` | Diamante / Octógono con esquinas cortadas. |

---

## 💻 Uso en JavaScript

Para utilizar el Bubble System, se pasa un objeto de configuración en lugar del típico string de estilo al llamar a `spawn`. El motor detectará el objeto automáticamente (retrocompatible).

```javascript
SenseEngine.spawn('boom', x, y, {
    style: 'ono-fire skin-cartoon', // La naturaleza clásica de la palabra
    bubble: {
        variant: 'cyberpunk', // Color/Bordes/Animación
        layout: 'scream',     // Forma del Globo
        animated: true        // Activar la animación de entrada de la burbuja
    }
});
```

## ⚡ Límite de Rendimiento (Hard Cap)
Para evitar bloqueos por consumo de memoria (*Memory Leaks* / *OOM*) provocados por Auto-Clickers o comportamientos irregulares del usuario, el sistema de burbujas cuenta con un límite interno de **50 nodos simultáneos**. Si hay más de 50 burbujas procesándose en pantalla a la vez, los siguientes eventos serán descartados hasta que las previas se destruyan a través del Garbage Collector.
