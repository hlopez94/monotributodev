# Movimientos dinámicos Implementation Plan

**Goal:** Proponer destinos por intersección de moneda, método y red, conservando tarifas conocidas y costos desconocidos explícitos.
**Architecture:** JSON de capacidades de envío/recepción con fuentes y restricciones. Generador puro combina capacidades y reutiliza tarifas por firma; perfiles de cuenta y moneda acreditada separados. UI usa el mismo generador al agregar/cambiar; no infiere compatibilidad solo por moneda.
**Tech Stack:** React, JSON legible, Node test, motor BigInt existente.
**Spec:** Instrucción directa del usuario del29/10: WallbitUSD ofrece métodos compatibles, Wise no admite cripto; sumar Lemon/Takenos. Mantener cambios previos de Payo/Deel/SWIFT internacional ya implementados.

- [x] Investigar capacidades y redes de Lemon/Takenos; registrar envío/recepción y exclusiones conocidas, sin prometer habilitación por cuenta.
- [x] Tests RED: WallbitUSD→WiseACH/Wire; crypto solo activos/redes comunes; Wise no cripto; moneda disponible filtra; tarifas existentes prevalecen; desconocidos parciales; Wallbitchecking noSWIFTentrante.
- [x] Generador GREEN con ID estable, tarifas por dirección/método/monedas/red, estimaciones heredadas solo con evidencia. Cambios de recorrido invalidan posteriores como hoy.
- [x] UI integrar catálogo dinámico en agregar/selector/reset/fuentes. Mostrar origen y compatibilidad por confirmar. Lemon/Takenos reciben stablecoins; costos no confirmados null. Activos nuevos conservan identidad real al acreditar.
- [x] Verificar tests/build/empaquetado, navegador, publicar y comprobar sitio público.
