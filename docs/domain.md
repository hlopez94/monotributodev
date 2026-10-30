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
