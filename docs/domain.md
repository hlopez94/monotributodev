# Dominio propio

Dominio principal: `monotributodev.com.ar`. Configurado el 30 de octubre de 2026.

El sitio sigue publicado mediante el workflow de GitHub Pages del repositorio
`hlopez94/monotributodev`. En Settings → Pages, el dominio personalizado es
`monotributodev.com.ar`. Al usar un workflow, GitHub no requiere un archivo CNAME.

## DNS

Zona de Cloudflare de la cuenta personal, con registros «Solo DNS»:

| Tipo | Nombre | Valor | TTL |
| --- | --- | --- | --- |
| A | @ | 185.199.108.153 | 300 |
| A | @ | 185.199.109.153 | 300 |
| A | @ | 185.199.110.153 | 300 |
| A | @ | 185.199.111.153 | 300 |
| AAAA | @ | 2606:50c0:8000::153 | 300 |
| AAAA | @ | 2606:50c0:8001::153 | 300 |
| AAAA | @ | 2606:50c0:8002::153 | 300 |
| AAAA | @ | 2606:50c0:8003::153 | 300 |
| CNAME | www | hlopez94.github.io | 300 |

GitHub redirige `www` al dominio principal. No agregar el nombre del repositorio
al destino CNAME. No activar un proxy durante la emisión del certificado de GitHub.

## HTTPS y opiniones

GitHub aprobó el certificado para el dominio principal y `www` el 30 de octubre
de 2026 y se activó «Enforce HTTPS» en Settings → Pages. Se verificaron HTTPS 200
en el dominio principal y las redirecciones de HTTP y `www` hacia HTTPS.
La emisión y la propagación pueden demorar al cambiar los DNS; revisar el estado
del certificado allí antes de modificar registros correctos.

El API de opiniones ya permite los orígenes HTTPS del dominio principal y `www`.
Turnstile admite `monotributodev.com.ar` y sus subdominios. Las URLs relativas del
frontend permiten servir los mismos archivos desde la raíz del dominio.

Referencia: [configuración oficial de dominios de GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Dominio secundario monotributo.dev — migración en curso

Preparado el 30 de octubre de 2026 en la misma cuenta de Cloudflare, zona
`2a4c6afaddd3ea101ae5044bda57b2c8`. El dominio principal de GitHub Pages sigue
siendo `monotributodev.com.ar`.

- Registros A proxied de `monotributo.dev` y `www.monotributo.dev` hacia
  `192.0.2.0`, dirección reservada para redirecciones sin servidor de origen.
- Regla de redirección 301 de ambos nombres hacia
  `https://monotributodev.com.ar`, conservando ruta y query string.
- Servidores asignados: `konnor.ns.cloudflare.com` y `rihana.ns.cloudflare.com`.
- Spaceship todavía delega en `launch1.spaceship.net` y `launch2.spaceship.net`.
  No había registros personalizados en su panel.
- Se autorizó y desactivó temporalmente DNSSEC en Spaceship, con compromiso de
  reactivarlo con Cloudflare al completar la migración. A las 14:55 UTC el panel
  confirmó «Deshabilitado», pero el registro .dev aún publicaba el DS anterior,
  clave 44011, algoritmo 13, digest 2. Su TTL era 1800 segundos.

El registro padre dejó de publicar el DS a las 14:56 UTC (11:56 de Argentina).
Esperar hasta después de las 15:26 UTC (12:26 de Argentina) antes de cambiar los
servidores, por la caché de 1800 segundos de la firma anterior.

Pendiente: dejar vencer ese TTL, cambiar la delegación a Cloudflare y comprobar activación, certificado HTTPS y
redirección (incluidos parámetros y fragmentos del navegador). Después de vencer
la caché de la delegación anterior (TTL observado 10800 segundos), habilitar
DNSSEC en Cloudflare y publicar su DS en Spaceship. Verificar la cadena DNSSEC.
No publicar las claves nuevas mientras sigan resolviéndose servidores anteriores.

[Migración DNSSEC según Cloudflare](https://developers.cloudflare.com/dns/dnssec/).
