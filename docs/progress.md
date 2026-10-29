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
Final review (independiente): P2 pérdida de banco/paso al visitar CUIT o simulador, reproducido en navegador: BBVA se reiniciaba a Santander. Se mantienen vistas de guía y simulador montadas en memoria; no se persisten datos financieros.
Final: P2 CUIT mapeo invertido confirmado contra PDF oficial ARCA CUIT-pais.pdf y manuales ARCA. Prueba EEUU 55000002126=jurídica,50000002124=humana RED→GREEN. Importador ahora usa la leyenda E/F del XLSX oficial en vez de un mapeo supuesto. No se infiere tipo por prefijo.
Final: P2 acción de opiniones para “Otro” inválida: se elimina esa acción; mantiene solicitud de información por GitHub.
Final: minor (deferred): reintentos con igual idempotency key consumen el límite diario antiabuso aunque no creen otra opinión; la API devuelve confirmación si hay cupo y nunca duplica el registro.
CI primera publicación: falló prueba de empaquetado porque npm test incluía test:sites antes de construir en un checkout limpio. Se separaron unitarias/API de empaquetado. Se ejecutó npm test con dist temporalmente ausente para reproducir un checkout limpio: PASS. Workflow conserva build y luego test:sites.
Prueba pública: la API y la lectura de opiniones funcionan. Se detectó que la entrada de fecha mediante controles accesibles no actualizaba el estado controlado antes de otro render; el servidor rechazaba la fecha vacía. Se añadieron onInput/onBlur y actualizaciones funcionales del formulario. Reproducción en navegador pasó de atributo vacío a fecha conservada 2026-10-28; suite verde. La verificación de envío público se repite sobre el despliegue actualizado.
