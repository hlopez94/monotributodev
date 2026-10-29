# Simulador por bloques Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans inline y revisión final independiente.

**Goal:** Componer transferencias y conversiones con costos por tramo.
**Architecture:** JSON de nodos/métodos/tarifas/escenarios; motor puro BigInt y helpers de sugerencias; React por bloques y resultado.
**Tech Stack:** React, JSON, Node test, CSS existente. Sin dependencias.
**Spec:** docs/superpowers/specs/2026-10-29-route-simulator-design.md

## Restricciones y revisión
- Referencias oficiales no son ejemplos del usuario; tarifas desconocidas nunca cero tácito.
- Monedas/decimales/red/porcentaje fijos explícitos; externos separados; no sumar USD+ARS.
- Cargos receptor0 solo encuadre USD/SWIFT/PH residente argentino; corresponsales separados.
- Cambios de topología no conservan tarifas de otro tramo; montos y navegación conservan estado.
- Revisar varios tramos, fondos insuficientes, cotización vacía, conversión establecoin, red pagada aparte, móvil y fuentes.

## Tareas
- [x] Tests RED de motor, redondeo, gastos aparte, invalidez y catálogos.
- [x] Catálogos JSON y motor GREEN.
- [x] UI bloques y ejemplos editables, desgloses, fuentes y aportes.
- [x] Tests, build/empaquetado, navegador y revisión independiente; publicar Pages.
