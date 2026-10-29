# Simulador automático Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans inline y revisión independiente final.

**Goal:** Solo monto y recorrido, con cotizaciones precargadas y pasos pequeños.
**Architecture:** Servicio de cotizaciones/pure parsing + snapshot/config JSON, resolver automático de tarifas/omisiones y vista compacta con ajustes optativos. Motor financiero actual conservado.
**Tech Stack:** React/JSON/fetch/Node tests, sin dependencias ni nuevos servicios.
**Spec:** docs/superpowers/specs/2026-10-29-automatic-simulator-design.md

## Límites y revisión
- Mercado compra/venta e EUR/USD diario no equivalen a cotización de plataforma.
- Error/red lenta/dato inválido: fallback por par con fecha y modo guardado; no refrescar fecha de datos viejos.
- Ningún desconocido se presenta como tarifa0; neto parcial visible si falta costo.
- Montos no salen del navegador. Ajustes manuales sobreviven a actualización de precios.
- Ocultar gastos0 incluso receptor, mantener gasto positivo en cualquier moneda/gas aparte.
- Revisar móvil, altura de filas, cambio de moneda/topología y no perder estado al navegar.

## Tareas
- [x] Tests RED parsing/caché-fallback/auto-precios/parcialidad/cero oculto.
- [x] JSON de fuentes/snapshot/estimaciones y resolver automático GREEN; EUR→USD.
- [x] Interfaz compacta, detalles optativos, precios activos solo en simulador, privacidad.
- [ ] Tests/build/empaquetado, navegador/revisión, publicar y verificar Pages.
