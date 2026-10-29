# Simulador automático y compacto

Corrección del usuario: no pedir costos/cotizaciones; precargar y reducir cada movimiento a una fila. Ocultar gastos de valor cero. Mantener configuración avanzada opcional y datos JSON legibles.

Flujo: monto, plataforma/moneda y pasos pequeños. Cada paso elige destino/método del catálogo, muestra cargos no nulos y saldo. Ajustar despliega campos/sources/aporte. El resultado ocupa un panel pequeño, sin repetir todo el recorrido vertical. Agregar paso ofrece opciones por origen/moneda. Catálogo y condiciones al pie, colapsados.

Cotizaciones: cliente consulta DolarApi bolsa/cripto (compra para USD→ARS y venta para ARS→USD), Frankfurter EUR→USD diario. No manda montos ni recorridos. Timeout, validación, caché en memoria15min y snapshot JSON fechado como fallback; cada par conserva su fecha/origen. Desactualizado/guardado se identifica. No mostrar tasa de mercado como precio garantizado Wallbit/Wise. Rate manual no se pisa al refrescar; restaurar devuelve automático.

Tarifas: referencias existentes cuando conocidas; aproximaciones separadas en JSON (Wise24,95 y ERC20equiv5 del ejemplo aportado) con rótulo estimado. No inventar otros precios. Para tarifa desconocida, cálculo parcial omite ese costo con aviso visible, sin convertirlo en comisión0 ni solicitar carga obligatoria. EUR→USD Wise referencia de cambio no incluye comisión sin cotizar. Receptor SWIFT/USD0 solo en encuadre existente.

Ceros: ocultar filas de cargo0 en resumen, línea de costos y desglose; mantener campos0 solo al ajustar. Si no hay costos conocidos, informar que no hay cargos incluidos o que faltan tarifas, sin fingir gratuidad.

Conservar motor BigInt/redondeo, gas aparte, estado al navegar, fuentes y aportes. Cinco escenarios automáticos (incluye EUR→USD). Alternativas: formulario expandido anterior rechazado explícitamente por el usuario; pasos pequeños con detalles optativos elegidos conforme pedido. Sin backend nuevo: APIs CORS públicas verificadas.
