# MonotributoDev Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir y publicar el sitio estático que convierte una selección plataforma → banco en instrucciones documentadas, con simulador, CUIT-país, orientación provincial y aportes comunitarios.

**Architecture:** React con el starter web de Product Design, datos editoriales separados de componentes y lógica de cálculo pura. Build estático para GitHub Pages y dominio monotributodev.com.ar. El usuario eligió puntuaciones directas: agregar API separada propuesta en Cloudflare Worker + D1; solo se envía la experiencia que el visitante decide publicar, nunca el estado del simulador. GitHub permanece como canal de cambios documentales.

**Tech Stack:** React 19, Vite, CSS, Node test runner, GitHub Issue Forms y Actions para Pages. Mantener intacto el soporte Sites de la plantilla; el despliegue solicitado es GitHub Pages.

**Spec:** ../specs/2026-10-29-monotributodev-design.md

## Global Constraints

- Sitio público en monotributodev.com.ar, código en hlopez94/monotributodev y despliegue inicial en GitHub Pages.
- El wizard supone monotributo ya activo; alta e IIBB tienen recorridos separados.
- Confirmado por el usuario: para exportaciones de servicios usar Factura E y enlazar junto a esa explicación https://www.arca.gob.ar/monotributo/exportacion-servicios/. No ofrecer Factura C como alternativa por ausencia de SWIFT.
- «Facturá el importe del servicio cobrado originalmente, no el neto que llega a Argentina».
- Estados «SIN INFO · APORTÁ» para contenido ausente; ninguna ruta no verificada obtiene instrucciones inventadas.
- No persistencia de importes ni datos financieros por defecto, sin analytics. Única excepción: envío voluntario a API de experiencias y verificación antiautomatización, sin datos financieros del wizard/simulador.
- Plazo normativo desde la percepción original; no calcular vencimiento sin calendario bancario adecuado.
- El CUIT-país se obtiene de fuente oficial y se conserva como texto, distinguiendo las clases de persona.

## Review Focus

- Cambiar banco conserva el estado de lectura, pero nunca muestra SWIFT o pasos del banco anterior: Task 2.
- Gastos de recepción y envío no convierten el neto de la plataforma en precio del servicio: Task 3.
- Búsqueda con tildes y clases de persona distintas no entrega el primer CUIT sin contexto: Task 4.
- Datos introducidos por el visitante no aparecen en URL de un issue: Task 5.
- Acceso desde dominio propio y desde ruta de proyecto Pages no pierde assets ni navegación: Task 7.

---

## Estructura

Crear la aplicación en `monotributodev/` dentro del workspace, respetando el bootstrap de Product Design y sin sobrescribir el directorio de documentación. Al inicializar el repositorio, ubicar el historial y workflows en esa carpeta y copiar estas decisiones a su `docs/`.

- `src/App.jsx`, `src/styles.css`: composición y diseño aprobado.
- `src/data/{sources,banks,platforms,routes,provinces,cuit-countries}.json`: contenido con evidencia y estados.
- `src/lib/{routes,simulation,cuit-search,contributions}.mjs`: lógica pura comprobable.
- `src/components/{RouteGuide,Simulator,BankDirectory,CountryCuit,ProvinceGuide,ContributionLink}.jsx`: unidades de UI.
- `tests/{routes,simulation,cuit-search,contributions,content}.test.mjs`: invariantes relevantes.
- `scripts/import-cuit.mjs`, `data/sources/`: importación reproducible, copia de fuente pública y metadatos.
- `.github/ISSUE_TEMPLATE/`, `.github/workflows/pages.yml`, `public/CNAME`, `README.md`, `CONTRIBUTING.md`: publicación y colaboración.

### Task 1: Base visual y contenido con procedencia

**Files:** starter Product Design, `src/App.jsx`, `src/styles.css`, `src/data/*.json`, `tests/content.test.mjs`.

**Interfaces:** registros con `id`, `name`, `status`, `sourceIds`, `reviewedAt`; fuentes con `id`, `url`, `publisher`, `checkedAt`. Estados `verified`, `partial`, `missing`.

- [ ] Leer spec, plantilla y skills de ejecución/verificación. Comprobar AGENTS y estado remoto antes de bootstrap. El remoto devolvió 404 durante planificación: comprobar si ya existe antes de crearlo como público.
- [ ] Crear la app con `/home/her38/.codex/plugins/cache/openai-curated-remote/product-design/0.1.56/scripts/bootstrap-prototype.mjs`, instalar dependencias y registrar decisiones duraderas en su AGENTS.
- [ ] Escribir prueba que rechace contenido `verified` sin fuente y fuentes no definidas; ejecutar `node --test tests/content.test.mjs` y confirmar fallo por módulo/datos faltantes.
- [ ] Poblar los datos con fuentes oficiales investigadas y estados honestos; incluir otros bancos y plataformas como `missing` cuando no se tenga evidencia. No derivar compatibilidad de una lista de nombres.
- [ ] Reproducir la imagen elegida: fondo claro, verde, dos selectores, guía por ruta, pasos y aviso del plazo. Usar biblioteca de iconos con licencia apropiada, sin logos dibujados a mano.
- [ ] Ejecutar prueba hasta PASS y build inicial. Commit de base y fuentes, sin afirmar publicación.

### Task 2: Guía de ruta y directorio comparativo

**Files:** `src/lib/routes.mjs`, `src/components/RouteGuide.jsx`, `src/components/BankDirectory.jsx`, `tests/routes.test.mjs`.

**Interfaces:** `resolveRoute(originId, bankId, data) -> {status, steps, documents, sourceIds}`. Para ruta ausente devuelve `missing` y orientación general explícita; nunca reutiliza otra ruta.

- [ ] Escribir pruebas de Wise/Santander, cambio a BBVA, destino desconocido y ruta ausente: el cambio de destino elimina BSCHARBAXXX; ruta ausente no tiene pasos específicos ni promesa de compatibilidad. Ejecutar test y confirmar FAIL.
- [ ] Implementar selección y cuatro pasos: cargar banco en plataforma, revisar/enviar, Factura E, acreditación. En cada campo indicar dato esperado y dónde obtenerlo. Mantener el aviso de 20 días desde cobro en origen.
- [ ] Integrar datos de destinatario publicados por cada banco; explicar cuándo se solicitan corresponsales. Evitar inventar etiquetas de la interfaz de plataforma no capturada.
- [ ] Crear comparativa por canal, formularios, soporte y costos, con evidencia fechada y experiencias separadas. Incluir búsqueda y estado «SIN INFO · APORTÁ».
- [ ] Ejecutar pruebas hasta PASS, comprobar navegar atrás/adelante y cambiar origen/destino. Commit.

### Task 3: Simulación y guía de Factura E

**Files:** `src/lib/simulation.mjs`, `src/components/Simulator.jsx`, `src/components/RouteGuide.jsx`, `tests/simulation.test.mjs`.

**Interfaces:** `simulate({serviceAmount, receiptFee, transferFee, intermediaryFee}) -> {invoiceAmount, platformNet, argentinaNet}` en centavos enteros; errores de validación diferenciados. `invoiceAmount = serviceAmount` para escenario simple, nunca netos. Casos parciales/agrupados muestran conciliación requerida, sin sugerir nueva emisión automática.

- [ ] Prueba: 200000 centavos de servicio, 0 recepción, 3000 envío, 0 intermediario → factura 200000 y neto Argentina 197000. Con recepción 2000, factura sigue 200000, neto plataforma 198000. Negativo, NaN y gastos mayores al bruto fallan; cero neto se admite. Ejecutar y confirmar FAIL.
- [ ] Implementar cálculo y validación, formato es-AR, importes de ejemplo rotulados y costos editables. La categoría o IIBB no se descuenta del neto de transferencia.
- [ ] Crear guía de campos de Factura E, emisor ARCA, país del cliente, CUIT-país, moneda y descripción; enlace a emisión oficial. Verificar Incoterms en fuente oficial antes de afirmar el detalle como regla; registrar pendiente si no se recupera.
- [ ] Mostrar advertencia del monto original junto al simulador, paso de factura y resumen final; usar el ejemplo 2000/30/1970.
- [ ] Ejecutar tests hasta PASS y verificar cálculo en UI. Commit.

### Task 4: Tabla CUIT-país

**Files:** `scripts/import-cuit.mjs`, `data/sources/`, `src/data/cuit-countries.json`, `src/lib/cuit-search.mjs`, `src/components/CountryCuit.jsx`, `tests/cuit-search.test.mjs`.

**Interfaces:** `searchCountries(rows, query, personType) -> rows`; filas `{country, officialName, personType, cuit}`. Importación preserva la tabla original y metadatos de procedencia/cobertura.

- [ ] Importar la fuente oficial ya recuperada en `docs/research/arca-cuit-paises-2026-10-29.xlsx`, junto a su metadata `arca-cuit-paises-source.json`. La consulta oficial devuelve XLSX: 900 filas incluyendo encabezado, con CUIT, país, tipo de sujeto y referencia. El XLS antiguo devolvió 404. Validar cobertura y estructura sin reemplazar identificadores por números recordados.
- [ ] Pruebas de búsqueda sin tildes, por CUIT, vacío sin resultados y dos clases de persona del mismo país que permanecen distinguibles. Usar fixtures sintéticas separadas del catálogo público, sin presentar números de prueba como reales. Ejecutar y confirmar FAIL.
- [ ] Importar y mostrar tabla con filtros, botón copiar y confirmación accesible; enlazar desde paso Factura E. Si la fuente no puede recuperarse, mostrar cobertura pendiente y enlace oficial, reportando esa limitación al usuario.
- [ ] Ejecutar pruebas hasta PASS y comprobar conteo contra fuente, sin duplicados eliminados incorrectamente. Commit.

### Task 5: Aportes y formularios GitHub

**Files:** `src/lib/contributions.mjs`, `src/components/ContributionLink.jsx`, `.github/ISSUE_TEMPLATE/{experiencia,solicitar-info,corregir-info,problema-sitio}.yml`, `.github/ISSUE_TEMPLATE/config.yml`, `CONTRIBUTING.md`, `tests/contributions.test.mjs`.

**Interfaces:** `buildIssueUrl({kind, entityId, routeId, topic}) -> string`, contexto permitido a partir de IDs editoriales, base fija `https://github.com/hlopez94/monotributodev/issues/new`.

- [ ] Prueba URL con template existente, título codificado y entidad/ruta correcta; rechazar campos arbitrarios de importe/CUIT/CBU y evitar parámetros duplicados. Ejecutar y confirmar FAIL.
- [ ] Crear Issue Forms en español para experiencia, solicitud de info, corrección normativa y bug. Pedir fecha, canal, ruta y fuente; no pedir datos personales ni documentos privados. No depender de labels inexistentes.
- [ ] Integrar «SIN INFO · APORTÁ» y «¿Considerás que podemos mejorar esta info? Aportá acá» en fichas, rutas, provincias y contenido de factura/CUIT.
- [ ] Verificar que el visitante ve/revisa el formulario en GitHub y debe enviarlo por sí mismo; no publicar issues automáticamente. Tests PASS y validación de YAML. Commit.

### Task 6: Orientación tributaria separada

**Files:** `src/components/ProvinceGuide.jsx`, `src/data/provinces.json`, `src/data/sources.json`, `tests/content.test.mjs`.

**Interfaces:** ficha provincial `{id,name,agencyUrl,status,exportOnly,mixedIncome,procedures,sourceIds,reviewedAt}` para las 24 jurisdicciones; contenido nacional de alta enlazado a ARCA.

- [ ] Prueba de 24 jurisdicciones únicas y prohibición de procedimientos afirmativos en estado `missing`. Caso mixto nunca hereda automáticamente «IIBB cero» de exportación exclusiva. Ejecutar y confirmar FAIL.
- [ ] Crear recorrido provincial y alta monotributo por separado. Priorizar evidencia en Buenos Aires, CABA, Entre Ríos y Córdoba; cada faltante ofrece consulta/aporte y organismo oficial.
- [ ] Aclarar exclusión/no sujeción/exención, presentaciones y recaudaciones por separado; no recomendar categoría A ni salir del unificado universalmente.
- [ ] Ejecutar tests hasta PASS, revisar fuentes y dejar preguntas abiertas del hilo visibles sin respuestas fabricadas. Commit.

### Task 7: QA y publicación GitHub Pages

Antes de ejecutar esta tarea, completar las tareas 8 y 9 agregadas por las últimas ampliaciones del usuario. El orden numérico conserva referencias del plan previo; el despliegue siempre es el último paso.

**Files:** `.github/workflows/pages.yml`, `public/CNAME`, `README.md`, `design-qa.md`, pruebas de build y navegación.

**Interfaces:** `npm run build` conserva salidas del starter; Pages publica `dist/client`. En dominio propio base `/`; si se previsualiza en `/monotributodev/`, configurar base de build según destino sin romper assets.

- [ ] Probar URLs de assets generadas bajo `/` y `/monotributodev/`; verificar navegación por anclas y carga inicial sin depender de fallback SPA.
- [ ] Preparar Actions con acciones oficiales verificadas, permisos mínimos `contents: read`, `pages: write`, `id-token: write`, y Pages environment. CNAME `monotributodev.com.ar`. No modificar DNS sin comprobar situación del dominio.
- [ ] Ejecutar `node --test tests/*.test.mjs`, `npm run build` y `npm run test:sites`. Comprobar resultados, no inferir éxito de salida parcial.
- [ ] Abrir preview con el navegador permitido; probar selectores, ruta sin info, cálculos, CUIT, aportes, provincias, teclado y móvil. Comparar misma vista y estado contra imagen elegida. Corregir P0/P1/P2 y guardar `design-qa.md` con resultado.
- [ ] Revisar README, privacidad y contenido público sin secretos. Conservar documentación de decisiones y metadatos de fuentes. No atribuir datos de terceros a licencia propia.
- [ ] Crear repo público solo si no existe y hay autorización disponible; subir sin sobrescribir trabajo remoto. Habilitar Pages y comprobar ejecución real. Si faltan permisos o DNS, entregar preview y estado exacto sin afirmar que el dominio funciona.
- [ ] Commit final; entregar URL verificada, estado del repo/Pages, pruebas y límites materiales. No crear PR si se trata de la primera publicación en repo nuevo; si se crea una PR por existir historial, adjuntarla al chat.

### Task 8: Matriz de casos cripto y nuevas plataformas

**Files:** `src/data/routes.json`, `src/data/platforms.json`, `src/data/sources.json`, `src/lib/routes.mjs`, `tests/routes.test.mjs`, `docs/research/rutas-ampliadas.md`.

**Interfaces:** cada ruta compuesta contiene `legs`, `incomeKind`, `invoiceEvidence`, `exchangeEvidence`, `operationalStatus`. Los estados se evalúan por separado: una integración disponible no significa cumplimiento cambiario confirmado.

- [ ] Investigar en fuentes oficiales de Deel, Wallbit, Nexo Argentina y Nexo internacional los tramos enumerados en la spec, conservación de comprobantes y origen admitido. No asumir que todas las cuentas USD reciben transferencias desde exchanges.
- [ ] Pruebas: exportación cobrada por retiro local ARS no devuelve Factura C; venta de cripto propia no crea Factura E por servicio; plataforma como ordenante no reemplaza al cliente fiscal; cuenta propia añade conciliación; ruta cripto pendiente no queda «cumple» solo por terminar en SWIFT. Ejecutar y confirmar FAIL.
- [ ] Implementar árbol de clasificación y matriz con evidencia por tramo; marcar dudas como revisión profesional, mantener los casos visibles y posibilidad de aportar información. No incluir instrucciones P2P.
- [ ] Agregar regla de documentación que no prometa «solo factura» por remitente empresa, y aviso del autor no contador. Ejecutar pruebas hasta PASS y revisar cada afirmación con su fuente. Commit.

### Task 9: Servicio de opiniones y puntuación directa

**Files:** `community-api/src/index.js`, `community-api/migrations/0001_reviews.sql`, `community-api/wrangler.jsonc`, `community-api/tests/reviews.test.mjs`, `src/components/{CommunityReviews,ReviewForm}.jsx`, `src/lib/community-api.mjs`, `docs/community-operations.md`.

**Interfaces:** `POST /reviews` recibe entidad/ruta, fecha de experiencia, dimensiones opcionales 1–5, duraciones opcionales en horas corridas, estado de operación, comentario, idempotency key y token antiautomatización. `GET /reviews?entity=...` devuelve solo aportes aprobados; `GET /ratings?entity=...` devuelve agregados con cantidad/ventana temporal. Ningún endpoint público modifica moderación. Propuesta técnica Cloudflare Worker + D1, conforme elección del usuario de servicio adicional.

- [ ] Leer skills Cloudflare Workers/D1/Turnstile y documentación vigente; revisar herramientas y cuenta disponibles antes de crear recursos. Cerrar autenticación del mantenedor para moderar y política de retención; no exponer un panel admin sin protección.
- [ ] Escribir tests de puntajes fuera de 1–5, ruta inexistente, duplicado idempotente, token inválido, frecuencia excedida, comentario pendiente invisible y agregado calculado solo con aprobados. Operación en curso no aporta una duración final. Ejecutar y confirmar FAIL.
- [ ] Crear esquema D1 con restricciones, consultas parametrizadas y unicidad por clave idempotente; validar dimensiones y tamaño de comentario en servidor. No IP cruda en almacenamiento; límites conservadores, pseudónimo de navegador y verificación Turnstile en backend. Documentar que estos controles no certifican una persona única.
- [ ] Implementar API con orígenes CORS permitidos explícitos y límites de payload; secretos solo en backend. Moderación y reporte de opiniones protegidos, textos tratados como texto. Explicar el destino de los aportes y la moderación antes del envío.
- [ ] Implementar formulario y vista con puntuación por velocidad/facilidad/atención, cantidades y fecha. Registrar tiempos por tramo como horas/días corridos reportados. Estado «sin opiniones» con datos vacíos, carga/error/reintento sin falsos éxitos ni datos de muestra en producción.
- [ ] Ejecutar pruebas de API, migraciones locales y UI; probar límites y que comentarios pendientes no se filtran. Verificar guías siguen disponibles al caer la API. Commit.
- [ ] Crear/deplegar servicio solo con configuración y acceso disponibles; validar un envío real autorizado de prueba sin contaminar promedios públicos. Si falta acceso a infraestructura, conservar frontend y explicar exactamente lo pendiente. Task 7 publica frontend después de esta verificación.

## Auto-revisión del plan

Cobertura comprobada contra el diseño: rutas, simulación, documentación/facturación, directorio país, comparativas, colaboración, provincias y publicación tienen tareas asignadas. Los cinco riesgos de Review Focus cuentan con verificaciones en sus tareas. Imágenes revisadas cambian solo la presentación; los datos fiscales y bancarios siempre dependen de las fuentes.

## Estado

Plan preparado. La skill writing-plans requiere revisión del usuario y elección del método antes de implementar. Se recomienda ejecución nativa para esta app estática con datos y UI estrechamente relacionados; sin subagentes implementadores por defecto.
