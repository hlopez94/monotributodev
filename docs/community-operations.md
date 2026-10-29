# Operación de la comunidad

API: https://monotributodev-community.her3814.workers.dev. Cuenta personal de Cloudflare elegida por el propietario. Base D1: monotributodev-community. Widget Turnstile: MonotributoDev · opiniones.

## Moderación

No existe endpoint administrativo público. El mantenedor entra al panel autenticado de Cloudflare → D1 → monotributodev-community → Console. Consultar `SELECT id, entity, route, experience_date, speed, ease, support, comment FROM reviews WHERE status='pending' ORDER BY created_at;`. Revisar que no haya datos privados, contenido abusivo o experiencias fabricadas. Aprobar con `UPDATE reviews SET status='approved' WHERE id='ID_REVISADO';` o rechazar con `status='rejected'`.

Nunca aprobar por puntuación positiva/negativa: ambas pueden ser experiencias válidas. Los agregados y la lista pública solo incluyen aprobados. Revisar también la tabla reports para reportes de opiniones publicadas. Un retiro o corrección de aporte se gestiona desde la base autenticada, sin exponer datos por GitHub.

## Privacidad y antiabuso

El formulario no recibe importes del simulador, CUIT ni cuentas. El pseudónimo de navegador se guarda en forma HMAC. La señal de frecuencia utiliza IP y día bajo HMAC, no IP en claro en D1. Los límites expiran a 48 horas y se depuran al recibir solicitudes; no se programó ninguna tarea recurrente. La retención de opiniones es hasta retiro o decisión del mantenedor. Cloudflare procesa red y antiautomatización según sus políticas. Los controles no verifican una persona única.

Las dimensiones tienen sus propios conteos; una dimensión sin puntuar no cuenta como cero. Solo las operaciones completadas guardan duraciones finales. Son horas corridas reportadas, no días hábiles certificados. No hay datos ficticios de puntuación en producción.

## Actualizar servicio

Config en community-api/wrangler.jsonc. `npm run api:bundle` valida el artefacto. Al desplegar, preservar bindings D1 y secretos existentes; no sobrescribirlos con valores vacíos. Los secretos son TURNSTILE_SECRET y HASH_SECRET, exclusivamente en bindings del Worker. La clave HMAC deriva de un secreto del servidor; rotarla cambia los pseudónimos de duplicados (planificar la rotación).

CORS permite únicamente el origen Pages y el dominio propio. Producción no permite localhost aunque el widget admita ese hostname; para pruebas locales usar una configuración separada con claves de prueba, nunca ampliar producción para sortear una prueba.

La comprobación Turnstile requiere success, acción review y hostname exacto del frontend. Los tokens son de un solo uso y el frontend los reinicia después de intentar enviar.

Límite conocido menor: reintentos del mismo aporte consumen solicitudes del límite diario aunque el identificador idempotente evita duplicarlo. No confundir la confirmación del POST con publicación: queda pendiente hasta revisión.
