# Simulador automático por movimientos

La vista principal pide solo monto, plataforma/moneda y recorrido. Cada paso es una fila con destino/método, cargos no nulos y saldo. Los campos numéricos adicionales y fuentes están dentro de **Ajustar / ver fuentes**; su uso es opcional. El resultado no repite el recorrido como una lista grande. Se pueden encadenar hasta ocho pasos.

## Precarga de cotizaciones

- Frankfurter: EUR/USD de referencia diaria. No es una cotización ejecutable ni un precio intradiario.
- DolarApi: dólar MEP y cripto. USD→ARS usa **compra**; ARS→USD usa la inversa de **venta**. Elegir MEP no implica que Wallbit ejecute un cambio a ese precio ni que una transferencia local acredite ingreso por MLC.
- USDC/USDT→USD: equivalencia1:1 como supuesto, señalada en las fuentes del paso.

Las referencias se consultan al abrir el simulador. Caché en memoria de quince minutos, actualizaciones concurrentes compartidas y botón de actualización explícita. Cada petición vence a los ocho segundos. No se envían montos ni recorridos: solo GET públicos de monedas. Los proveedores reciben la conexión de red como en cualquier consulta web. No se agregan claves ni un servidor de cotizaciones.

Una respuesta inválida, timeout o error conserva el snapshot por par, con su fecha original y etiqueta **Guardada**. Las referencias antiguas se marcan **Desactualizada** según el proveedor. EUR/USD conserva su fecha diaria, y MEP/cripto la hora publicada. Los ajustes manuales de tasa no se pisan al refrescar ni al cambiar la base MEP/cripto; **Volver a automático** retoma los datos precargados sin romper el recorrido.

## Costos conocidos, estimados y faltantes

1. Usar el catálogo cuando hay referencia (p.ej. el instructivo Wallbit/Santander publica1%).
2. Para los ejemplos aportados, usar una estimación separada: Wise USD7,28 desde saldo USD por SWIFT (referencia aportada, sujeta a corresponsales) y ERC20 equivalente a5USDC/USDT. No son precios universales ni datos del gas en vivo. Conversiones Wise: estimación proporcional EUR→USD0,458% y USD→EUR0,289%; los mínimos/componentes fijos pueden variar.
3. Si no hay referencia ni estimación, no pedir carga obligatoria. El resultado se presenta como **Estimación parcial**, identifica los cargos sin cotizar y aclara que el saldo todavía no los descuenta. El dato sigue siendo `null` en el catálogo; el cero interno usado para calcular antes de cargos desconocidos nunca se presenta como tarifa gratuita.

Los gastos de valor cero se ocultan en la línea de cada paso y en el desglose. También se omiten pasos sin gastos positivos del desglose; no se muestra un detalle vacío. Los campos de edición en cero permanecen accesibles dentro de Ajustar.

La recepción propia del banco se calcula en cero solo bajo el encuadre persona humana residente + SWIFT + cuenta USD en banco argentino. Los cargos documentados del exterior van separados. Los gastos de red pagados aparte se muestran como desembolso adicional equivalente, sin reducir dos veces el envío. No se suman gastos de monedas distintas.

## Catálogos JSON

En `src/data/simulator/`, con sangría de dos espacios:

| Archivo | Contenido |
| --- | --- |
| `currencies.json` | Activos y precisión de simulación, hasta6decimales |
| `nodes.json` | Plataformas/cuentas y monedas de la interfaz |
| `methods.json` | ACH, wire, SWIFT, red, local, conversión y personalizado |
| `tariffs.json` | Referencias de costo por ruta/método/red, fuentes y revisión |
| `automatic-estimates.json` | Estimaciones de planificación, separadas de tarifas verificadas |
| `scenarios.json` | Cinco recorridos sugeridos; sin tasas estáticas obligatorias |
| `quote-sources.json` | Endpoints/documentación y antigüedad por fuente |
| `quote-snapshot.json` | Copia de respuestas reales y fechas originales para fallback |
| `receiving-policy.json` | Alcance y fuentes de la comisión propia receptora0 |

`npm run quotes:snapshot` actualiza el respaldo con respuestas reales. Si falla algún proveedor, el script no reemplaza el archivo anterior. No se ejecuta automáticamente en el build y no hay una tarea programada.

## Unidades y cálculo

Se conserva el motor BigInt en millonésimas y un único redondeo de la fracción original a precisión de moneda. USD/EUR/ARS tienen2decimales, USDC/USDT6. Fijo/red/otros se expresan en moneda de entrada; porcentaje sobre entrada; recepción en moneda de salida. Tasa = unidades de salida por una unidad de entrada.

Se descuentan cargos, se convierte el saldo y se resta la recepción. El gas pagado aparte no reduce el envío. La simulación no determina valuación fiscal de cripto ni el importe a facturar, no descuenta impuestos y no verifica elegibilidad de un circuito. Los mínimos, activo/red, precio neto y admisión dependen de los proveedores.

Cambiar topología elimina pasos siguientes dependientes; cambiar importes conserva el recorrido. Restaurar automático conserva también la topología de los pasos personalizados.

## Validación

Las pruebas cubren BigInt/encadenamiento, referencias compra/venta, precarga, ajustes, ausencia de ceros en gastos, tarifas faltantes explícitas, schema del proveedor, fallback por par, timeout, deduplicación/caché, antigüedad y continuidad al restaurar. Browser QA comprueba carga real de APIs, cantidad de campos visibles, tamaño de filas, móvil y estado al navegar.

Wallbit: retiros ACH/Wire precargados para Classic,1% con mínimosUSD5/USD25 respectivamente. `fees.percentMinimum` es el piso de la comisión porcentual: se aplica el mayor, no se suma. Puede ajustarse en el detalle; no incluye suscripción ni cargos desconocidos del banco destino. Pro/Max se documentan en notas, sin aplicar sus beneficios automáticamente. Depósitos Wallbit sin cargo propio; FX local pendiente de cotización real. Fuente: https://www.wallbit.io/es/pricing.

Payoneer y Deel: `pricingNotice` mantiene visibles rangos y condiciones; `minimumAmount` limita el importe de entrada de cada tramo, separado de `fees.percentMinimum`. Retiros sin vía confirmada usan método bancario genérico, las integraciones de plataformas tienen método propio. Rangos sin tarifa exacta permanecen null y producen cálculo parcial. Investigación: docs/research/payoneer-deel-2026-10-29.md.
