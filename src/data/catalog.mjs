export const checkedAt='29 de octubre de 2026';
export const sources={
 arca:{name:'ARCA · Exportación de servicios',url:'https://www.arca.gob.ar/monotributo/exportacion-servicios/'},
 cuitTipos:{name:'ARCA · CUIT-país y tipo de sujeto',url:'https://arca.gob.ar/inversiones-bienes-uso/documentos/CUIT-pais.pdf'},
 cuit:{name:'ARCA · CUIT por país',url:'https://servicioscf.afip.gob.ar/publico/FE-lista-paises/paises.aspx'},
 bcra:{name:'BCRA · Exterior y Cambios, sección 2.2',url:'https://www.bcra.gob.ar/Pdfs/Texord/t-excbio.pdf'},
 santander:{name:'Santander · Datos para recibir fondos',url:'https://ayuda.santander.com.ar/06AK356I2O-1/article/KPLFB397X1-que-datos-necesitas-para-recibir-fondos-exterior/'},
 santanderCobro:{name:'Santander · Acreditar fondos del exterior',url:'https://ayuda.santander.com.ar/06AK356I2O-1/article/B8BTMXKQ8Q-como-acreditar-fondos-exterior-tu-cuenta/'},
 bbva:{name:'BBVA · Instrucciones para recibir fondos',url:'https://www.bbva.com.ar/personas/productos/comex/instrucciones-para-recibir-fondos-del-exterior.html'},
 galicia:{name:'Galicia · Documentación de cobros del exterior',url:'https://comex.galicia.ar/content/dam/galicia/comex/formularios/personas/Codigos_de_concepto_Cobros_del_exterior.pdf'},
 wise:{name:'Wise · USD por SWIFT a Argentina',url:'https://wise.com/help/articles/2974947/what-countries-and-regions-can-i-send-usd-to-via-swift'},
 wiseFields:{name:'Wise · Datos bancarios para enviar USD',url:'https://wise.com/help/articles/4pumKbx24JZpG49f0fdTjo/entering-usd-bank-details'},
 payoneer:{name:'Payoneer · Retiros en Argentina',url:'https://pages.payoneer.com/es/withdrawal-of-funds/'},
 payoneerSteps:{name:'Payoneer · Cómo retirar al banco',url:'https://www.payoneer.com/es/resources/how-to-use-payoneer/como-retirar-fondos-de-payoneer-a-tu-cuenta-bancaria/'},
 wallbit:{name:'Wallbit · Exportación de servicios a Santander',url:'https://help.wallbit.io/es/articles/12632940-como-registrar-cobros-del-exterior-con-santander'},
 wallbitStatement:{name:'Wallbit · Extractos mensuales y período en curso',url:'https://help.wallbit.io/es/articles/11198850-como-descargar-los-documentos-financieros-desde-wallbit'},
 wallbitSupport:{name:'Wallbit · Contactar a soporte',url:'https://help.wallbit.io/es/articles/8062891-como-puedo-comunicarme-con-wallbit'},
 wallbitArs:{name:'Wallbit · Retiros locales y otras monedas',url:'https://help.wallbit.io/es/articles/8062980-como-retiro-dinero-de-mi-cuenta-de-wallbit'},
 deel:{name:'Deel · Métodos de retiro y SWIFT',url:'https://help.letsdeel.com/hc/en-gb/articles/7338494928913-How-Contractors-can-move-funds-from-Deel'},
 nexo:{name:'Nexo Argentina · Información del producto',url:'https://nexo.com/es-ar'},
 arba:{name:'ARBA · Actividades no alcanzadas por IBS',url:'https://web.arba.gov.ar/preguntas-frecuentes/quienes-se-identificanclasificanincorporan-ingresos-brutos-simplificado-ibs'},
 arbaCero:{name:'ARBA · Padrón de alícuota cero',url:'https://www.arba.gov.ar/GuiaTramites/TramiteSeleccionado.asp?mostrar=S&tramite=666'},
 reddit:{name:'Post original y conversaciones de la comunidad',url:'https://www.reddit.com/r/devsfinanzas/comments/1t3o1x0/gu%C3%ADa_definitiva_cobrar_usd_por_swift_en_argentina/'},
 recategorizacion:{name:'ARCA · Recategorización',url:'https://serviciosweb.arca.gob.ar/genericos/guiasPasoPaso/VerGuia.aspx?id=515'}
};
export const banks=[
 {id:'santander',name:'Santander',status:'verified',swift:'BSCHARBAXXX',legalName:'Banco Santander Argentina S.A.',accountField:'Tu número de cuenta en USD o CBU, según el formulario y las instrucciones de Santander',channel:'Solicitud de acreditación desde Online Banking.',detail:'Transacciones → Cobros del exterior. Seleccioná la orden de pago, el concepto, tu cuenta y adjuntá los respaldos.',sources:['santander','santanderCobro']},
 {id:'bbva',name:'BBVA',status:'partial',swift:'BFRPARBA',legalName:'Banco BBVA Argentina S.A.',accountField:'El CBU de 22 dígitos de tu cuenta en USD',correspondent:'Standard Chartered Bank · New York · SWIFT SCBLUS33 · ABA 026002561 (solo si se solicita corresponsal)',channel:'Coordenadas verificadas; confirmar alta y canal de presentación con COMEX.',detail:'Publica CBU, beneficiario y SWIFT. Si te piden corresponsal en USD: Standard Chartered Bank, New York; SWIFT SCBLUS33; ABA 026002561.',sources:['bbva']},
 {id:'galicia',name:'Galicia',status:'partial',swift:null,legalName:'Banco de Galicia y Buenos Aires',channel:'Requisitos documentales publicados; guía completa pendiente.',detail:'Para fondos desde cuenta propia en el exterior, su grilla contempla extracto de la cuenta recaudadora. Obtené las coordenadas actuales en COMEX.',sources:['galicia']},
 ...[['nacion','Banco Nación'],['icbc','ICBC'],['supervielle','Supervielle'],['provincia','Banco Provincia'],['macro','Banco Macro'],['otro','Otro banco']].map(([id,name])=>({id,name,status:'missing',swift:null,channel:'Sin información documentada todavía.',detail:'No tenemos un procedimiento actual verificado. Solicitá información o contanos cómo fue tu experiencia.',sources:[]}))
];
export const platforms=[
 {id:'wise',name:'Wise',status:'verified',sources:['wise','wiseFields'],hint:'Retiro internacional en USD'},
 {id:'payoneer',name:'Payoneer',status:'verified',sources:['payoneer','payoneerSteps'],hint:'Verificá moneda y método de retiro'},
 {id:'wallbit',name:'Wallbit',status:'verified',sources:['wallbit','wallbitArs'],hint:'SWIFT / exportador de servicios'},
 {id:'deel',name:'Deel',status:'verified',sources:['deel'],hint:'Método Bank Transfer / SWIFT'},
 {id:'directo',name:'Cliente directo',status:'partial',sources:['santander'],hint:'El cliente transfiere al banco argentino'},
 {id:'nexo-ar',name:'Nexo Argentina',status:'partial',sources:['nexo'],hint:'Ruta cripto: revisión profesional'},
 ...[['nexo-int','Nexo Internacional'],['cripto','Cripto / otra billetera'],['banco-usa','Cuenta bancaria en EE.UU.'],['otro','Otra plataforma']].map(([id,name])=>({id,name,status:'missing',sources:[],hint:'Aportá información de esta ruta'}))
];
const wiseSteps=['En Wise, iniciá un envío o retiro y agregá tu propia cuenta bancaria como destinatario.','Seleccioná una transferencia internacional en USD a Argentina. No uses los datos ACH de una cuenta estadounidense para un destino argentino.','Cargá los datos de tu banco según la tabla. Los nombres de campos pueden variar según tu cuenta y la versión de Wise.'];
export const routes=[
 ...['santander','bbva'].map(bank=>({origin:'wise',bank,status:bank==='santander'?'verified':'partial',instructions:wiseSteps,sources:['wise','wiseFields',bank],note:'Datos oficiales de plataforma y banco. La disponibilidad final y los campos se confirman al configurar el envío.'})),
 {origin:'payoneer',bank:'santander',status:'verified',instructions:['Entrá a Retirar y Convertir → Retirar fondos a mi banco.','Agregá una cuenta bancaria propia de Santander Argentina en USD. Verificá que el método ofrecido acredite dólares, no pesos.','Elegí el saldo USD, el monto y la cuenta. Revisá la comisión y los datos antes de confirmar.'],sources:['payoneer','payoneerSteps','santander'],note:'Payoneer publica una opción específica para retirar USD a Santander. No asumas que todos los retiros bancarios tienen la misma vía o costo.'},
 {origin:'wallbit',bank:'santander',status:'verified',instructions:['En Wallbit, elegí Retirar → Dólares → Exportador de servicio.','La primera vez, agregá el CBU de tu cuenta en dólares de Santander.','Revisá el importe y el costo que muestra la aplicación antes de confirmar.'],sources:['wallbit','santanderCobro'],note:'La modalidad “exportador de servicio” tiene documentación propia. El retiro local en ARS es una ruta distinta.'},
 ...['santander','bbva','galicia'].map(bank=>({origin:'deel',bank,status:'partial',instructions:['En Deel, entrá a Finance → Withdrawal methods → Add Method.','Elegí Bank Transfer y comprobá que la modalidad disponible sea internacional/SWIFT en USD para Argentina.','El nombre del titular debe coincidir con tu perfil. Cargá las coordenadas que te dé COMEX y verificá la dirección.'],sources:['deel',bank==='galicia'?'galicia':bank],note:'Deel documenta retiros SWIFT; la disponibilidad para tu cuenta y el tratamiento por el banco receptor requieren confirmación.'})),
 ...['santander','bbva','galicia'].map(bank=>({origin:'directo',bank,status:bank==='santander'?'verified':'partial',instructions:['Pedile a COMEX de tu banco las instrucciones para recibir un cobro del exterior en USD.','Compartí con tu cliente tus datos de beneficiario y las coordenadas oficiales del banco.','Pedí el comprobante de transferencia para seguir la operación y conciliar gastos.'],sources:[bank==='galicia'?'galicia':bank],note:'La factura corresponde al cliente del servicio. El banco puede pedir contrato u otros respaldos.'}))
];
export const cryptoCases=[
 {name:'Cripto → banco USA → SWIFT → Argentina',status:'Requiere revisión',text:'Confirmar que la cuenta bancaria admite esos fondos, origen de la cripto, conversión, trazabilidad y aceptación COMEX. El SWIFT final no valida automáticamente todos los tramos.'},
 {name:'Cripto → billetera / Nexo Argentina → ARS → banco',status:'Requiere revisión',text:'Distinguir un servicio cobrado en cripto de la venta de activos propios. Recibir ARS no convierte una exportación en una operación local ni acredita por sí solo ingreso por MLC.'},
 {name:'Cripto → Nexo internacional / otra plataforma → Wallbit',status:'Sin guía completa',text:'Verificar activos y redes admitidos, titularidad, condiciones de cada proveedor y vía de retiro final. No asumimos compatibilidad entre plataformas.'},
 {name:'USD → Wallbit → SWIFT / exportador de servicio',status:'Documentación disponible',text:'Hay instrucciones publicadas para Santander. Se prepara Factura E y extracto con el cobro del cliente; revisá las condiciones de la modalidad elegida.'},
 {name:'USD → Wallbit → retiro local en ARS',status:'Operación y normativa separadas',text:'Wallbit documenta retiros locales. Para exportación corresponde Factura E; la transferencia local no acredita por sí sola cumplimiento del régimen cambiario.'}
];
