# ⚙️ sense-engine.js — Documentación Técnica

Script principal del motor **SenseEngine**. Aloja toda la lógica para resolver las onomatopeyas, el sistema de renderizado DOM asíncrono, el diccionario multilingüe, la cola de accesibilidad estricta para lectores de pantalla y el módulo de síntesis de voz nativo. Es el único archivo JavaScript que compone el sistema — **cero dependencias, sin pasos de compilación, sin empaquetado externo.**

---

## 🏛️ Arquitectura Genérica

El motor está envuelto completamente como una **IIFE** (_Expresión de Función Ejecutada Inmediatamente_) aislando un objeto global solitario `SenseEngine` que contiene la API pública. Cada variable interna reside exclusivamente dentro de los límites del cierre (closure), haciéndolo inaccesible a los desarrolladores o extensiones del navegador, otorgando estricta protección contra manipulaciones a los estados internos.

```text
SenseEngine (Objeto Singleton)
│
├── API Pública
│   ├── init()
│   ├── setLanguage()
│   ├── spawn()
│   ├── enableVoice()
│   ├── disableVoice()
│   └── setVoiceParams()
│
└── Internos (Closure Privado)
    ├── config            { lang, container, voice, voiceRate, voicePitch }
    ├── VOICE_BOX         Diseño maestro de 8 diccionarios
    ├── _LANG_BCP47       Enrutador de idiomas para identificadores BCP-47
    ├── _speak()          Envoltura de síntesis de voz
    ├── _ariaQueue        Array de cola FIFO para lectores de pantalla
    ├── _ariaActive       Bandera de Procesamiento de la Cola
    └── _processAriaQueue() Recolector de basura asíncrono para ARIA
```

---

## 🔒 Estado Interno (`config`)

```javascript
let config = { lang: 'es', container: null, voice: false };
```

El bloque `config` actúa como la única fuente de la verdad. Propiedades:

| Propiedad | Tipo | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `lang` | string | `'es'` | Contexto del idioma activo. Las claves coinciden estrictamente con `VOICE_BOX`. |
| `container` | Element/null | `null` | Punto de anclaje de renderizado. `spawn()` se comporta inactivo hasta que `init()` se dispara. |
| `voice` | boolean | `false` | Activa/Desactiva las lecturas de síntesis en tiempo real. |
| `voiceRate` | number | `undefined` | Cadencia de voz. Se reduce a `1.2` de forma segura. |
| `voicePitch`| number | `undefined` | Tono de voz. Se reduce a `1.1` de forma segura. |

> [!NOTE]
> `voiceRate` y `voicePitch` se procesan de forma segura usando el operador `??` (Nullish coalescing). Esto permite que las entradas legítimas de `0` pasen por alto los valores predeterminados sin una falsa activación `falsy`.

---

## 📖 El Lexicón Maestro (`VOICE_BOX`)

La base de datos inmutable del framework.

### Estructura Base
```javascript
"es": {
    dir: "ltr",       // Dirección del DOM "ltr" o "rtl"
    lex: { ... },     // Gritos conceptuales y físicos del juego
    ui:  { ... }      // Textos de navegación y paramétricos
}
```

> [!IMPORTANT]
> El motor aísla fundamentalmente la lógica entre `lex` (Golpes, Magia, Fuego) y `ui` (Guardar, Cargar, Vacío). A través de la ejecución de `spawn()`, busca nativamente en `lex`; mapear a través de `ui` actúa como una segunda red de seguridad a prueba de fallos.

### BD de Sonido Parcial `lex`

| ID Lógico | Español | English |
| :--- | :--- | :--- |
| `shot` | ¡PUM! | BANG! |
| `slash` | ¡ZAS! | SLASH! |
| `boom` | ¡BOOM! | BOOM! |
| `fire` | ¡FUEGO! | BURN! |
| `magic`| ¡SHIN! | SPARK! |

*(Para el listado completo de más de 40 cadenas, inspecciona el Objeto JS interno).*

---

## 🌐 Flujo Público (API)

### `init(id)`
Vincula la envoltura del motor. Si un ID no válido falla en coincidir, utiliza el `document.body` por defecto para prevenir errores visuales catastróficos. **El host debe depender estrictamente de las propiedades de posición CSS relativas/absolutas.**

### `setLanguage(lang)`
Actualiza la lógica de orientación global de la página automáticamente (Cambio necesario para la lógica RTL como Árabe/Hebreo): `document.documentElement.setAttribute('dir', VOICE_BOX[lang].dir);`.

> [!TIP]
> Para comprender completamente cómo manejar diseños complejos, coordenadas y cambios de dirección, consulta la guía de i18n y RTL ([**ES**](./i18n-guia.md) / [**EN**](./I18N-GUIDE.md)).

### `spawn(key, x, y, style)` -> El núcleo reactivo

1.  **Resuelve texto sin procesar:** Devuelve la cadena `"ID_NOT_FOUND"` si falta — fallar silenciosamente no es una opción durante los entornos de desarrollo.
2.  **Generación de Nodo DOM:** Sintetiza nodos `aria-hidden="true"` evitando la duplicación del lector.
3.  **Matemática Absoluta:** Inyecta coordenadas a través de `container.getBoundingClientRect()`.
4.  **Protocolo del Recolector de Basura:**
```javascript
const animDuration = parseFloat(getComputedStyle(el).animationDuration) * 1000 || 1200;
setTimeout(() => { if (el && el.parentNode) el.remove(); }, animDuration + 100);
```
> [!CAUTION]
> El recolector de basura rastrea nativamente los puntos finales de duración CSS calculados. Para instancias de iteraciones rápidas, absténgase de forzar límites de traducción `infinite` dentro de `sense-engine.css` para evitar escenarios de fugas de memoria en dispositivos específicos.

---

## 🎙️ Síntesis y Acceso (A11y)

### `enableVoice()` / `disableVoice()`
Controla la puerta de acceso de la API de Web Speech `SpeechSynthesisUtterance`.

### `_processAriaQueue()` [Ámbito Privado]
Bucle lógico FIFO altamente restrictivo. Evita errores nativos estándar del navegador:
```text
_ariaQueue.push(text)
    ↓
Limpia Lector Virtual Destino => (Retraso forzado de Timeout 50ms)
    ↓
Reinyecta instrucción textual => (Largo Timeout de 600ms)
    ↓
Itera retrasos recursivos (Vacía Arrays de Pila)
```
_Esto resuelve por completo los conflictos arquitectónicos con **JAWS y NVDA** al omitir iteraciones de cadenas idénticas._
