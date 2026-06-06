# 🎨 sense-engine.css — Documentación Técnica

Sistema de estilos de **SenseEngine**. Define la apariencia visual, la animación y el comportamiento de cada onomatopeya generada por el motor. Está dividido en cuatro capas independientes que se combinan entre sí: **estructura base, animaciones, naturalezas y skins (apariencias)**.

---

## 🧱 Arquitectura General

Cuando el motor genera una onomatopeya, crea un `<div>` con clases apiladas:

```html
<div class="sense-ono  [nature]  [skin]  [custom-class]">¡BOOM!</div>
```

> [!NOTE]
> El CSS está diseñado para que estas capas no interfieran entre sí: la naturaleza define el color y la animación, la skin modifica la textura visual por encima, y la clase personalizada puede agregar cualquier sobreescritura adicional. `.sense-ono` es siempre el contenedor base para todas ellas.

---

## 🏗️ Capa 1 — Estructura Base (`.sense-ono`)

```css
.sense-ono {
    position: absolute;
    pointer-events: none;
    user-select: none;
    font-weight: 900;
    font-size: 2rem;
    z-index: 1000;
    white-space: nowrap;
    display: inline-block;
}
```

**Cada propiedad tiene un propósito específico:**

- `position: absolute` — posicionado en relación al contenedor del motor, no al documento. JS maneja el posicionamiento preciso usando `getBoundingClientRect()`.
- `pointer-events: none` — puramente decorativo, previniendo interferencias de la caja de colisión (hit-box) con elementos interactivos del juego.
- `user-select: none` — bloquea el resaltado de texto manual con el mouse.
- `font-weight: 900` — establece el peso máximo de negrita, asegurando la sensación de impacto de un cómic.
- `font-size: 2rem` — el tamaño predeterminado universal, que puede ser fácilmente sobreescrito.
- `z-index: 1000` — pinta la cadena estrictamente por encima de todas las capas de la interfaz de usuario subyacentes.
- `white-space: nowrap` — evita que los sistemas de escritura largos (ej. árabe, hindi) se rompan en líneas y destruyan las animaciones.
- `display: inline-block` — estrictamente necesario para que las directivas `transform` (escala, rotación) funcionen en el texto.

---

## 🎬 Capa 2 — Animaciones Base

El archivo declara tres animaciones centrales reutilizables. Todas las 'naturalezas' las consumen; no hay animaciones incrustadas dentro de las clases de naturaleza individuales, a excepción de `glitch-anim`.

### 💥 `pop`
La animación estándar para eventos de impacto conceptuales.
```text
0%   → scale(0)   rotate(-10deg)  opacity 0
50%  → scale(1.4) rotate(5deg)    opacity 1
100% → scale(1)   rotate(0deg)    opacity 0
```

### 💨 `slideUp`
Utilizada para eventos etéreos o de retroalimentación de la interfaz de usuario.
```text
0%   → translateY(0)    opacity 1
100% → translateY(-60px) opacity 0
```

### ⚡ `flash`
Exclusiva de `ono-bolt`. Parpadeo de opacidad de alta velocidad infinito.

### 🌐 `glitch-anim`
Exclusiva de `skin-glitch`. Translaciones rápidas cíclicas con desplazamiento de ±2px.

---

## 🌪️ Capa 3 — Naturalezas (`ono-*`)

Las naturalezas definen el **significado visual del evento**: color, tamaño y animación. Hay 22 clases incluidas.

| Clase | Color Base | Animación | Duración | Uso Típico |
|:---|:---|:---|:---|:---|
| `ono-impact` | Blanco / Sombra roja | pop | 0.6s | Golpe genérico/impacto |
| `ono-fire` | Naranja | pop | 0.8s | Fuego, quemaduras |
| `ono-ice` | Cian | pop | 1.0s | Hielo, congelación |
| `ono-bolt` | Amarillo | flash | infinito | Electricidad, rayo |
| `ono-ui` | Verde Claro | slideUp | 0.8s | Acciones de la interfaz de usuario |
| `ono-toxic` | Verde Ácido | pop | 1.0s | Veneno, ácido |
| `ono-heal` | Blanco / Aura amarilla | slideUp | 1.2s | Curación / Restauración |
| `ono-cyber` | Cian monoespaciado | pop | 0.5s | Digital / Ciencia ficción |

> [!TIP]
> **Extendiendo propiedades:** Puedes sobreescribir manualmente `font-size`, `font-family`, o forzar `italic` para inclinar dinámicamente cualquier naturaleza (revisa `index.html` para experimentar con esto).

---

## 🎭 Capa 4 — Skins (`skin-*`)

Las skins modifican la **estética visual sin tocar el color base ni la física/animación**. Se apilan limpiamente en la parte superior. Hay 10 skins incluidas:

- `skin-cartoon`: Trazo negro grueso de 2px y sombra paralela. Puro estilo cómic.
- `skin-neon`: Efecto de brillo eléctrico que lee dinámicamente el color base heredado.
- `skin-glitch`: Ruido cibernético, los fotogramas sobrescriben la simulación.
- `skin-metal`: Gradiente lineal metálico impulsado por `background-clip`.
- `skin-pixel`: Compresión de interletraje (kerning) negativo imitando una estética *8-bit*.
- `skin-hollow`: Elimina el relleno interno por completo, mostrando únicamente el trazo exterior interactivo.
- `skin-sticker`: Efecto de pegatina troquelada manejado elegantemente a través de `paint-order: stroke fill`.

> [!CAUTION]
> **Cuidado con las sobreescrituras incompatibles.** Ej: el gradiente de `skin-metal` anula el color plano de `ono-magic`.

---

## 🧩 Cómo expandir el sistema CSS

### Agregando una nueva Naturaleza
```css
.ono-poison {
    color: #9b00ff;
    text-shadow: 0 0 12px #4b0082;
    font-style: italic;
    animation: slideUp 1.5s forwards;
}
```

### Agregando soporte para `prefers-reduced-motion`
El sistema incluye cumplimiento de accesibilidad incorporado para la reducción de movimiento a nivel del sistema operativo. Asegúrate de que cualquier fotograma clave (keyframe) nuevo o traslaciones pesadas estén cubiertas por el bloque de reglas `@media` final en el archivo principal:

```css
@media (prefers-reduced-motion: reduce) {
    .sense-ono,
    .sense-ono * {
        animation: sense-fade 0.4s forwards !important;
        transform: none !important;
    }
}
```
