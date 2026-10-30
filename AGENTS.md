# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Decisiones del producto

- Diseño elegido: opción 2, superficie clara, verde, tool-first. Visual refinado en docs/design-reference.png.
- Entrada principal: plataforma de cobro + banco de destino; guía específica por combinación.
- Exportaciones de servicios: Factura E con fuente ARCA; no ofrecer C como alternativa por ausencia de SWIFT.
- Factura del servicio original, costos separados; estado del wizard y simulador en memoria al navegar.
- Puntuaciones directas en servicio separado Cloudflare, no fake data. Moderación vía panel autenticado.
- Mantener tabla CUIT con la leyenda oficial, no inferir clase de sujeto por prefijo.
- Los huecos se marcan SIN INFO · APORTÁ y enlazan a Issue Forms.
- Repositorio público hlopez94/monotributodev; GitHub Pages como primer destino, dominio propio monotributodev.com.ar en Cloudflare DNS y GitHub Pages.

- Selectores de plataforma/banco con logos reales locales (public/brands/sources.json), lista con estilo propio y teclado. No usar marcas generadas ni dibujadas.
- Guía SWIFT: coordenadas por banco incluso sin ruta documentada; pasos 2/3 comunes. Falta de coordenadas explícita con aporte.
- Paso 4 según ordenante real: cuenta propia/espejo exige trazabilidad, cliente coincide con receptor fiscal cuando es quien contrató, procesador no determina a quién facturar. Wallbit: extracto mensual a mes cerrado; soporte para período en curso.

- Todos los catálogos editables son JSON legible con dos espacios, sin minimizar; temas separados y un archivo por provincia. Los módulos JS solo cargan datos o implementan reglas/UI.
- Cada procedimiento provincial debe tener fuentes disponibles, fecha/alcance y aporte contextual; avisar que puede haber errores. No generalizar salida del unificado ni DDJJ mensual/cero a todos; discriminar régimen, ingresos mixtos y CM.

- Simulador componible por tramos: separar método (ACH/wire/SWIFT/red/local), monedas y costos. Referencias JSON distintas de escenarios ilustrativos; desconocidos null, nunca cero implícito. Mantener fuentes, revisión y aporte.
- Cálculos monetarios con BigInt y redondeo único a precisión de moneda; gas pagado aparte no reduce envío. Comisión propia receptora 0 solo para encuadre PH residente SWIFT/USD banco argentino, cargos extranjeros documentados separados.

- Simulador principal automático y compacto: solo monto/plataforma/recorrido; tasas y costos precargados. Edición numérica adicional opcional en Ajustar. Desglose omite todo gasto cero.
- Referencias de mercado EUR/USD diario, USD/ARS MEP/cripto con fuente/fecha, compra/venta correctos y fallback fechado. No presentar referencia de mercado como cotización de plataforma. No enviar montos ni recorrido a APIs.
- Desconocidos se mantienen null en catálogo; si no hay estimación explícita, resultado parcial con cargos no incluidos visibles. Nunca obligar a llenar tarifas para usar los recorridos sugeridos.

- Simulador dinámico: cruzar capacidades de envío/recepción por moneda disponible, método y activo/red. Tarifas conocidas prevalecen; nuevas combinaciones no garantizan habilitación de cuenta. Cripto no se propone a receptores solo fiat. Wallbit checking excluye SWIFT entrante (usuario confirmó inversiones). Nexo SEPA acredita EURx; EURC requiere swap aparte.

- Selectores de entidades: A–Z con Otro al final; buscar al abrir si hay más de5 opciones, sin coincidencias ofrecer Otro. Comunidad reutiliza logos/selector. Puntajes con estrellas1–5 y estado con radios agrupados. CTA de opiniones destacado a la derecha, fuentes secundarias. Móvil: seis secciones visibles en grilla3×2, pasos de guía2×2, sin desborde de página; tablas desplazan dentro de su contenedor.

- Comunidad: solo entidades reales con reviewable:true en catálogos compartidos con el API. Excluir directo, cripto genérica, banco-usa genérico y otro (incluido Otro banco); no ofrecer genéricos ni como fallback de búsqueda en opiniones. El formulario abre en diálogo modal visible, con scroll interno, Escape/cierre y retorno de foco. Los reportes tienen confirmación/verificación dentro del diálogo.

- Directorio Bancos: mostrar solo bancos y plataformas reales, con puntajes por dimensión y cantidad de opiniones aprobadas. Compartir experiencia abre el diálogo directamente sobre la tarjeta, sin cambiar de sección; Comunidad conserva lectura detallada/reportes. Entidades faltantes se solicitan por issues, sin tarjetas de medios genéricos.

- Navegación principal: cinco accesos, sin Comunidad duplicada. Conservar #comunidad para enlaces previos y lectura desde tarjetas, con retorno a Bancos. Menú móvil en dos filas equilibradas (tres y dos).
