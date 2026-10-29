# SDD ledger — plan: docs/superpowers/plans/2026-10-29-monotributodev.md
Ejecución nativa tras confirmación del usuario. Proyecto nuevo en feature/initial-site; no había checkout previo que aislar.
Pre-flight: guía, simulador y aportes comparten IDs editoriales; no compartir datos financieros con formulario de comunidad o issues.
Ruling: usar un nuevo repositorio aislado en monotributodev/ — workspace original sin Git ni código — sin cambios a ramas existentes.
Ruling: importador CUIT en Python estándar en vez de mjs — permite leer XLSX reproduciblemente sin dependencia extra — requiere Python al regenerar el dataset.
Tasks 1–3: lógica de catálogo, rutas, simulación y aportes comprobada con tests RED (módulos ausentes) → GREEN. UI pendiente de revisión en navegador.
Task 4: fuente oficial importada, 899 registros; prueba de integridad ejecutada.
Task 9: D1 creado en cuenta personal elegida por el usuario; backend con validación, moderación, límites y Turnstile. Pruebas con SQLite real: agregados excluyen pendientes, duplicados idempotentes y límite de frecuencia.
Ruling: moderación desde el panel autenticado de Cloudflare D1, sin endpoint administrativo público — evita introducir un segundo login — requiere acceso del mantenedor a Cloudflare.
Diagnóstico despliegue: --outdir se resolvió relativo a community-api; el artefacto está en .monotributodev-api-bundle del repo. Se comprobó exit_code y node --check antes de reintentar con el código correcto; no se creó un segundo widget.
