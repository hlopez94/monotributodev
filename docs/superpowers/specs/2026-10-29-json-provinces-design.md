# Catálogos JSON y procedimientos provinciales

Solicitud: todos los catálogos editables como JSON legible, sin minimizar. Separar bancos, plataformas, rutas, casos, fuentes, metadatos y provincias. Una ficha por provincia. Conservar IDs y comportamientos existentes.

Fichas ampliadas para Buenos Aires, CABA, Córdoba, Santa Fe y Entre Ríos (alcance del material aportado). Tres bloques: régimen simplificado/unificado; tratamiento de exportaciones y gestiones; DDJJ mensual cuando corresponde. Enlaces oficiales por bloque, revisión fechada, advertencia de errores y aporte contextual. Otras jurisdicciones conservan organismo y faltantes explícitos.

El material recibido es una pista de investigación, no una norma: dos archivos idénticos, sin URLs. Registrar contrastes. No convertir exclusión, cese, no alcanzado, exención o padrón 0% en sinónimos. No prometer impuesto cero solo por emitir E; distinguir gravados locales, retenciones/saldos y obligaciones formales. No indicar baja nacional para corregir IIBB.

Selector del régimen provincial: desconocido, simplificado, general, no inscripto/no alcanzado/exento, CM. Instrucciones de DDJJ local solo para general; CM usa SIFERE, desconocido exige confirmar. Exenciones de pleno derecho no implican por defecto alta general y DDJJ. Textos fuera de guía verificada quedan pendientes.

Alternativas: mantener catálogo JS hace difícil contribuir; JSON por entidad individual para bancos/rutas agrega archivos sin necesidad. Elegido por solicitud: JSON por tema y por provincia. UI y lógica siguen React/módulos existentes, sin nueva dependencia.

Verificación: referencias entre JSON, unicidad/24 jurisdicciones, enlaces y estados por sección, selección de instrucciones sin recomendar presentación universal, pruebas/build/empaquetado y navegador escritorio/móvil. Publicar en Pages con flujo existente.
