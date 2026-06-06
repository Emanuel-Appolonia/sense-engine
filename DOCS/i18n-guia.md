# 🌐 Guía de Internacionalización (i18n) y RTL/LTR
> [**ES**](./i18n-guia.md) / [**EN**](./i18n-guide.md)


SenseEngine ha sido diseñado desde su concepción para ser un motor global. Esta guía explica cómo el sistema maneja múltiples idiomas, direcciones de texto y cómo extender estas capacidades.

---

## 🌍 Soporte Multilingüe

El motor utiliza un **Diccionario Maestro** (`VOICE_BOX`) que centraliza todas las traducciones. Cada entrada de idioma contiene:
- `dir`: Dirección del texto (`ltr` o `rtl`).
- `lex`: Diccionario de onomatopeyas para eventos físicos/juego.
- `ui`: Textos para elementos de interfaz de usuario.
- [**Lexicon Master Table**](./LEXICON-MASTER-ES.md): Tabla comparativa de todas las palabras en los 11 idiomas.

### Cómo agregar un nuevo idioma

Para añadir un idioma (ejemplo: Alemán), se debe extender el objeto `VOICE_BOX` en `sense-engine.js`:

```javascript
"de": {
    dir: "ltr",
    lex: { "shot": "PENG!", "boom": "KRACH!", ... },
    ui: { "click": "Klick", "load": "Laden...", ... }
}
```

---

## ↔️ Lógica RTL (Right-to-Left) vs LTR (Left-to-Right)

Cuando se selecciona un idioma como el Árabe (`ar`), SenseEngine realiza dos acciones críticas:

### 1. Inyección Automática de Dirección
El motor ejecuta automáticamente:
```javascript
document.documentElement.setAttribute('dir', 'rtl');
```
Esto cambia la dirección global del documento. Es vital para que los signos de puntuación y la estructura del texto se rendericen correctamente según las reglas gramaticales del idioma.

### 2. Sistema de Coordenadas
Una duda común es: *¿Debo invertir mis coordenadas X en modo RTL?*
**La respuesta es NO.**
SenseEngine utiliza posicionamiento absoluto respecto al contenedor:
- `x`: Distancia en píxeles desde el borde izquierdo.
- `y`: Distancia en píxeles desde el borde superior.

Incluso en modo RTL, el motor respeta la posición física enviada por el juego o la aplicación, asegurando que la onomatopeya aparezca exactamente donde ocurrió el evento sonoro.

---

## 🎨 Ajustes de CSS para RTL

El archivo `sense-engine.css` incluye soporte específico para ajustar el alineamiento interno del texto sin romper el posicionamiento:

```css
[dir="rtl"] .sense-ono {
    direction: rtl;
    text-align: right;
}
```

### Tips para personalización:
- **Iconos:** Si usas iconos junto al texto, considera usar `transform: scaleX(-1)` para espejarlos en RTL si son direccionales.
- **Paddings:** Evita `padding-left` o `padding-right`. Usa propiedades lógicas como `padding-inline-start` para que el navegador las maneje automáticamente según la dirección.

---

## 🎙️ Síntesis de Voz (BCP-47)

Para que la voz funcione correctamente, el motor mapea internamente el código de idioma a un código **BCP-47** válido para la Web Speech API:

| Motor ID | BCP-47 |
| :--- | :--- |
| `es` | `es-ES` |
| `ar` | `ar-SA` |
| `hi` | `hi-IN` |

Si agregas un idioma, asegúrate de actualizar también el mapa `_LANG_BCP47` interno.

---

## 📏 Métrica de Peso
SenseEngine mantiene una política estricta de ligereza:
- **Límite máximo:** 1MB.
- **Peso actual:** < 100KB (incluyendo lógica, estilos y documentación).
- **Dependencias:** 0.

---
**SenseEngine — Mapeo Sensorial Universal**

> [!NOTE]
> **Nota sobre el Lenguaje:** Debido a la vasta complejidad de los sistemas de escritura globales, cualquier inconsistencia ortográfica o lingüística es responsabilidad del estado actual del desarrollo y no ha sido intencionada. Se invita a la comunidad a reportar mejoras.
