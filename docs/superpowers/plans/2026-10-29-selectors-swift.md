# Selectores y guía SWIFT Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement inline.

**Goal:** Selectores con marca y guía útil por banco y ordenante.
**Architecture:** EntitySelect reutilizable, datos bancarios en catálogo, funciones puras de documentación y coordenadas. RouteGuide presenta los cuatro pasos para toda combinación con advertencias explícitas.
**Tech Stack:** React 19, CSS, Node test.
**Spec:** docs/superpowers/specs/2026-10-29-selectors-swift-design.md

## Constraints and review focus
- Conservar diseño y estado. Sin códigos bancarios inferidos ni marcas dibujadas.
- Sin ruta documentada: mostrar coordenadas conocidas, no avalar compatibilidad.
- Banco sin BIC: SIN INFO y aporte, sin heredar otro banco.
- Ordenante distinto de cliente: no cambiar destinatario fiscal automáticamente.
- Teclado: abrir, navegar, seleccionar, Escape y Tab; móvil sin desbordes.
- Logos fallidos: fallback legible; assets locales sin tracking remoto.

## Tasks
- [x] Añadir pruebas RED de banco y documentación; implementar GREEN en domain/catalog.
- [x] Obtener logos de sitios oficiales, anotar origen; crear EntitySelect y estilos con foco y teclado.
- [x] Integrar selectores y cuatro pasos comunes; documentación dinámica y fuentes Wallbit.
- [x] Verificar navegador escritorio/móvil, suite, build y test:sites; revisar diff y publicar en Pages.
