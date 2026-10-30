# Dominios del sitio

Principal desde el 30 de octubre de 2026: **https://monotributo.dev**.
GitHub Pages (hlopez94/monotributodev, publicación por workflow) tiene
monotributo.dev como dominio personalizado y «Enforce HTTPS» activado.

## Cloudflare DNS

Ambas zonas están activas en la cuenta personal. Servidores de nombres:
konnor.ns.cloudflare.com y rihana.ns.cloudflare.com.

### monotributo.dev

Zona 2a4c6afaddd3ea101ae5044bda57b2c8.

| Tipo | Nombre | Valor | Proxy | TTL |
| --- | --- | --- | --- | --- |
| A | @ | 185.199.108.153 | Solo DNS | 300 |
| A | @ | 185.199.109.153 | Solo DNS | 300 |
| A | @ | 185.199.110.153 | Solo DNS | 300 |
| A | @ | 185.199.111.153 | Solo DNS | 300 |
| CNAME | www | hlopez94.github.io | Activado | Automático |

El principal usa el certificado aprobado de GitHub. www redirige en el edge de
Cloudflare al principal y usa el certificado universal activo de Cloudflare.
La regla de esta zona **solo** debe capturar www.monotributo.dev, nunca enviar
el principal al dominio anterior.

### monotributodev.com.ar

Zona a7814503fc336389c4067c6eec77fdbe.

Se conservan los cuatro A de GitHub Pages (185.199.108–111.153), los cuatro AAAA
2606:50c0:8000–8003::153 y el CNAME de www a hlopez94.github.io.
Todos están proxied para ejecutar la redirección en Cloudflare, con TTL automático.
El certificado universal de Cloudflare está activo para el apex y sus subdominios.

## Redirecciones

- monotributodev.com.ar → https://monotributo.dev
- www.monotributodev.com.ar → https://monotributo.dev
- www.monotributo.dev → https://monotributo.dev

Reglas 301 en la fase http_request_dynamic_redirect, con destino:
concat("https://monotributo.dev", http.request.uri.path) y
preserve_query_string: true. El navegador conserva el fragmento cuando la
respuesta no lo reemplaza: se verificó #bancos junto con la query en un navegador.

Si un navegador conserva una redirección 301 anterior de .dev a .com.ar, limpiar
su caché de navegación o probar con una query nueva. No volver a crear la regla
inversa: provocaría un bucle entre ambos dominios.

## Opiniones

ALLOWED_ORIGINS del API incluye HTTPS del principal y www, además de los orígenes
anteriores. Turnstile admite monotributo.dev y sus subdominios. Se conservaron las
claves secretas y la base D1; no se migraron ni eliminaron opiniones.
Se verificaron la consulta al API con Origin del principal y la carga de las
puntuaciones desde el navegador después de la redirección.

## DNSSEC — pendiente del último paso en Spaceship

La migración se autorizó con desactivación temporal de DNSSEC en Spaceship.
El registro padre dejó de publicar el DS anterior el 30/10 a las 14:56 UTC
(11:56 Argentina); el DS anterior tenía TTL de 1800 segundos.

Al retomar a las 15:16 UTC (12:16 Argentina), la delegación ya estaba cambiada
a Cloudflare. El TTL de los NS anteriores era 10800 segundos. Para no romper
resolutores que aún conserven esa delegación, esperar hasta después de las
18:20 UTC (15:20 Argentina) antes de publicar el DS nuevo en Spaceship.

Cloudflare ya firma la zona; su estado es pending hasta publicar este DS:

- Key tag: 2371
- Algoritmo: 13
- Tipo de digest: 2 (SHA-256)
- Digest: 73669FF7EA4A6642C2BE7B318C58F2134F99304E27418666A656AAF074554F0A

Estos son datos públicos. Antes de publicarlos, volver a consultar el DS de
Cloudflare y confirmar que no cambió. Después, comprobar DNSSEC activo y una
respuesta DNS validada. No declarar DNSSEC completo mientras siga pendiente.

Referencias:
[GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site),
[redirecciones Cloudflare](https://developers.cloudflare.com/rules/url-forwarding/),
[migración DNSSEC](https://developers.cloudflare.com/dns/dnssec/).
