# MonotributoDev: diseño propuesto

Estado: recorrido aprobado por el usuario con ampliaciones incorporadas el 29/10/2026; pendiente plan de ejecución. Todavía sin implementación.

## Propósito y decisiones del usuario

Sitio público en monotributodev.com.ar, código en hlopez94/monotributodev y despliegue inicial en GitHub Pages. Ayuda a devs argentinos a entender el cobro de exportación de servicios, facturarlo y resolver obligaciones de monotributo e IIBB según su situación. El contenido nace del post de Reddit y sus conversaciones, contrastado con fuentes oficiales.

El usuario eligió la propuesta visual 2: superficie clara, acento verde, tipografía legible y cifras destacadas. Agregó un wizard para ingresar dinero que supone monotributo ya activo y explica la documentación y Factura E. Ejemplo solicitado: Wise/Payoneer → SWIFT → banco argentino; preparar Factura E y resumen con movimientos; explicar CUIT del país e Incoterms.

Aclaración posterior del usuario: la interacción principal consiste en elegir plataforma de cobro y banco de destino para obtener instrucciones específicas de esa combinación. Por ejemplo, Wise → Santander debe explicar cómo cargar los datos de Santander en Wise, retirar el dinero y luego presentar la documentación. También solicita recomendar bancos/plataformas con buen proceso, incluyendo Santander, BBVA y Galicia, y explicar diferencias de atención digital/presencial y el plazo de 20 días hábiles.

Ampliaciones aprobadas: listado CUIT-país dentro de la página; estados «SIN INFO · APORTÁ» en bancos, plataformas y rutas sin evidencia; invitación transversal a mejorar la información con issues contextualizados y templates de GitHub. Regla editorial crítica solicitada: facturar el servicio/cobro original en la plataforma inicial y no el neto recibido en Argentina; las comisiones de envío no reducen automáticamente el importe del servicio facturado.

Confirmación explícita posterior del usuario: «ok Factura E será entonces y linkear al sitio de ARCA». Para exportaciones de servicios, usar Factura E y mostrar junto a la explicación el enlace oficial https://www.arca.gob.ar/monotributo/exportacion-servicios/. Esta decisión sustituye la hipótesis previa de usar Factura C cuando no hay SWIFT. La clasificación del comprobante y la evaluación del cumplimiento cambiario permanecen separadas.

## Enfoques considerados

1. Guía como entrada principal: facilita lectura del proceso, pero posterga la simulación.
2. Herramienta como entrada principal: permite explorar el cobro y vincularlo con documentación. Es la propuesta elegida, refinada con el wizard solicitado.
3. Asistente provincial como entrada principal: prioriza inscripción e IIBB, pero demora el circuito de cobro de quienes ya tienen monotributo.

Decisión técnica actualizada: frontend estático compatible con GitHub Pages; cálculos y respuestas financieras en memoria del navegador. El usuario eligió expresamente votación directa en el sitio con un servicio adicional, por lo que la propuesta inicial sin backend queda sustituida para la función comunitaria. Propuesta del agente: API separada Cloudflare Worker + D1 para valoraciones, protección antiautomatización validada en servidor y controles de duplicados; no afirmar identidad individual verificada con controles de navegador/IP. La elección de Cloudflare es propuesta técnica, no decisión explícita del usuario. Respetar la plantilla de Product Design para el frontend.

## Experiencia principal

La portada conserva la estética elegida. Su herramienta principal muestra dos selectores: «¿Dónde recibiste el pago?» y «¿A qué banco lo querés enviar?». Al elegirlos, se obtiene una guía para esa combinación. El wizard y el simulador son complementarios: el primero explica acciones/documentos; el segundo calcula bruto, cargos introducidos y neto estimado. No se impone completar uno para acceder al otro.

### Selección de ruta y guía específica

Origen: Wise, Payoneer, pago directo del cliente y otra cuenta/plataforma. Destino: Santander, BBVA, Galicia y otro banco. Estas opciones no implican que todas las combinaciones estén verificadas: cada ruta tendrá estado propio y respaldo, sin generar automáticamente nueve tutoriales a partir de dos listas.

La guía empieza por cargar el banco en la plataforma. Orden visible: 1) Cargar banco de destino; 2) Revisar y enviar; 3) Factura E; 4) Acreditar en el banco. El orden es didáctico, no exige esperar a transferir para emitir una factura que deba emitirse antes. La documentación y el plazo se anuncian desde el inicio y permanecen visibles durante el recorrido. Los bloques de Factura E, envío y presentación descritos más abajo son reutilizables dentro de este orden.

Para cada ruta verificada, mostrar los nombres de campos confirmados de la plataforma, qué dato del banco corresponde a cada uno, dónde obtenerlo, instrucciones de retiro y pasos de acreditación propios del destino. Distinguir campos personales de datos públicos del banco y datos del corresponsal. Se puede copiar un SWIFT público verificado; nunca generar cuenta, CBU o dirección personal. Si no se confirmó la pantalla actual de la plataforma, rotular la correspondencia como orientación y no como captura ni transcripción exacta.

Ejemplo Wise → Santander: retirar/enviar USD a cuenta propia argentina mediante la modalidad internacional correspondiente; beneficiario con nombre del titular; Banco Santander Argentina S.A.; BIC publicado BSCHARBAXXX; número de cuenta o CBU conforme a las instrucciones vigentes del banco y el formulario de Wise. Santander publica ambas alternativas: no imponer CBU como respuesta universal a todo campo «IBAN» o número de cuenta. Confirmar moneda y vía antes de enviar. En destino, explicar Online Banking → Transacciones → Cobros del exterior, identificación de orden, concepto del servicio, cuenta en USD, documentación y confirmación. Diferenciar ruta Payoneer → Santander, cuyo proveedor publica un retiro específico en USD, de un envío SWIFT genérico.

Si se elige «otro», ofrecer orientación general y enlace al COMEX correspondiente cuando se conozca; no fingir disponer de un procedimiento específico. Cambiar origen/destino actualiza todos los pasos, checklist y supuestos; conserva solo respuestas aplicables.

### Comparar bancos y plataformas

Acceso «Todavía no elegí banco». Comparativa por criterios verificables: canal de presentación para personas humanas, alta/habilitación inicial, formularios por cobro, compatibilidad documental con cuentas propias del exterior, costos de cuenta frente a cargos de transferencia, vías de soporte, moneda de acreditación y condiciones de rutas/integraciones específicas. En cada fila indicar fuente, fecha y qué parte es experiencia comunitaria.

Priorizar Santander, BBVA y Galicia para investigar y explicar, por pedido del usuario y su relevancia en el hilo. Las recomendaciones deben decir para qué perfil/ruta convienen y por qué. No equiparar «tiene banca online» con «todas las gestiones COMEX son online» ni «proceso presencial» con mal servicio. No clasificar actualmente a ICBC o Supervielle como exclusivamente presenciales a partir de testimonios viejos. Describir pasos/limitaciones actuales cuando estén confirmados; de lo contrario, marcar «consultar modalidad con COMEX». El usuario solicitó puntuaciones comunitarias: publicar promedios calculados de aportes reales y su cantidad, separados de la evaluación documental del sitio y sin garantizar calidad de servicio.

### Puntuaciones y tiempos de la comunidad

El usuario eligió votación directa dentro del sitio, no exigir issues de GitHub para votar. Formulario con entidad/ruta, fecha de experiencia, puntuación 1–5 para velocidad, facilidad y atención (cada dimensión puede quedar sin puntuar si no se usó), canal digital/presencial y comentario opcional. Mostrar cantidad y período de experiencias, distribución y promedio por dimensión; sin aportes mostrar «Todavía sin opiniones», nunca cifras inventadas. La revisión editorial de una entidad y su puntuación comunitaria son estados independientes.

Velocidad: distinguir tiempo desde retiro a recepción de la orden de pago, tiempo desde presentación documental a liberación bancaria y tiempo total; permitir valor desconocido, operación en curso o rechazada. Registrar demoras reportadas como horas/días corridos, no llamarlas días hábiles sin calendario apropiado. No promediar operaciones pendientes como si hubieran finalizado. Las fechas son aproximadas y no requieren importar comprobantes.

Propuesta de implementación inicial: votos sin cuenta con verificación antiautomatización, identificador aleatorio de navegador, límites de frecuencia en servidor e idempotencia. No prometer «una persona, un voto» sin identidad autenticada. Comentarios pasan por moderación antes de publicarse y permitir reportarlos; votos no aprobados no participan del agregado. La administración debe estar protegida mediante identidad del mantenedor y acceso separado. Minimizar retención de señales antiabuso, no persistir IP en claro ni solicitar datos financieros. El detalle de autenticación administrativa y retención debe cerrarse al implementar y explicarse en privacidad. Si API falla, mantener guías y mostrar estado de opiniones no disponibles, sin éxito ficticio al votar.

### Casos cripto, cobros en ARS y rutas compuestas

El usuario agregó investigar: cripto → banco USA → Argentina; cripto → billetera → ARS; cripto → Nexo Argentina → banco; cripto → Nexo internacional u otra plataforma → Wallbit → SWIFT o retiro local ARS; USD → Wallbit → SWIFT o retiro local ARS; Deel → banco argentino por SWIFT. Registrar cada tramo, titularidad, moneda, método, jurisdicción/versión del producto y estado operativo. Nexo Argentina e internacional deben ser entidades/productos separados. No equiparar transferencias locales en USD con ingreso COMEX por SWIFT.

Antes de elegir el comprobante, preguntar qué originó el ingreso: servicio utilizado económicamente en el exterior, servicio local, venta de cripto propia/ahorros u otro concepto. Para una exportación de servicios, la fuente ARCA consultada exige Factura E y permite emitirla en moneda extranjera o pesos. El tipo de factura no depende exclusivamente de que el cobro llegue por SWIFT/MLC. Por eso la propuesta del usuario «si no entra por SWIFT, Factura C consumidor final» se registra como hipótesis contradicha por la fuente oficial y NO como regla a implementar. Tampoco se factura automáticamente como servicio a un exchange que solo convierte activos.

Evaluar por separado: naturaleza del ingreso y factura; disponibilidad operativa de la ruta; trazabilidad documental; cumplimiento cambiario y plazo. Retirar ARS por una plataforma no acredita por sí mismo ingreso por MLC, pero no afirmar infracción universal sin conocer el concepto y normativa aplicable. Una ruta que termina en SWIFT tampoco certifica por sí sola cumplimiento integral si empezó con cripto. No proponer P2P, conforme al pedido del usuario; explicar los límites de identificación y respaldo sin describir pasos de P2P. Casos cripto sin evidencia normativa suficiente quedan «Requiere revisión profesional», conservando fuentes y preguntas abiertas.

Documentación según ordenante: si viene de cuenta propia, normalmente conciliar pago del cliente, cuenta externa, gastos y envío con la Factura E. Si aparece cliente, plataforma o procesador como ordenante, identificar quién contrató realmente el servicio y aportar respaldo del vínculo. No inferir que el ordenante es automáticamente el destinatario de la factura ni prometer «solo Factura E» por ver una empresa como remitente: el banco puede requerir extracto, contrato y otros documentos. La guía oficial Wallbit/Santander incluye factura y extracto para cobro de servicios; Galicia publica extracto para cuenta recaudadora propia.

Aviso editorial solicitado: «Esta guía reúne información pública y experiencias de la comunidad. Su autor no es contador y no constituye asesoramiento contable, impositivo, cambiario ni legal. Consultá las fuentes y a un profesional para tu caso». Usarlo sin ocultar la información principal. Este aviso no reemplaza el respaldo de las afirmaciones ni permite publicar una regla contradicha por ARCA.

### 1. Tu cobro

Preguntar si el cliente paga directo al banco argentino o si el usuario recibe primero en una cuenta/plataforma del exterior. Opciones explícitas Wise y Payoneer, más otra plataforma/cuenta. Identificar si el usuario ya cobró o está preparando el cobro, moneda, importe bruto y banco receptor. No pedir CUIT personal, claves, números de cuenta ni subir documentos. El país del cliente se solicita para orientar la factura y no se infiere del banco emisor.

Las plataformas son rutas documentales, no promesas de disponibilidad: sus funciones y las rutas SWIFT pueden depender del país, cuenta y banco. Si una combinación no está verificada, mostrar qué confirmar con COMEX y fuentes disponibles; no afirmar que funciona. Para el caso directo, omitir el resumen de billetera y mantener el comprobante de transferencia y posibles respaldos solicitados por el banco.

### 2. Factura E

Guía campo a campo para una prestación de servicios independiente utilizada económicamente en el exterior:

- Punto de venta habilitado para exportación en Comprobantes en línea; enlace a cómo habilitarlo si falta.
- Factura E y concepto servicios.
- Nombre/razón social, domicilio real y país del cliente; distinguir el CUIT del país de su identificador fiscal extranjero y persona física/jurídica cuando corresponda.
- Enlace a la tabla oficial de CUIT por país. No inventar identificadores ni direcciones.
- Moneda del servicio y condición de pago en la misma moneda según la operación real. Explicar la diferencia cuando factura y cobro tienen monedas distintas.
- Incoterms: dejar sin completar para servicios; enlazar fundamento oficial verificado antes de publicar este detalle como regla.
- Descripción fiel, período/cantidad y precio del servicio.
- Diferenciar importe facturado y fondos netos: los cargos se desglosan y no convierten automáticamente el neto recibido en el precio del servicio.

La guía prepara información; no emite comprobantes fiscales, CAE ni PDFs que aparenten ser una factura válida. Para emitir, dirige al sitio de ARCA. No fuerza fecha de emisión o de pago al día actual ni asume que todo cobro corresponde a una única factura.

### 3. Envío SWIFT

Explicar cómo obtener las instrucciones oficiales del banco receptor y comprobar beneficiario, cuenta en USD, BIC/SWIFT y corresponsal cuando corresponda. No recomendar completar códigos con caracteres arbitrarios ni reutilizar datos de otro banco.

En rutas por cuenta/plataforma propia, preparar resumen con titularidad, cobro del cliente, fecha, importe, salida hacia Argentina y detalle de gastos. La factura se emite al cliente del servicio, no automáticamente a la plataforma. Mantener los originales, sin editar respaldos para hacer coincidir cifras.

Mostrar el plazo normativo con su evento de inicio: cobro/percepción en el exterior o en el país, incluida acreditación en cuenta exterior. No reiniciarlo al recibir la orden de pago argentina. Primera versión: explicación y checklist, sin fecha de vencimiento calculada que omita feriados bancarios.

### 4. Presentación al banco

Resumen personalizado de ruta, importe bruto, costos, neto estimado y documentos a reunir. Checklist orientativa: Factura E, resumen de cuenta para ruta propia, comprobantes de envío y gastos, y contrato u otro respaldo si el banco lo solicita. Explicar el concepto de exportación de servicios y mostrar los enlaces COMEX del banco elegido. No sugerir usar transferencia de ahorros para encubrir cobros de servicios.

Cerrar con acciones: volver a editar, abrir fuentes oficiales, imprimir/guardar la guía con la función del navegador y revisar IIBB por separado. La checklist es preparación; no certifica aceptación bancaria ni cumplimiento tributario completo.

## Simulador

Regla visible tanto en simulación como en guía de factura y checklist final: «Facturá el importe del servicio cobrado originalmente, no el neto que llega a Argentina». Ejemplo explícito: cobro original USD 2.000, gastos posteriores USD 30, acreditación USD 1.970 → Factura E USD 2.000. Distinguir precio del servicio, cobro bruto y neto de la plataforma si también hay gastos de recepción: no inferir que el saldo neto mostrado por una plataforma es necesariamente el precio facturable. Cobros parciales, anticipos, devoluciones o agrupaciones requieren conciliación con sus facturas, sin crear automáticamente una factura por cada transferencia ni duplicar una factura ya emitida.

USD como caso base. Importe bruto positivo, comisión fija y/o porcentaje por plataforma y cargos documentados del exterior, todos editables y claramente identificados como datos del ejemplo o del usuario. Neto = bruto menos cargos. Rechazar negativos, valores no finitos y cargos superiores al bruto; permitir cero neto. Mostrar cifras redondeadas con criterio consistente y el desglose que permita reproducir el cálculo.

No cargar tarifas supuestamente vigentes sin respaldo fechado. No restar automáticamente monotributo o IIBB del dinero que llega al banco. Si se muestra conversión a pesos, usar cotización ingresada por el usuario y rotularla como escenario, no cotización en vivo. Rutas con conversión de moneda, cobros parciales/agrupados y LLC se explican como casos especiales que requieren conciliación adicional; no producen un resultado fiscal concluyente.

## Monotributo y provincias

Se conservan como recorridos separados del wizard de dinero, conforme al pedido original. Preguntar provincia/CABA, alta existente, empleo en relación de dependencia e ingresos solo de exportación o mixtos. Distinguir monotributo nacional, régimen simplificado/unificado provincial, no sujeción/exención, recaudaciones y declaraciones juradas. No recomendar salir del unificado a todos ni equiparar exclusión con cese total.

Ofrecer selector con las 24 jurisdicciones y enlaces oficiales verificados. Cada ficha debe tener estado de evidencia: procedimiento verificado con fuente y fecha, orientación parcial o pendiente de investigación. Cuando no se pueda verificar una guía, mostrar el organismo y qué consultar, sin fabricar pasos para dejar de pagar IIBB. La primera publicación puede tener fichas pendientes explícitas; no afirmar cobertura tributaria completa. Priorizar Buenos Aires, CABA, Entre Ríos y Córdoba por preguntas del hilo.

El alta y la categoría deben ajustarse a la actividad real y parámetros vigentes, sin recomendar A universalmente. Las escalas se enlazan a ARCA; no incluir valores como vigentes sin período de aplicación confirmado. Recategorización: febrero y agosto según ARCA, evaluación de los parámetros correspondientes.

## Contenido y fuentes

### Directorio CUIT-país

Tabla local visible en la página, buscable por país o número, con denominación oficial, país, clase de persona (física/jurídica u otra tal como la fuente) y CUIT de 11 dígitos conservado como texto. Botón copiar con confirmación accesible. No mezclar CUIT-país con ID fiscal particular extranjero ni código de país aduanero. Mostrar fuente, fecha de consulta y cobertura, sin presentar una selección como tabla completa. Incluir origen oficial descargable cuando exista. Durante la investigación, el XLS histórico enlazado por ARCA devolvió 404; ARCA también publica acceso a CUIT País desde https://www.arca.gob.ar/fe/ayuda/tablas.asp hacia https://servicioscf.afip.gob.ar/publico/FE-lista-paises/paises.aspx. Si no se recupera una tabla oficial íntegra, no reconstruir identificadores de memoria: mantener el estado de cobertura pendiente y enlace oficial.

Fuente recuperada el 29/10/2026: el endpoint oficial `paises.aspx` descarga un XLSX con 900 filas incluyendo encabezado. Contiene CUIT, país, código de tipo de sujeto y referencia; aparecen persona jurídica, persona humana y otro tipo de entidad. Se conservó en `docs/research/arca-cuit-paises-2026-10-29.xlsx` con metadatos y hash. No limitar el directorio artificialmente a dos clases.

### Aportes comunitarios y templates

Catálogos con estado por entidad y por ruta: verificado, parcial, sin info. «SIN INFO · APORTÁ» enlaza al formulario correspondiente en https://github.com/hlopez94/monotributodev/issues/new/choose o al template con contexto precompletado. Todas las guías y fichas ofrecen «¿Considerás que podemos mejorar esta info? Aportá acá». Parámetros con identificador de entidad/ruta/tema y título descriptivo, codificados de forma segura; no incluir automáticamente importes, datos personales ni respuestas financieras del visitante.

Templates de issues en español: aportar experiencia de banco/plataforma/ruta; solicitar información faltante; corregir información o norma; reportar problema del sitio. Solicitar entidad/ruta, fecha de experiencia, canal digital/presencial, pasos y requisitos, fuente pública y diferencia observada. Datos financieros opcionales y anonimizados; no pedir CUIT personal, cuenta/CBU, claves o extractos sin anonimizar. Las experiencias publicadas son reportes comunitarios hasta revisión, nunca actualizaciones automáticas de una regla fiscal o una recomendación. No asignar etiquetas inexistentes como requisito ni publicar issues en nombre del visitante: el usuario completa y envía en GitHub.

Cada afirmación sensible debe tener fuente oficial, fecha de revisión y ámbito. Separar normativa de experiencias comunitarias. Guardar el contenido en archivos legibles y versionados para aceptar aportes vía GitHub. Registro de temas detectados: costos de intermediarios, documentación por banco, fechas de cobro, país del cliente, ingresos mixtos, exclusión/no alcanzado de IIBB, cobros semanales agrupados, euros/USD, LLC y transición a régimen general. Los pendientes son preguntas para extender el contenido, no respuestas inventadas.

Fuentes iniciales consultadas:

- Post y comentarios: https://www.reddit.com/r/devsfinanzas/comments/1t3o1x0/gu%C3%ADa_definitiva_cobrar_usd_por_swift_en_argentina/
- ARCA, exportación de servicios: https://arca.gob.ar/monotributo/exportacion-servicios/
- ARCA, tablas CUIT país y otras: https://www.arca.gob.ar/fe/ayuda/tablas.asp
- ARCA, recategorización: https://serviciosweb.arca.gob.ar/genericos/guiasPasoPaso/VerGuia.aspx?id=515
- BCRA A8481, sección 2.2: https://www.bcra.gob.ar/archivos/Pdfs/comytexord/A8481.pdf
- BCRA A8330: https://www.bcra.gob.ar/archivos/Pdfs/comytexord/A8330.pdf
- ARBA, clasificación no alcanzados: https://web.arba.gov.ar/preguntas-frecuentes/quienes-se-identificanclasificanincorporan-ingresos-brutos-simplificado-ibs
- ARBA, padrón alícuota cero exportadores exclusivos: https://www.arba.gov.ar/GuiaTramites/TramiteSeleccionado.asp?mostrar=S&tramite=666
- Santander, conceptos y documentación: https://ayuda.santander.com.ar/06AK356I2O-1/article/BUS612CKPZ-cuales-son-conceptos-mas-frecuentes-por-que-puedo-recibir-fondos-exterior/
- Wallbit, documentación de su ruta a Santander (fuente de proveedor específica de esa ruta): https://help.wallbit.io/es/articles/12632940-como-registrar-cobros-del-exterior-con-santander
- Santander, datos para recepción: https://ayuda.santander.com.ar/06AK356I2O-1/article/KPLFB397X1-que-datos-necesitas-para-recibir-fondos-exterior/
- Santander, pasos de acreditación: https://ayuda.santander.com.ar/06AK356I2O-1/article/B8BTMXKQ8Q-como-acreditar-fondos-exterior-tu-cuenta/
- BBVA, datos y corresponsales: https://www.bbva.com.ar/personas/productos/comex/instrucciones-para-recibir-fondos-del-exterior.html
- Galicia, conceptos y documentación: https://comex.galicia.ar/content/dam/galicia/comex/formularios/personas/Codigos_de_concepto_Cobros_del_exterior.pdf
- Wise, campos de transferencias USD: https://wise.com/help/articles/4pumKbx24JZpG49f0fdTjo/entering-usd-bank-details
- Payoneer, retiro a banco: https://www.payoneer.com/es/resources/how-to-use-payoneer/como-retirar-fondos-de-payoneer-a-tu-cuenta-bancaria/
- Payoneer, opciones Argentina (incluye Santander en USD y tarifa publicada a verificar al operar): https://pages.payoneer.com/es/withdrawal-of-funds/

## Calidad, privacidad y publicación

Responsive, navegación por teclado, etiquetas claras, foco visible, contraste suficiente y resultados anunciados de forma accesible. Volver/avanzar conserva respuestas en memoria; reiniciar las borra. No persistencia de importes ni datos financieros por defecto, sin analytics. La excepción explícita de red es el envío voluntario del formulario comunitario a la API de opiniones, informado al visitante, y la verificación antiautomatización necesaria para ese envío; no enviar las respuestas del simulador o del wizard.

Verificar cálculo, validaciones, ramas directo/plataforma, cambio de destino, ruta sin verificar y estados incompletos. Ninguna combinación debe heredar por error el SWIFT, corresponsal o pasos de otro banco. Revisar visualmente escritorio y móvil con el diseño seleccionado. Probar enlaces sensibles y generación estática compatible con GitHub Pages, enlaces relativos y dominio propio. Preparar README y flujo de despliegue en GitHub; comprobar estado real del repositorio antes de crear, subir o sobrescribir archivos. No seleccionar licencia del contenido de terceros sin autorización.

Éxito: una persona ya monotributista entiende qué factura emitir, a quién, qué documentos guardar y dónde presentarlos para su ruta; puede reproducir una estimación de neto sin confundirla con una tarifa garantizada o con su obligación fiscal total.

Fuera de esta primera versión: emisión fiscal integrada, acceso a bancos/ARCA, custodia o movimiento real de fondos, recomendaciones automáticas sobre LLC, optimización fiscal personalizada y cotizaciones/tarifas en vivo.

El usuario confirmó «exacto» al recorrido revisado y agregó las ampliaciones registradas arriba. La imagen más reciente es exec-c111a9db-fa21-45f3-8cf9-ab2efdf526c3.png. Mantener su estética y selectores, sumar directorio y colaboración en superficies secundarias sin rediseñar la portada. El diseño no implica que ya exista un sitio funcional ni un despliegue.
