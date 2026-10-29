# Editar catálogos

Los contenidos viven en JSON sin minimizar: dos espacios de sangría, UTF-8 y salto de línea final. No llevan comentarios ni comas finales. La interfaz y las reglas de presentación siguen en React/JavaScript; no hace falta editarlas para corregir una ficha existente.

| Archivo | Contenido |
| --- | --- |
| `src/data/banks.json` | Bancos, coordenadas, canal y referencias a fuentes |
| `src/data/platforms.json` | Plataformas e información de retiro |
| `src/data/routes.json` | Combinaciones de plataforma y banco documentadas |
| `src/data/crypto-cases.json` | Casos compuestos y límites de verificación |
| `src/data/sources.json` | Fuentes identificadas por ID usadas en cobros |
| `src/data/metadata.json` | Fecha editorial del catálogo de cobros |
| `src/data/provinces.json` | Índice de las 24 jurisdicciones, IDs y organismos |
| `src/data/provinces/<id>.json` | Ficha y procedimientos de una jurisdicción |
| `src/data/provinces/common.json` | Avisos y orientación transversal, incluido SIFERE |
| `src/data/cuit-countries.json` | Dataset oficial; regenerar con el importador documentado |

`province-guides.mjs` solo carga los JSON; no contiene procedimientos. Los JSON de bancos/plataformas/rutas también alimentan la validación de opiniones de la API: no cambies IDs como si fueran etiquetas visibles.

## Fichas provinciales

Cada provincia tiene `id`, `agency`, `status`, `reviewedAt`, `scope` y tres secciones: `regime`, `exports`, `monthly`. Incluso los faltantes tienen archivo para facilitar completar información. `reviewedAt` usa YYYY-MM-DD; `null` indica que aún no se revisó la guía.

Cada sección tiene `title`, `status`, `intro`, `steps` (lista de instrucciones) y `sources` (lista de objetos `name`/`url`). `monthly.appliesTo` es `general`: la UI no muestra esos pasos automáticamente a alguien del simplificado, no inscripto o en CM. La sección común CM tiene sus propias fuentes. El tratamiento de ingresos puede indicarse en `exports.treatment`; no es una calculadora ni determina impuestos.

Ejemplo mínimo de una sección pendiente:

```json
{
  "title": "2. Tratamiento de exportaciones en IIBB",
  "status": "missing",
  "intro": "Falta verificar el procedimiento con el organismo.",
  "steps": [],
  "sources": [
    {
      "name": "Portal del organismo",
      "url": "https://sitio-oficial-del-organismo/"
    }
  ]
}
```

Estados: `missing` = falta procedimiento; `partial` = hay información con límites explícitos; `verified` = alcance respaldado por evidencia vigente. No elevar un estado solo por tener un enlace al portal. Si completás una ficha, revisá también su estado en `provinces.json`.

## Para publicar una corrección

1. Verificá la fuente oficial y su versión. Enlazá el trámite, norma o instructivo exacto cuando exista, además del portal.
2. Separá unificado/simplificado, exención/no gravado, cese, DDJJ y padrón de retenciones. No conviertas una regla local en consejo nacional.
3. Conservá instrucciones condicionales y los límites para actividad mixta. No prometas saldo cero por usar Factura E ni indiques facturación cero si hubo ingresos.
4. Actualizá fecha y alcance; indicá qué no pudiste comprobar. No copies menús de una investigación sin contrastarlos.
5. Ejecutá `npm test`, `npm run build` y `npm run test:sites`. Para cambios que afecten entidades/rutas de comunidad, comprobá también `npm run api:bundle`.
6. Abrí una PR o usá los enlaces Aportá de cada sección. No adjuntes claves, CUIT personal, CBU ni documentos sin anonimizar.

## Tarifas y escenarios del simulador

Los archivos `src/data/simulator/*.json` separan monedas, nodos, métodos, referencias de tarifas, política de recepción y ejemplos. Ver [modelo y unidades](simulator.md) antes de editar: una tarifa fija se expresa en moneda de entrada; el costo receptor, en moneda de salida; `null` es desconocido. No cambies los ejemplos aportados por el usuario como si fueran precios oficiales. Cada referencia mantiene fuentes y fecha.
