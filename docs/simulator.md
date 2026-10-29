# Simulador por movimientos

El constructor es lineal: parte de un saldo y encadena hasta ocho movimientos. Permite configurar método, origen/destino, monedas, cargos y cotización. No realiza transferencias ni envía importes al servidor. Mantiene el estado en memoria al navegar.

## Catálogos JSON editables

En `src/data/simulator/`:

- `currencies.json`: activos y decimales de simulación (hasta seis).
- `nodes.json`: plataformas/cuentas, grupos y monedas disponibles en el constructor; no constituye garantía de elegibilidad.
- `methods.json`: ACH, wire, SWIFT, red cripto, local, conversión y personalizado.
- `tariffs.json`: una referencia por origen, destino, monedas y método/red, con fuentes y revisión.
- `scenarios.json`: los cuatro ejemplos solicitados, con sobreescrituras separadas de tarifas de referencia.
- `receiving-policy.json`: alcance y fuentes del costo propio receptor 0 para SWIFT/USD/banco argentino bajo el encuadre indicado.

Los valores monetarios y porcentajes se guardan como strings decimales, `null` representa falta de información y se muestra como campo vacío obligatorio. Nunca reemplazar un desconocido con cero para obtener un resultado. Los campos iniciales de Otros en 0 son un supuesto editable del cálculo, no una garantía de ausencia de otros cargos. Todos los JSON usan sangría de dos espacios.

`fees.fixed`, `fees.network` y `fees.other` se expresan en moneda de entrada. `fees.percent` es un porcentaje sobre la entrada al tramo. `fees.receiving` se expresa en moneda de salida. `rate` significa unidades de salida por una unidad de entrada; no usar su inversa. Para la misma moneda, la tasa debe ser 1.

## Aritmética y límites

Se usan enteros BigInt en millonésimas, sin cálculos monetarios en coma flotante. Para porcentaje y conversión se redondea la fracción original una sola vez a la unidad monetaria final. USD/EUR/ARS se simulan con dos decimales y USDC/USDT con seis. La precisión de una simulación no representa necesariamente la de liquidación del proveedor.

1. Calcular comisión porcentual sobre entrada al tramo.
2. Descontar comisión fija, porcentaje, otros y red si se paga del importe.
3. Convertir el saldo con la cotización ingresada y redondear según moneda de salida.
4. Descontar cargo receptor en moneda de salida.
5. Usar el resultado como entrada del próximo tramo.

La red pagada aparte figura como gasto adicional equivalente en moneda de entrada y no reduce el envío. Si el gas se paga en ETH, el usuario ingresa su equivalente; el sitio no cotiza ETH ni gas. No se suman gastos de monedas distintas como si fueran comparables.

La comisión propia receptora se aplica en cero únicamente al seleccionar el encuadre de persona humana residente + SWIFT + cuenta USD en banco argentino. La fuente vigente permite traslado al costo de cargos extranjeros documentados, que se cargan aparte sin duplicar los incluidos en la cotización. Desmarcar el encuadre exige completar el costo receptor correspondiente.

Cambiar origen/moneda inicial inicia un nuevo recorrido. Cambiar movimiento, destino, método o moneda de un tramo descarta los posteriores dependientes, con aviso en UI. Editar montos/tarifas/cotización y restaurar una referencia del catálogo conserva los tramos.

## Ejemplos y fuentes

- ERC20 equivalente a 5 USDC, tasa USDC/USD 1 y USD/ARS 1560 son supuestos editables. No se extrae una cotización en tiempo real.
- USD24,95 Wise es el ejemplo aportado por el usuario; la fuente oficial usa componentes y precios variables. No se toma la tabla parcial SWIFT como total.
- 1,5% Wallbit es otro ejemplo aportado; la guía Santander consultada publica 1%. Ambas cifras se distinguen y el botón Restaurar referencia carga el valor del catálogo.
- Cripto2000 − red5 = USD1995; menos 1,5% redondeado a USD29,93 = USD1965,07. Con la red pagada aparte, llegan USD1970 y el costo equivalente a 5 USDC queda separado.

La compatibilidad de un depósito no confirma que todo circuito posterior pueda cursarse como exportación de servicios. No se deduce la factura del neto ni se valúa cripto fiscalmente. Los límites, activos/redes y mínimos deben verificarse con proveedores.

## Validación

`npm test` incluye encadenamiento, cotización, gas externo, ejemplo Wise, porcentaje Wallbit, datos faltantes, insuficiencia, continuidad y límites de redondeo; valida que los escenarios JSON calculen y que monedas/nodos/fuentes existan. `npm run build` y `npm run test:sites` comprueban el frontend publicado. La interacción móvil y el estado entre vistas se verifican en navegador.
