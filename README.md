# MonotributoDev

Guía comunitaria para devs argentinos que cobran servicios del exterior. Proyecto para **monotributodev.com.ar**; publicación inicial en GitHub Pages.

- Selector plataforma → banco con instrucciones y fuentes por ruta.
- Simulador por bloques: redes cripto, ACH, wire, SWIFT y conversiones, con tarifas fijas/porcentuales y costos externos separados. Ejemplos editables y referencias JSON con fuentes. La factura se refiere al servicio original, no al neto.
- 899 registros de CUIT-país oficiales de ARCA, con buscador y tipo de sujeto.
- Bancos, plataformas y provincias con estados documentado / parcial / sin info.
- Casos cripto y cobros locales separados de la clasificación fiscal y del régimen cambiario.
- Opiniones directas con puntuaciones, tiempos reportados y moderación en Cloudflare D1.
- Issue Forms para aportar información, corregir o solicitar una guía.

## Ejecutar

Requiere Node.js 24 y npm. `npm ci`, copiar `.env.example` a `.env.local` y ejecutar `npm run dev`. `npm test` ejecuta pruebas de dominio y API con SQLite. Después de compilar, `npm run test:sites` verifica el empaquetado. `npm run build` genera `dist/client` para Pages y conserva el empaquetado compatible con Sites.

El frontend no requiere secretos. Los valores `VITE_*` del ejemplo son públicos. Las claves Turnstile y HMAC pertenecen exclusivamente al backend y nunca deben agregarse a Git.

## Contenido y fuentes

Los catálogos están separados en JSON legible: bancos, plataformas, rutas, casos, fuentes y metadatos. `src/data/provinces.json` contiene el índice de 24 jurisdicciones y `src/data/provinces/<id>.json` sus procedimientos. Cinco fichas ampliadas (Buenos Aires, CABA, Córdoba, Santa Fe y Entre Ríos) distinguen régimen, exportaciones y DDJJ; los límites y las guías faltantes son explícitos. Ver [cómo editar los catálogos](docs/catalogs.md).

`src/data/cuit-countries.json` conserva los 899 registros importados desde la fuente de `docs/research`. Para regenerar: `python3 scripts/import-cuit.py` (biblioteca estándar). El tipo de sujeto se obtiene de la leyenda E/F del archivo, contrastada con la tabla PDF de ARCA. No deducirlo del prefijo del CUIT.

La modalidad publicada por una plataforma no garantiza compatibilidad con todas las cuentas ni cumplimiento cambiario. La Factura E para exportaciones no depende de recibir SWIFT. Consultá [ARCA](https://www.arca.gob.ar/monotributo/exportacion-servicios/) y las fuentes de cada ficha.

## Publicación

GitHub Actions publica `dist/client` en Pages al subir a `main`. Assets relativos y navegación por hash permiten usar tanto el subdirectorio de Pages como un dominio propio. El dominio se agrega cuando su DNS esté configurado; no se incluye CNAME prematuramente para no romper la URL inicial de Pages.

Backend: `community-api/`, Worker `monotributodev-community` y D1 `monotributodev-community`, cuenta personal de Cloudflare seleccionada por el propietario. Ver `docs/community-operations.md` para moderación y mantenimiento.

## Participar

[Abrir un aporte o consulta](https://github.com/hlopez94/monotributodev/issues/new/choose). Leer `CONTRIBUTING.md`. Las experiencias personales se identifican como tales; una opinión no cambia automáticamente el contenido normativo.

## Alcance

El autor no es contador. La guía no constituye asesoramiento contable, impositivo, cambiario ni legal. Los procedimientos sin verificar están marcados. No se piden claves, CUIT personal ni extractos. Datos oficiales y contenidos de terceros conservan su procedencia; no se les atribuye una licencia propia. La elección de licencia del código queda pendiente del propietario.

El simulador no consulta cotizaciones en vivo. Ver [catálogos, cálculo y límites](docs/simulator.md).
