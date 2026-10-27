# CENPAIF

Copia de cenpaif.com (Centro Psicológico de Atención Integral Familiar y Empresarial) como sitio estático,
igual a la web original en WordPress, publicada en Cloudflare Workers y mejorada desde aquí.

Dirección de prueba: [https://cenpaif-web.juanolartediaz13.workers.dev](https://cenpaif-web.juanolartediaz13.workers.dev)

El plan, las reglas y los tickets están en [HANDOFF.md](HANDOFF.md).

## Comandos

```bash
npm install      # una vez
npm run vista    # vista local en http://localhost:8080, se actualiza al guardar
npm run build    # arma el sitio en dist/ (es lo que hace Cloudflare)
```

## Dónde se cambia cada cosa

| Qué | Archivo |
|---|---|
| Teléfono, correo, WhatsApp, enlaces de pago, redes, menú | `src/sitio.mjs` |
| Reseñas de Google del inicio | `src/resenas.mjs` |
| Contenido de cada página | `src/paginas/*.njk` (una página por archivo) |
| Encabezado y menú | `src/plantillas/encabezado.njk` |
| Contacto, mapa y pie (salen en todas las páginas) | `src/plantillas/pie.njk` |
| Piezas que se repiten: título, botón, taller, video, visor de fotos | `src/plantillas/macros.njk` |
| Widget de reseñas | `src/plantillas/resenas.njk` |
| Estilos | `src/estilos.css` |
| Menú del celular, barra fija, carrusel, formulario a WhatsApp, videos, visor | `src/sitio.js` |
| Íconos y la forma de olas | `src/iconos/` y `src/formas/` |
| Redirecciones de la web anterior y caché | `public/_redirects` y `public/_headers` |

## Fotos

1. Pon la foto original en `fotos/` (JPG, PNG o WebP, sin importar el peso).
2. Úsala en una página con su nombre sin extensión: `{{ foto('nombre', 'texto alternativo', { tamanos: '...' }) }}`.
   Para cambiar una foto, reemplaza el archivo y deja el mismo nombre.
3. Corre `npm run vista`: se crean las versiones AVIF y WebP en `fotos/optimizadas/`.
4. Sube también `fotos/optimizadas/` al repositorio, así Cloudflare no tiene que repetir el trabajo.

## Reseñas

Las reseñas del inicio se muestran con el widget de Trustindex, igual que en la original. Ya no se actualizan solas
(eso lo hacía el plugin de WordPress): para agregar una, copia un bloque en `src/resenas.mjs` con el nombre, la fecha,
la foto de perfil de Google y el texto. El estilo del widget está en `public/resenas/trustindex-google-widget.css`.

## Videos

Los videos de los talleres están en `public/videos/` (MP4, menos de 25 MB cada uno, que es el límite de Cloudflare Workers).

## Cloudflare Workers

- Proyecto `cenpaif-web` conectado a GitHub
- Comando de compilación: `npm run build`
- Comando de despliegue: `npx wrangler deploy`
- Configuración: `wrangler.jsonc` (publica `dist/`)
- Versión de Node: Node 22 desde `.node-version`

## Cosas que quedaron distintas a la original a propósito

- Los botones de WhatsApp que no funcionaban (les faltaba el 57) ahora llevan a 573132712530.
- El formulario de contacto abre WhatsApp con el mensaje en vez de mandar un correo.
- El "+" de "Psicología presencial y Virtual" en el inicio lleva a Psicólogos en Chía (en la original lleva a una página que no existe).
- En el celular el menú se lee con letra oscura (en la original casi no se ve).
- La firma juan-olarte-dev en el pie.
