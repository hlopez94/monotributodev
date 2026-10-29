# Simulador de movimientos por bloques

Pedido: componer monto de entrada, plataformas, monedas y métodos (ACH, wire, SWIFT, redes cripto, local) y calcular cuánto queda en cada tramo. Catálogos JSON legibles. Conservar la estética clara/verde del sitio.

UI: escenarios rápidos con los ejemplos solicitados; origen/moneda/monto; lista de bloques con destino, método, moneda de salida, tarifa fija, porcentaje, red, otros cargos/corresponsales, cotización y recepción. Agregar y quitar tramos, editar costos y conversión, resultado acumulativo y desglose por tramo. Cambiar topología elimina posteriores dependientes con aviso; cambiar importes conserva recorrido. Todo local, sin datos enviados ni cotizaciones en vivo.

Datos: tarifas por combinación y método con estado, fuente, revisión y valores desconocidos como null (nunca cero implícito). Ejemplos USD24,95/1,5%/ARS1560/costo ERC205 no son tarifas oficiales. Referencia Wallbit/Santander publicada1%; Wise total variable, no usar tarifa parcial SWIFT como total. Red ERC20 editable, equivalente en moneda de entrada, opción descontar o pagar aparte. USDC/USDT→USD1:1 es supuesto editable, no garantía.

Aritmética: enteros BigInt a 6 decimales y redondeo monetario explícito por tramo. Porcentaje sobre entrada; fijos/red descontada/otros antes de convertir; costo receptor en moneda de salida después de conversión. Gastos pagados aparte no reducen saldo, se muestran aparte. No sumar monedas distintas. Rechazar vacíos necesarios, negativos, porcentajes >100, tasas <=0 y gastos que superan saldo. No derivar importe fiscal de cripto o neto.

Recepción argentina: personas humanas residentes, cuenta USD, SWIFT, según BCRA vigente: comisión propia receptor0, cargos del exterior documentados aparte. Toggle de encuadre; no aplicar automáticamente a ARS ni otras situaciones.

No prometer compatibilidad ni cumplimiento por un resultado numérico; alternativas manuales sin validar señaladas. Fuentes, fechas y aportes por bloque. Escenarios iniciales claramente ejemplos y todos editables. Alternativa calculadora fija anterior descartada por no modelar tramos; constructor de grafos libre innecesario para recorridos lineales.
