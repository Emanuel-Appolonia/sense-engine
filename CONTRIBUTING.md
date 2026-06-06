# Contribuyendo a SenseEngine / Contributing to SenseEngine

[ES] Gracias por el interés en contribuir a **SenseEngine**. Este documento guía el proceso para realizar integraciones de manera sencilla y estandarizada, ya sea resolviendo errores, proponiendo mecánicas o expandiendo el universo visual y sonoro del motor.

[EN] Thank you for your interest in contributing to **SenseEngine**. This document guides the integration process in a simple and standardized way, whether by fixing bugs, proposing new mechanics, or expanding the engine's visual and sonic universe.

---

## Regla de Oro / Golden Rule

[ES] **El núcleo del motor (`src/sense-engine.js` + `src/sense-engine.css`) debe pesar menos de 1MB en su totalidad.** La optimización es la base del proyecto.

[EN] **The core of the engine (`src/sense-engine.js` + `src/sense-engine.css`) must weigh less than 1MB in its entirety.** Optimization is the foundation of the project.

---

## Índice / Table of Contents
1. [Proceso de Contribución / Contribution Process](#proceso-de-contribución--contribution-process)
2. [Guía Rápida / Quick Guide](#guía-rápida--quick-guide)
3. [Código de Conducta / Code of Conduct](#código-de-conducta--code-of-conduct)

---

## Proceso de Contribución / Contribution Process

1. **Fork:** Realizar un fork de este repositorio / Fork this repository.
2. **Branch:** Crear una rama con la funcionalidad: `git checkout -b feature/nombre-mejora` / Create a branch for the feature: `git checkout -b feature/feature-name`.
3. **Mod:** Realizar modificaciones usando **Vanilla JS** y **CSS Puro** / Make modifications using **Vanilla JS** and **Pure CSS**.
4. **Commit:** `git commit -m "feat: descripción breve"` / `git commit -m "feat: brief description"`.
5. **Push:** Subir los cambios al fork / Push changes to your fork.
6. **PR:** Abrir un Pull Request detallando la contribución y asegurando el cumplimiento del límite de peso / Open a Pull Request detailing the contribution and ensuring compliance with the weight limit.

---

## Guía Rápida / Quick Guide

### 1. Idioma / Language
[ES] Editar `src/sense-engine.js` y expandir `VOICE_BOX`.
[EN] Edit `src/sense-engine.js` and expand `VOICE_BOX`.

```js
"it": {
    dir: "ltr",
    lex: { "shot": "BAM!", "boom": "BUM!" },
    ui: { "click": "Clic", "ok": "Fatto" }
}
```

### 2. Sonido (Lexicon) / Sound (Lexicon)
[ES] Agregar el nuevo ID lógico a la propiedad `lex` de todos los idiomas.
[EN] Add the new logical ID to the `lex` property of all languages.

### 3. Naturaleza (Animación) / Nature (Animation)
[ES] Agregar una clase `.ono-` en `src/sense-engine.css`.
[EN] Add an `.ono-` class in `src/sense-engine.css`.

### 4. Skin (Textura) / Skin (Texture)
[ES] Agregar una clase `.skin-` en `src/sense-engine.css`.
[EN] Add a `.skin-` class in `src/sense-engine.css`.

---

## Código de Conducta / Code of Conduct

[ES] No se procesarán contribuciones que contengan onomatopeyas ofensivas, despectivas, políticas u obscenas. Se busca mantener la máxima compatibilidad para educadores y usuarios con neurodivergencias.

[EN] Contributions containing offensive, derogatory, political, or obscene onomatopoeias will not be processed. The goal is to maintain maximum compatibility for educators and users with neurodivergences.

---
**SenseEngine — Mapeo Sensorial Universal / Universal Sensory Mapping**
