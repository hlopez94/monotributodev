# Revisión de diseño — MonotributoDev

final result: passed

## Evidencia

- Fuente: docs/design-reference.png, 1487 × 1058.
- Implementación: docs/qa/desktop-final.png, 1472 × 1047; viewport solicitado 1487 × 1058, área de contenido descontando scrollbar, densidad 1.
- Estado: Wise → Santander, primer paso, ayuda de inicio cerrada.
- Comparación conjunta normalizada al tamaño de la fuente: docs/qa/comparison-final.png. Recorte de tabla, ayuda y acción: docs/qa/comparison-detail.png.
- Móvil: docs/qa/mobile.png; viewport 390 × 844, ancho de contenido 375. scrollWidth = clientWidth = 375; la navegación y tabla tienen scroll local cuando corresponde.

## Historial

1. Captura inicial: docs/qa/desktop-before.png. P2: exceso de texto introductorio ocultaba la tabla principal bajo el primer viewport. P2: el plazo y la acción quedaban demasiado abajo.
2. Se compactó el hero, se agruparon instrucciones de inicio/datos complementarios en detalles desplegables, se dejó una tabla principal de cinco campos y se reunieron plazo y acción en una barra que permanece visible. Nueva captura y comparación conjunta: desktop-final y comparison-final. Los campos críticos, incluido SWIFT, y la acción se ven en escritorio.
3. Revisión funcional independiente: corregida pérdida del banco elegido al consultar CUIT/simulador. Se verificó Wise → BBVA → Factura E → CUIT → volver: conserva BBVA y el paso.

## Superficies revisadas

- Tipografía: DM Sans, jerarquía y acento verde conservados; cifras con IBM Plex Mono. El tamaño exacto difiere ligeramente del raster y es adecuado para texto real.
- Espaciado: dos selectores, pasos y proporción de tabla/ayuda respetan la referencia; se permiten secciones inferiores por mayor información real.
- Colores: fondo blanco, tinta oscura, verde semántico y panel menta, sin degradados ni efectos añadidos.
- Assets: iconos Phosphor reales. Nombres textuales de plataformas/bancos en selectores nativos; no se imitan logos con dibujos. La maqueta no aporta archivos de marca oficiales.
- Contenido: diferencias deliberadas para fuentes, aviso de alcance, datos complementarios y rutas verificadas/parciales. La estructura visual se mantiene.

## Interacciones comprobadas en navegador

- Cambiar banco cambia BIC y requisitos. Una ruta sin info muestra aporte y no inventa pasos.
- Navegar los cuatro pasos desde móvil.
- Simular 3000 USD menos 40 USD: neto 2960 y factura 3000.
- Buscar CUIT de EEUU 55000002126: persona jurídica, contrastada con fuente oficial.
- Navegar a CUIT y volver preserva ruta y paso; simulador permanece montado en memoria.
- Enlaces de fuentes y contribución tienen destinos reales y no adjuntan datos financieros.
- La API pública devuelve colección vacía real, no opiniones de ejemplo. Pruebas de envío, moderación, idempotencia y límites con SQLite real. En GitHub Pages se completó un envío protegido por Turnstile: confirmación visible y fila pending en D1; la prueba sintética se marcó rejected y se verificaron colección vacía y promedios nulos.
- Consola: se observó un error HMR transitorio durante creación de archivos, anterior al build final. Sin errores de compilación actuales. Producción verificada: formulario, navegación y lectura de opiniones funcionales. El iframe de Turnstile emite mensajes propios en consola; no se observaron errores de ejecución de la aplicación. Captura: docs/qa/public-site.png.

## Pendientes menores

No quedan hallazgos P0/P1/P2 de diseño. P3: el raster usa marcas en los selectores; se optó por nombres textuales para no distribuir logos generados como oficiales. Móvil conserva navegación horizontal explícita, no un menú adicional.

## Actualización: selectores y SWIFT (29/10/2026)

- Selectores propios con marcas reales guardadas localmente; procedencia en public/brands/sources.json. Iconos de biblioteca para conceptos sin marca (cliente directo, cripto genérica, otras entidades).
- Capturas: docs/qa/selectors-platforms.png, selectors-banks.png y selectors-mobile.png. Bordes, verde, tamaños y superficies coherentes con el sitio; menú superpuesto con alto máximo y scroll interno.
- Teclado comprobado manualmente: flechas + Enter seleccionan, Home/End mueven opción, Escape cierra. Opciones anuncian selección y foco permanece en el combobox. Se revisó selección por clic y carga de todas las marcas de bancos.
- Móvil 390 × 844: clientWidth=scrollWidth=375 (descontada barra de scroll), menú con scroll local; override restablecido al terminar.
- Payoneer → BBVA sin ficha de ruta sigue mostrando BFRPARBA/CBU/corresponsal de BBVA y los cuatro pasos, con advertencia de compatibilidad no confirmada. ICBC no hereda coordenadas de otro banco, muestra faltantes y aportes.
- Paso 4 Wallbit → Santander: cuenta espejo muestra extracto + factura; cliente muestra factura al cliente; plataforma muestra conciliación y vínculo. Ayuda oficial de Wallbit sobre cierre mensual/solicitud a soporte enlazada.
- Revisión independiente sin hallazgos Critical/Important. Mejoras menores diferidas: búsqueda por teclado con letras repetidas/espacios; redacción del caso poco común Cliente directo + cuenta propia; automatizar comprobaciones de foco/cierre que se validaron manualmente.
- Pruebas: 16 de lógica/API + 4 de empaquetado aprobadas, build correcto.
