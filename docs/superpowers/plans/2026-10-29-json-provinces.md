# JSON y provincias Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans, ejecución inline y revisión final independiente.

**Goal:** Catálogos mantenibles y guías provinciales prácticas, condicionales y con fuentes.
**Architecture:** JSON por tema; registro provinces.json más fichas provinces/*.json; adaptador mínimo para cargar guías. Componente presenta datos, helper elige DDJJ general/CM/confirmar.
**Tech Stack:** JSON, React, Node test; sin dependencias nuevas.
**Spec:** docs/superpowers/specs/2026-10-29-json-provinces-design.md

## Restricciones y revisión
- IDs de bancos, plataformas, fuentes y rutas estables; sin eval ni JSON minimizado.
- No generalizar salida del unificado o mensual0 a toda provincia.
- Separar ingresos locales; no retención no equivale a exención o cese.
- Fuente por sección, fecha, errores posibles y aporte contextual aun en faltantes.
- Revisar ingreso mixto, CM, régimen desconocido, provincia sin guía, cambio de provincia y móvil.

## Tareas
- [x] Tests RED de contratos JSON y políticas de presentación.
- [x] Convertir catálogos a JSON, actualizar imports y eliminar catálogos JS.
- [x] Contrastar material, escribir cinco fichas y guía CM; documentar divergencias y cómo aportar.
- [x] Presentar tres bloques con enlaces/aportes, régimen/actividad y aviso de errores; verificar tests/navegador/revisión.
- [x] Publicar en Pages y verificar versión pública.
