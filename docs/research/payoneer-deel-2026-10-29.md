# Payoneer y Deel — 29/10/2026

## Payoneer

[Precios](https://www.payoneer.com/es/about/pricing/) y [explicación](https://www.payoneer.com/es/resources/how-to-use-payoneer/como-calcula-payoneer-las-tarifas-de-transferencias/): las tarifas dependen de perfil/región/operación. El precio local USD1,50 exige coincidencia de país del perfil, banco y moneda local; no se extrapola a Argentina. Retiros genéricos con conversión o moneda no local: rango1–4%, exacto desconocido; pueden existir mínimos. Conversión entre balances:0,5%, distinta de retiro.

[Campaña Argentina](https://pages.payoneer.com/es/withdrawal-of-funds/): Santander USD3,3% de punta a punta. Se usa esta referencia específica, sin agregar nuevamente cargos incluidos. No identifica la red: se etiqueta retiro bancario con vía a confirmar, sin asegurar SWIFT/MLC.

## Deel

[Fuente](https://help.letsdeel.com/hc/en-gb/articles/14391381019537-About-Withdrawal-Fees-and-Withdrawal-Minimums), actualizada16/10/2026: Payoneer1% con comisión mínimaUSD12 y retiro mínimoUSD50; WiseUSD0 con retiro mínimoUSD5. Recepción/proveedor se mantiene desconocido. SWIFTUSD5–10 variable, retiro mínimoUSD100; tarifa exacta/corresponsales desconocidos. No se suman automáticamenteUSD5 transfronterizos: la fuente los describe incluidos en el cargo del proveedor. Disponibilidad por cuenta y destino por confirmar. No se añadieron métodos/activos digitales ni tarifas locales como sustituto automático de una transferencia transfronteriza.

## Verificación

`minimumAmount` se compara con la entrada del tramo antes de gastos; `fees.percentMinimum` es el piso de la comisión, no el importe mínimo a retirar. Prueba RED→GREEN: Deel49,99 rechazado,50 cobra12;2000 cobra20. Conversión Payoneer0,5%; rango genérico omitido explícitamente. Navegador: Deel49 rechaza;1000→Payoneer988→Santander955,40, parcial por recepción desconocida. Fuentes/fecha/aportes por ficha.
