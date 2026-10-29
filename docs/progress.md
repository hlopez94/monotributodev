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
Prueba pública: la API y la lectura de opiniones funcionan. Se detectó que la entrada de fecha mediante controles accesibles no actualizaba el estado controlado antes de otro render; el servidor rechazaba la fecha vacía. Se añadieron onInput/onBlur y actualizaciones funcionales del formulario. Reproducción en navegador pasó de atributo vacío a fecha conservada 2026-10-28; suite verde. En el despliegue actualizado se verificó el envío real: confirmación visible, fila pending en D1 y cambio posterior a rejected por ser una prueba sintética. GET público mantiene 0 opiniones y promedios nulos.

Tasks 1–5: complete; UI, lógica, CUIT y formularios implementados y revisados.
Task 6: complete para el alcance publicado: selector de 24 jurisdicciones, ficha Buenos Aires parcial y faltantes explícitos con aportes; no se promete investigación completa.
Task 8: complete para el alcance publicado: casos compuestos visibles, separados de cumplimiento y con revisión pendiente cuando falta evidencia.
Task 9: complete; lectura y escritura reales verificadas desde GitHub Pages, Turnstile automático válido, moderación comprobada en D1 y prueba sintética excluida de publicación/promedios.
Task 7: repo público y primer despliegue Pages exitoso. Dominio propio sin resolución DNS, se conserva URL Pages hasta configurar dominio.

Cierre: 14 pruebas de lógica/API y 4 de empaquetado aprobadas; build y workflow Pages 40906030024 exitosos para 3b46acb. Captura publicada: docs/qa/public-site.png. Dominio propio pendiente de DNS. Reintentos y guías provinciales/casos sin evidencia conservan los límites indicados.

## Selectores y SWIFT — actualización 29/10/2026
Solicitud del usuario seguida con cambios acotados sobre el diseño existente. Plan: docs/superpowers/plans/2026-10-29-selectors-swift.md.
- Tests RED→GREEN: banco independiente de ruta y documentación según ordenante; 16/16 suite lógica/API, 4/4 empaquetado, build correcto.
- Logos reales de sitios oficiales guardados localmente y con procedencia. Selectores combobox/listbox con selección, teclado, cierre y fallback visual.
- Cuatro pasos para combinaciones incompletas; no se interpreta presencia de guía como confirmación de compatibilidad. Coordenadas desconocidas no heredadas, aportes por campo.
- Pasos 2/3 comunes; paso 4 con ordenante editable, cuenta espejo/trazabilidad, cliente, plataforma o desconocido. Fuente Wallbit confirma cierre mensual y soporte para mes en curso.
- Revisión independiente selectors_review: sin Critical/Important. Revisión manual móvil y escritorio; evidencia en design-qa.md.
Final: minor (deferred): typeahead del selector no recorre coincidencias al repetir letras ni permite búsqueda por palabras con espacios.
Final: minor (deferred): combinación Cliente directo + cuenta propia menciona resumen de Cliente directo en vez de identificar el proveedor de cuenta externa; verificar con COMEX y usar cuenta real.
Final: minor (deferred): teclado/foco/cierre del combobox comprobados manualmente, pendiente automatización del navegador.
