# 🧪 index.html — Documentación Técnica

Laboratorio interactivo de **SenseEngine**. Es la interfaz de prueba oficial del motor: permite explorar en tiempo real todas las combinaciones posibles de idioma, ID de sonido, naturaleza visual, skin de diseño, clases custom y síntesis de voz, sin necesidad de escribir código. 

> [!NOTE]
> Se despliega directamente en GitHub Pages como demo pública del proyecto. **No es parte del motor** — es el entorno donde el motor se prueba. No necesitas modificarlo ni llevarte este archivo para usar SenseEngine en tu propio proyecto.

---

## 🎯 Para qué sirve

El laboratorio atiende dos necesidades distintas:

1. **Para quien evalúa el motor:** Permite ver y escuchar cualquier combinación antes de integrarlo en un ecosistema. En lugar de leer la documentación e imaginar cómo se vería `ono-fire` combinado con `skin-neon` en ruso, puedes probarlo directo.
2. **Para quien desarrolla el motor:** Cualquier _naturaleza_ nueva, _skin_ nuevo o _ID_ nuevo que se agregue al CSS o al JS puede verificarse visualmente aquí sin montar servidores complejos. Puedes inyectar CSS custom directamente desde el lab.

---

## 🏗️ Estructura del archivo

El archivo tiene tres bloques claramente delimitados:

```text
index.html
├── <head>
│   ├── Link → src/sense-engine.css
│   └── <style> — Estilos exclusivos del laboratorio
│
├── <body>
│   ├── <aside> — Panel de controles (sidebar)
│   │   ├── .header — Título y subtítulo
│   │   └── .config-group — Los 6 controles paramétricos
│   │
│   └── <main id="test-bench"> — Área de prueba (canvas)
│       └── .stats — Marca de agua
│
└── <script>
    ├── src/sense-engine.js — Importación del motor base
    └── Script inline — Lógica propia del laboratorio UI
```

---

## 🎨 Teminado Visual del Laboratorio (`<style>`)

```css
:root {
    --bg:     #0a0a0c;  /* Negro profundo del fondo general */
    --panel:  #16161a;  /* Gris oscuro del panel lateral */
    --accent: #00f2ff;  /* Cian que interconecta layouts y botones */
}
```

> [!TIP]
> Estas tres variables controlan toda la paleta del laboratorio. Si requieres incrustar este laboratorio en un proyecto claro, basta con alterar `--bg` y `--panel` con tus colores, y el layout completo se readaptará de manera unificada.

El área de pruebas `#test-bench` lleva `position: relative`, ya que el motor exige esto en su padre contenedor para descontar cálculos matemáticos absolutos del _bounding box_.

---

## 🎛️ Los 6 parámetros funcionales

### 1️⃣ Idioma (`#lang`)
Llama a `SenseEngine.setLanguage()` en tiempo real. Ajusta tanto la base de datos interna consumida como el modo `RTL` (Ej: Árabe).

### 2️⃣ ID de Sonido (`#sound-key`)
Expone el subconjunto de _Lexicons_ del motor. Ideal para probar gritos de daño o disparos rápidos eléctricos.

### 3️⃣ Naturaleza (`#preset-style`)
Expone gráficamente las clases `ono-*` nativas del `sense-engine.css`.

### 4️⃣ Skin Textural (`#skin-style`)
Inyecta sobreescrituras CSS que no dañan las físicas de la animación anterior. Pueden dejarse vacíos.

### 5️⃣ CSS Inyector (`#custom-class`)
Concena en crudo el texto introducido en tiempo real al motor de _spawn_. Ejemplo:
```javascript
const finalStyles = `${presetSel.value} ${skinSel.value} ${customInp.value}`;
```

### 6️⃣ Control de Voz (`#voice-toggle`)
Habilita el modo `SenseEngine.enableVoice()`.

---

## ⚡ La lógica JS del Laboratorio

```javascript
document.addEventListener('DOMContentLoaded', () => {
    SenseEngine.init('test-bench');

    bench.addEventListener('mousedown', (e) => {
        const finalStyles = `${presetSel.value} ${skinSel.value} ${customInp.value}`;
        SenseEngine.spawn(soundID, e.clientX, e.clientY, finalStyles);
    });
});
```

Usamos intencionalmente `mousedown` en lugar de `click`. `mousedown` reacciona instantáneamente al tacto, minimizando la latencia percibida del navegador durante un banco de pruebas intenso.

---

## ♿ Accesibilidad (A11y) Incluida
- El `<aside>` informa como `<aside aria-label="Panel de configuración...">`.
- El área interactiva está tagueada bajo `role="application"`.
- Los botones tipo toggle como la Voz incluyen `aria-pressed` informando su booleano al lector.

---

## 🛠️ Cómo adaptar o hackear el Lab

Si deseas armar bancos de pruebas automáticos, puedes recurrir al **Auto-Spawming Ráfaga**:

```javascript
// Prueba de estrés para el Garbage Collector local
setInterval(() => {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    SenseEngine.spawn("boom", x, y, "ono-fire skin-glitch");
}, 300);
```

También puedes sobreescribir la cuadrícula sutil en el `<style>` del `<main id="test-bench">` agregándole una imagen sólida o un fotograma de tu juego real mediante `background-image: url('tu-nivel.jpg')` para realizar comprobaciones previas fidedignas antes de migrar el sistema.
