# CENPAIF · Manual de relevo para Gemini (jefe y hormigas)

**Estado:** 27 de octubre de 2026 · **Repositorio:** https://github.com/Juandicho13/cenpaif-web · **Rama:** `main` · **Sitio de prueba:** https://cenpaif-web.juanolartediaz13.workers.dev · **Dominio real:** cenpaif.com (sigue en WordPress, en Hostinger)

> Si algo de aquí choca con el código del repositorio, manda el repositorio: se corrige el código o se corrige este archivo, pero nunca se adivina.

## Índice

0. Cómo usar este manual
1. El proyecto en un minuto
2. Protocolo jefe y hormigas
3. Reglas de Juan
4. Estado exacto del proyecto
5. Cómo está hecho el sitio
6. Errores que ya pasaron y cómo no repetirlos
7. Convenciones de código
8. Auditoría: los 50 hallazgos y la decisión de Juan
9. Plan de trabajo: fases y tickets
10. Preguntas para la tía (decisiones abiertas)
11. Verificación
12. Plantillas de prompts
13. Enlaces

---

## 0. Cómo usar este manual

- **Juan:** al abrir una conversación nueva con el Gemini jefe, adjunta este archivo completo y pega el prompt 12.1. A cada hormiga le pegas el prompt 12.2, el ticket que escribió el jefe y la salida de los `cat` que pide el ticket. Las hormigas también reciben este archivo completo; como mínimo, las secciones 2, 3, 5, 6 y 7.
- **Gemini jefe:** lee todo antes de responder. Entregas los tickets (los de la sección 9 ya vienen escritos: los copias y los completas), revisas los cierres y mantienes al día la bitácora (4.5) y el plan (9). No escribes archivos grandes salvo que Juan lo pida.
- **Gemini hormiga:** haces un solo ticket. Antes de escribir código lees las secciones 2, 3, 5, 6 y 7 y pides los archivos que vas a tocar.
- **Claude:** los tickets marcados "con Claude" (reseñas automáticas, cambio de dominio y documento final) se hacen en el chat de Claude. Si una hormiga falla dos veces en lo mismo, Juan lleva el ticket a Claude.
- La versión vigente de este manual vive en la raíz del repo como `HANDOFF.md`. Cada ticket cerrado agrega su fila a la bitácora (4.5) en el mismo commit o en el siguiente.
- Las conversaciones y los archivos de Claude son privados y Gemini no puede abrirlos. Todo lo esencial está copiado aquí.

---

## 1. El proyecto en un minuto

**CENPAIF** (Centro Psicológico de Atención Integral Familiar y Empresarial) es el consultorio de la Dra. Claudia Yolima Díaz Ovalle, tía de Juan, en Chía (Cundinamarca). Ofrece psicología presencial y virtual, terapia de pareja y familiar, orientación vocacional, el programa de empoderamiento individual, talleres de inteligencia emocional, talleres para empresas y la aplicación de la batería de riesgo psicosocial. También alquila una oficina por horas en el mismo edificio.

**Para qué existe la web:** que la gente agende cita (Doctoralia y WhatsApp), se inscriba a talleres, que las empresas pidan cotización y que alguien alquile la oficina.

**Historia:** la web original es un WordPress con Elementor en Hostinger. En octubre de 2026 Claude hizo una copia exacta como sitio estático (mismo aspecto, mucho más rápida). Ahora se mejora por fases (sección 9) y al final se pasa el dominio a Cloudflare.

**Principios que no se negocian**

1. Se ve igual que hoy salvo lo que un ticket cambia a propósito. Un cambio visual que nadie pidió es un error.
2. Rápida: la meta es 95 o más en Lighthouse para celular en todas las páginas.
3. Accesible y legible en celular: la mayoría de las visitas llegan desde el teléfono.
4. Sin librerías ni dependencias nuevas salvo que un ticket lo diga. HTML, CSS y JavaScript simples.
5. Todo cambio que vea un visitante queda en la bitácora, porque al final se le entrega a la tía un documento con todo lo que se hizo.

**Equipos y entorno de Juan**

| Pieza | Detalle |
| --- | --- |
| Computador | MacBook Air M4 con macOS 26 (Tahoe) |
| Editor | Antigravity (basado en VS Code). Al guardar puede reformatear el CSS en varias líneas; no importa |
| Terminal | zsh (ver reglas en la sección 3) |
| Node | 24 en el Mac. Cloudflare usa 22 (sale de `.node-version`) |
| Navegador | Chrome |
| Teléfonos de prueba | Galaxy S25 Ultra (Android) y iPhone 18 Pro (iOS) |

---

## 2. Protocolo jefe y hormigas

### 2.1 Roles

| Rol | Hace | No hace |
| --- | --- | --- |
| Jefe | Elige el siguiente ticket (sección 9), lo entrega con la plantilla 12.3 y sus `cat`, revisa la entrega contra su "Terminado cuando", agrega la fila de la bitácora y mantiene este manual | Escribir de memoria archivos que no ha visto; marcar algo como hecho sin ver la salida de Juan; empezar un ticket que espera una respuesta de la tía (sección 10) |
| Hormiga | Ejecuta un ticket: pide los archivos que falten, entrega archivos completos, da los comandos de verificación y de git, y escribe el cierre | Tocar archivos fuera del ticket, cambiar textos o estilos que nadie pidió, agregar librerías |
| Juan | Pega archivos y salidas, aplica los cambios a mano, corre los comandos, mira la página y hace push | |

### 2.2 Flujo de un ticket

1. El jefe toma el ticket de la sección 9 y lo entrega completo con la plantilla 12.3, incluidos los `cat` que la hormiga necesita.
2. Juan abre una hormiga con el prompt 12.2, el ticket y la salida de esos `cat`.
3. La hormiga responde en este orden: plan en 3 a 6 líneas, archivos completos con su ruta, comandos para verificar y comandos de git (plantilla 12.4).
4. Juan aplica, corre `npm run build` y mira la página con `npm run vista` en los anchos de la sección 11.2. Si hay error, pega la salida desde la primera línea con `Error`.
5. Si falla, la hormiga corrige solo lo que el error señala y vuelve a entregar completos los archivos que cambian. Nunca reescribe todo desde cero.
6. Cuando pasa, Juan hace push. Cloudflare publica solo en un par de minutos y Juan revisa la dirección de prueba en el celular.
7. La hormiga escribe el cierre con la plantilla 12.5 y Juan se lo pega al jefe, que revisa, agrega la fila de la bitácora (4.5) y pasa al siguiente ticket.

**Tickets de propuesta:** los que cambian cómo se ve algo de forma importante (colores, letras, portada, página de pagos) se hacen en una rama `propuesta/<tema>`. Cloudflare le crea una vista previa a esa rama (aparece en Deployments). Juan, y la tía si hace falta, la miran en el celular y solo después se une a `main` (comandos en 12.4). Si la rama no muestra vista previa, se revisa con `npm run vista` y se le mandan capturas a la tía.

### 2.3 Reglas de oro

1. **No inventes.** Ni clases, ni funciones, ni archivos, ni rutas, ni textos de la tía. Si no viste un archivo en esta conversación, pide su `cat`. Los nombres reales de las funciones y macros están en la sección 5.
2. **Nada se da por hecho sin salida real.** "Funciona" solo se escribe después de que Juan pegó `Listo: 12 páginas en dist/` y miró la página.
3. **Nunca se hace push con el build fallando.** Pasó una vez y Cloudflare falló (sección 6).
4. **Un ticket, un commit** en `main`, salvo las propuestas (rama `propuesta/...`).
5. **Archivos completos.** Nunca fragmentos, diffs, "el resto queda igual" ni ZIP.
6. **Rutas exactas** desde la raíz del repo.
7. **No cambies lo que se ve fuera del ticket.** Revisa los cuatro anchos de la sección 11.2.
8. **Textos de la tía:** no se reescriben por iniciativa propia. Solo se cambia el texto que el ticket dice, y la ortografía se arregla en la fase 7.
9. **Pregunta antes de suponer** cuando el ticket deja dos caminos con consecuencias distintas.
10. **Archivos binarios** (fotos, letras, videos): Juan no puede descargar archivos que le mandan por chat. Una foto nueva se la manda la tía y Juan la pone en `fotos/`; si hace falta algo de internet, se baja con `curl` desde una URL pública.

### 2.4 Cómo pedirle archivos a Juan

Pide comandos listos para copiar en zsh, uno por línea, sin líneas de comentario con `#` y con los patrones entre comillas:

```
git status
git log --oneline -5
cat src/paginas/index.njk
cat src/estilos/07-inicio.css
grep -rn "galeria__texto" src
ls src/estilos
```

Antes de F0-02 el CSS está entero en `src/estilos.css`; después queda partido en `src/estilos/` (sección 5.4). Pide solo los archivos que el ticket toca.

---

## 3. Reglas de Juan

- Español de Colombia, con tuteo.
- **Nunca uses raya ni guion largo** (los signos que no son el guion corto del teclado) en ningún texto: respuestas, comentarios de código, mensajes de commit ni textos de la web. Usa comas, dos puntos, paréntesis o " · ".
- Código: siempre el contenido completo de cada archivo, pegado en el chat con su ruta. Nada de ZIP, descargas ni parches de git. Juan aplica los cambios a mano.
- Con cada cambio van los comandos de git: `git add` con las rutas, `git commit -m "..."` y `git push`. Mensajes en estilo Conventional Commits en español: `fix(inicio): ...`, `feat(alquiler): ...`, `perf: ...`, `docs: ...`, `refactor(css): ...`.
- En zsh: nada de líneas con `#` en los bloques de comandos (da `command not found: #`) y los patrones entre comillas (`--include="*.njk"`); sin comillas zsh responde `no matches found`.
- Si Juan tiene que pegar en la terminal un bloque largo que crea archivos, va como script: lo copia y corre `pbpaste | bash`. Pegado directo, zsh puede dañar las líneas que tienen `!`.
- Nombres de clases, variables y funciones en español, como el código actual. Comentarios en español.
- Firma: el pie lleva la firma "juan-olarte-dev" con línea vertical y el monograma JO, abajo a la derecha. Nunca se quita y debe verse completa.
- Textos nuevos para visitantes: tuteo, frases cortas, mayúscula solo al inicio de la oración y en nombres propios, sin raya.

---

## 4. Estado exacto del proyecto

### 4.1 Git

| Commit | Fecha | Quién | Qué |
| --- | --- | --- | --- |
| `5d51d81` | 2026-10-26 | Juan | Copia exacta de cenpaif.com |
| `9fb3f39` y `906fad5` | 2026-10-26 | Juan | Archivos que faltaban y configuración de Cloudflare (`wrangler.jsonc`) |
| `9732d70` | 2026-10-26 | Claude | Letras Gilroy y videos de los talleres |
| (este) | 2026-10-27 | Claude | Este manual |

Solo existe la rama `main`. Hasta el cambio de dominio (fase 9), `main` es el sitio de prueba: nadie lo ve en cenpaif.com, así que se trabaja directo en `main`.

### 4.2 Publicación

| Pieza | Valor |
| --- | --- |
| Servicio | Cloudflare Workers con Workers Builds (no Pages), proyecto `cenpaif-web`, cuenta de Juan |
| Conexión | GitHub `Juandicho13/cenpaif-web`, rama de producción `main`. Cada push publica solo |
| Comando de compilación | `npm run build` |
| Comando de despliegue | `npx wrangler deploy` (lee `wrangler.jsonc`: publica `./dist` y sirve `404.html` cuando una página no existe) |
| Dirección | https://cenpaif-web.juanolartediaz13.workers.dev |
| Último build | `#708f9604` en verde, 34 s |
| Dominio cenpaif.com | Sigue en WordPress. Registrado en Hostinger desde 2018, **vence el 15 de enero de 2027**. DNS en Hostinger (`ns1/ns2.dns-parking.com`) con correo de Hostinger configurado (MX, SPF, DKIM, DMARC, autodiscover). Ver fase 9 |

`_headers` y `_redirects` funcionan igual en Workers (Claude lo comprobó en la dirección de prueba: cabeceras de seguridad, caché de un año para `/css`, `/img`, `/fuentes` y `/js`, `/contacto/` redirige a `/#contacto` y una página que no existe da 404).

### 4.3 Árbol de archivos

```
HANDOFF.md                  este manual
README.md                   comandos y dónde se cambia cada cosa
build.mjs                   arma el sitio en dist/ y sirve la vista local
wrangler.jsonc              Cloudflare: publica dist/ como sitio estático
package.json, package-lock.json, .node-version (22), .gitignore
fotos/                      43 fotos originales (JPG, PNG, WebP)
fotos/optimizadas/          AVIF y WebP que crea el build (se suben al repo)
fuentes/                    gilroy-light, gilroy-medium y gilroy-bold (woff2)
public/                     se copia tal cual a dist/
public/_headers             cabeceras de seguridad y caché
public/_redirects           páginas viejas de WordPress
public/robots.txt
public/resenas/trustindex-google-widget.css
public/videos/              5 videos de los talleres (MP4)
src/sitio.mjs               datos del sitio: teléfono, correo, WhatsApp, enlaces, redes, menú y GTM
src/resenas.mjs             las 9 reseñas de Google del inicio
src/sitio.js                comportamiento de la página (sección 5.5)
src/estilos.css             todo el CSS (F0-02 lo parte en src/estilos/)
src/iconos/                 13 SVG: casa, cerrar, correo, facebook, flecha-abajo, instagram, lapiz, linkedin, mas-circulo, perfil, play, telefono, youtube
src/formas/olas.svg         la ola de las secciones
src/marca/icono.webp        de aquí sale el favicon
src/plantillas/             base.njk, encabezado.njk, pie.njk, macros.njk, resenas.njk
src/paginas/                una página por archivo (.njk)
```

Páginas y su dirección:

| Archivo | Dirección |
| --- | --- |
| `index.njk` | `/` |
| `psicologos-en-chia.njk` | `/psicologos-en-chia/` |
| `terapia-de-pareja.njk` | `/terapia-de-pareja/` |
| `programa-de-empoderamiento-individual.njk` | `/programa-de-empoderamiento-individual/` |
| `orientacion-vocacional.njk` | `/orientacion-vocacional/` |
| `talleres-de-inteligencia-emocional.njk` | `/talleres-de-inteligencia-emocional/` |
| `talleres-empresariales.njk` | `/talleres-empresariales/` |
| `aplicacion-de-bateria-de-riesgo-psicosocial.njk` | `/aplicacion-de-bateria-de-riesgo-psicosocial/` |
| `sobre-nosotros.njk` | `/sobre-nosotros/` |
| `pagos.njk` | `/pagos/` |
| `alquiler-de-oficina-por-horas.njk` | `/alquiler-de-oficina-por-horas/` |
| `404.njk` | página de error |

### 4.4 Medidas de partida (22 de octubre de 2026)

Lighthouse para celular sobre la copia (y la original, para comparar):

| Página | Copia | Original |
| --- | --- | --- |
| Inicio | 62 (computador: 100) | 30 (computador: 65) |
| Psicólogos en Chía | 97 | 59 |
| Alquiler | 90 | |
| Talleres de inteligencia emocional | 96 | |
| Sobre Nosotros | 96 | |

- Accesibilidad 96 en todas. Fallas de axe: contraste en 12 páginas, contenido fuera de regiones en 12, falta de título principal (h1) en 11.
- Lo que más frena el inicio en celular viene de afuera: Google Tag Manager con Analytics (unos 300 KB y 468 ms de bloqueo) y el botón "Asesoría en Línea" de masleads (243 KB y 352 ms). El mapa de Google pesa casi 500 KB.
- El HTML valida casi limpio: solo un `aria-label` mal puesto y la imagen vacía del visor.

### 4.5 Bitácora

Cada ticket cerrado agrega una fila. La columna "Para el documento final" se escribe en palabras de la tía, porque con ella se arma el documento final (F10-01).

| Fecha | Ticket | Commit | Para el documento final | Verificado |
| --- | --- | --- | --- | --- |
| 2026-10-26 | Copia exacta | `5d51d81` | La web pasó de WordPress a un sitio estático igual, mucho más rápido (Lighthouse en celular: inicio de 30 a 62) | Claude: mismas alturas que la original en 1440, 1366, 1024, 800 y 390 px |
| 2026-10-26 | Archivos que faltaban y Cloudflare | `9fb3f39`, `906fad5` | | El build de Cloudflare pasó del error de `resenas.mjs` al de las letras |
| 2026-10-26 | Letras y videos | `9732d70` | La web quedó publicada en una dirección de prueba | Build `#708f9604` en verde; Claude revisó páginas, 404, redirecciones y cabeceras |
| 2026-10-27 | Manual para Gemini | (este) | | |

---

## 5. Cómo está hecho el sitio

### 5.1 El build (`build.mjs`)

`npm run build` hace esto, en orden:

1. Borra `dist/` y copia `public/` adentro.
2. **Fotos:** por cada archivo de `fotos/` crea AVIF (calidad 50) y WebP (calidad 74) en los anchos 400, 800, 1200 y 1600 que quepan. Las guarda en `fotos/optimizadas/<nombre>.<huella>/` con un archivo `listo`; si ya existen no las repite. Las copia a `dist/img/`.
3. **Favicon:** sale de `src/marca/icono.webp` (32, 180, 192 y 270 px).
4. **Letras:** copia las de Google desde los paquetes `@fontsource` y las Gilroy desde `fuentes/`, con huella en el nombre.
5. **CSS:** Tailwind CLI solo minifica (no se usan clases de Tailwind). Después cambia `/fuentes/<nombre>.woff2` por la ruta con huella y escribe `dist/css/sitio.<huella>.css`.
6. **JS:** copia `src/sitio.js` como `dist/js/sitio.<huella>.js` (sin minificar todavía; F2-05).
7. **Páginas:** cada `src/paginas/*.njk` se arma con Nunjucks. `index` va a `/`, `404` a `404.html` y el resto a `/<nombre>/index.html`.
8. `sitemap.xml` con todas las páginas menos la 404.
9. **Revisión de enlaces:** avisa con `⚠` los enlaces internos o fotos que no existen.
10. Termina con `Listo: 12 páginas en dist/ (N ms)`. Si sale otra cosa, falló.

`npm run vista` hace lo mismo, sirve `dist/` en http://localhost:8080 y vuelve a armar al guardar un archivo de `src`, `public`, `fotos` o `fuentes`.

La huella en el nombre de los archivos hace que el navegador los guarde un año: si el contenido cambia, cambia el nombre.

### 5.2 Páginas y plantillas

Cada página empieza con datos en JSON entre dos líneas `---`:

```
---
{
    "titulo": "Terapia de Pareja - CENPAIF",
    "descripcion": "Texto para Google",
    "imagen": "nombre-de-una-foto",
    "clase": "clase-del-body"
}
---
{% extends "base.njk" %}
{% import "macros.njk" as m %}

{% block precarga %}{% endblock %}
{% block contenido %}
...
{% endblock %}
```

- `titulo` y `descripcion` van al `<title>`, a la descripción para Google y a las etiquetas para redes. `imagen` (opcional) es la foto al compartir. `clase` (opcional) va en el `<body>`.
- `base.njk` arma el `<head>`, incluye `encabezado.njk`, pone el contenido en `<main>` e incluye `pie.njk`.
- `pie.njk` tiene, en este orden: contacto con el formulario (va en todas las páginas), el mapa, el pie con teléfono, correo y dirección, y la barra de derechos con la firma.
- `resenas.njk` es el widget de Trustindex del inicio (usa `src/resenas.mjs`).

### 5.3 Funciones y macros disponibles en las plantillas

Funciones globales (definidas en `build.mjs`):

| Función | Para qué |
| --- | --- |
| `foto(nombre, alt, { tamanos, clase, prioridad })` | `<picture>` con AVIF y WebP en todos los anchos. `nombre` es el archivo de `fotos/` sin extensión. Sin `prioridad` la foto carga perezosa (`loading="lazy"`); con `prioridad: true` lleva `fetchpriority="high"` |
| `precargarFoto(nombre, tamanos, medio)` | `<link rel="preload">` para la foto principal; va en el bloque `precarga` |
| `rutaFoto(nombre, ancho)` | Ruta de un tamaño concreto (WebP) |
| `fondoFoto(nombre, ancho)` | Texto para un `style` con la foto como fondo en AVIF y WebP |
| `icono(nombre, clase)` | SVG de `src/iconos/` en línea, con `fill="currentColor"` y `aria-hidden` |
| `forma(nombre, clase)` | SVG de `src/formas/` en línea |
| `whatsapp(mensaje)` | Enlace `https://wa.me/573132712530`, con `?text=` si se le pasa un mensaje |
| `sitio` | Los datos de `src/sitio.mjs` |
| `activos` | Rutas con huella del CSS, el JS y las letras |
| `resenas` | Las reseñas de `src/resenas.mjs` |
| filtro `jsonld` | Datos estructurados para Google |

Macros (`src/plantillas/macros.njk`, se usan como `m.boton(...)`):

| Macro | Para qué |
| --- | --- |
| `titulo(texto, nivel='h3', clase='')` | Título con la raya de puntos. Clases: `titulo-ekit--centro`, `--movil-centro`, `--verde`, `--400`, `--29`, `titulo-grande`, `titulo-grande--sube`, `titulo-script` |
| `boton(texto, url, alinear='centro', clase='')` | Botón lila. Si la URL empieza por `http` abre en otra pestaña |
| `taller(foto_, titulo, texto, clase='')` | Tarjeta de taller |
| `video(archivo, clase='')` | "Ver Video" con el botón redondo; el archivo va en `public/videos/` |
| `visorFotos()` | Visor de fotos de Alquiler (uno por página) |
| `ventanaVideo()` | Ventana del video (una por página) |

### 5.4 CSS

- Copia del modelo de Elementor: `.e-seccion > .e-contenedor > .e-columna > .e-envoltura`. Ancho de caja 1140 px (`.e-contenedor--ancho` para el ancho completo), columnas con 10 px de relleno y 20 px entre piezas (`.e-envoltura > *:not(:last-child)`). No llevan ese margen las secciones internas, `.ancla` ni `.ancho-propio`.
- Anchos: celular hasta 767 px, tableta de 768 a 1024 px, computador desde 1025 px.
- Clases en español al estilo BEM: `bloque__elemento--modificador` (por ejemplo `.galeria__item`, `.boton-envoltura--centro`).
- Utilidades: `.oculto-movil`, `.solo-movil`, `.solo-lectores` (texto solo para lectores de pantalla), `.ancla`, `.espacio`.
- Colores (en `:root`): `--lila` #8586ce, `--morado` #422360, `--morado-pie` #3d275d, `--azul-noche` #242c64, `--azul-oscuro` #113d64, `--azul-tinta` #042533, `--azul-borde` #373f90, `--verde-agua` #699f9e, `--gris-claro` #f6f7f9, `--gris-texto` #7a7a7a, `--celeste` #6ec1e4, `--dorado` #9c7425.
- Letras: Manrope, Montserrat, Dancing Script, Oswald y Didact Gothic (de Google, desde `@fontsource`) y Gilroy (Light 100, Medium 400, Bold 700, desde `fuentes/`). F6-01 las reduce.
- Después de F0-02 el CSS vive en `src/estilos/`, un archivo por sección, y el build los junta en orden:

| Archivo | Qué tiene |
| --- | --- |
| `00-cabecera.css` | Comentario de presentación |
| `01-letras.css` | `@font-face` |
| `02-colores.css` | Variables de color |
| `03-base.css` | Base del tema Hello Elementor |
| `04-rejilla.css` | Rejilla de Elementor |
| `05-piezas.css` | Piezas que se repiten: títulos, botones, textos (`.texto-gilroy`, `.texto-manrope`, `.cita`) |
| `06-encabezado.css` | Encabezado y menú (`.menu`, `.menu--fija`, panel del celular) |
| `07-inicio.css` | Portada, galería de servicios, carrusel y reseñas |
| `08-servicios.css` | Páginas de servicios y talleres |
| `09-franja-edificio.css` | Franja con la foto del edificio |
| `10-pagos.css` | Pagos |
| `11-visor.css` | Visor de fotos de Alquiler |
| `12-error-404.css` | Página de error |
| `13-contacto.css` | Contacto y formulario |
| `14-pie.css` | Mapa, pie, derechos y firma |

### 5.5 `src/sitio.js`

Un solo archivo sin librerías, dentro de una función que se llama sola:

1. Menú del celular (abrir, cerrar, Escape), submenú de Servicios y barra del menú fija al bajar 60 px (solo con más de 767 px; clase `menu--fija`).
2. Portada del inicio: alterna las dos fotos cada 5 s (`[data-alternar]`).
3. Carrusel de Beneficios: avanza cada 5 s y se pausa con el mouse encima (`[data-carrusel]`).
4. Formulario de contacto (`[data-formulario-whatsapp]`): arma el mensaje y abre WhatsApp.
5. Videos de los talleres: botones `[data-video]` abren `#video-ventana`.
6. Visor de fotos de Alquiler (`#visor`, galerías `[data-visor]`).
7. Reseñas: carga `https://cdn.trustindex.io/loader.js` cuando `[data-resenas]` está a menos de 800 px de verse.
8. Google Tag Manager (`window.CENPAIF_GTM`): se carga con la primera interacción o 2 s después de cargar la página.

### 5.6 Fotos

1. La foto original va en `fotos/` (JPG, PNG o WebP, sin importar el peso). El nombre en minúsculas y con guiones.
2. En la página: `{{ foto('nombre', 'texto alternativo', { tamanos: '(max-width: 767px) 92vw, 540px' }) }}`. `tamanos` es el ancho con el que se ve la foto en cada pantalla.
3. `npm run build` crea las versiones optimizadas (la primera vez tarda) y hay que subir también `fotos/optimizadas/`.
4. Para cambiar una foto: se reemplaza el archivo con el mismo nombre. Nunca se editan a mano los archivos de `fotos/optimizadas/`.

### 5.7 Terceros

| Servicio | Dónde | Nota |
| --- | --- | --- |
| Google Tag Manager `GTM-KHSMRWMG` | `src/sitio.mjs` (`gtm`) y `sitio.js` | Carga Google Analytics (`G-34JYTRPEVG`) y el botón verde "Asesoría en Línea" de masleads (wa.masleads.com.co, tochat.be), que además consulta la IP del visitante en api.ipify.org. Hoy también carga en la vista local y en la dirección de prueba |
| Trustindex | `resenas.njk`, `public/resenas/` | Widget de reseñas del inicio, con textos en inglés |
| Google Maps | `pie.njk` (`sitio.enlaces.mapa`) | Mapa en todas las páginas |
| Doctoralia | `sitio.enlaces.doctoralia` | Casi todos los botones de agendar |
| Google Calendar | `sobre-nosotros.njk` | Solo el botón de Sobre Nosotros |
| Formularios de Google | talleres de inteligencia emocional, talleres empresariales y alquiler | Dos piden iniciar sesión (H3) |
| Wompi y PayPal | `sitio.enlaces.wompi`, `sitio.enlaces.paypal` | Página de pagos |

---

## 6. Errores que ya pasaron y cómo no repetirlos

| # | Síntoma | Causa | Cómo se hace bien |
| --- | --- | --- | --- |
| 1 | Cloudflare: `ERR_MODULE_NOT_FOUND ... src/resenas.mjs` | El primer commit no tenía 26 archivos (los que no se pegaron como texto) | Antes del push, `npm run build` en el Mac debe terminar con `Listo: 12 páginas en dist/` |
| 2 | Cloudflare: `ENOENT ... fuentes/gilroy-light.woff2` | Se hizo push aunque el build local había fallado | Nunca push con el build fallando |
| 3 | `ls ~/Downloads` no muestra nada y `mv` dice `no matches found` | Juan no puede descargar archivos que le mandan por chat | Nada depende de descargas: texto pegado, `curl` desde una URL o Claude lo sube al repo |
| 4 | `zsh: no matches found` | Patrón sin comillas o archivos que no existen | Patrones entre comillas y revisar con `ls` antes |
| 5 | `zsh: command not found: #` | Se pegaron comentarios en la terminal | Bloques de comandos sin líneas `#` |
| 6 | Un bloque pegado en la terminal se daña | zsh interpreta `!` en lo que se pega | Copiar el bloque y correr `pbpaste \| bash` |
| 7 | El CSS de Juan tiene el doble de líneas que el original | El editor lo reformatea al guardar | No importa: el CSS minificado queda igual. Nunca cites números de línea; busca con `grep -n` |
| 8 | Se creó un Worker en vez de un proyecto de Pages | Así lo ofrece hoy Cloudflare | Funciona con `wrangler.jsonc`. No crear otro proyecto |
| 9 | Las reseñas no aparecían en las pruebas automáticas | El widget de Trustindex solo se dibuja cuando hay actividad del usuario | Al probar, mover el mouse o bajar por la página |
| 10 | La copia se descuadró 20 px en celular | En Elementor las piezas con ancho propio no llevan el margen de 20 px | Esas piezas llevan la clase `ancho-propio` (5.4) |
| 11 | Las alturas cambian 1 a 3 px entre la copia y la original | Redondeo de las fotos optimizadas | Es normal |
| 12 | Las pruebas de Juan cuentan como visitas en Analytics | GTM carga en cualquier dirección | F2-02 lo limita a cenpaif.com |

---

## 7. Convenciones de código

- **HTML (Nunjucks):** sangría de 4 espacios. Los textos van en la página, no en el CSS. Enlaces externos con `target="_blank" rel="noopener"`. Toda foto con `foto()`, nunca `<img>` a mano.
- **CSS:** clases en español al estilo BEM; colores con las variables de `:root`; los cambios para celular dentro de `@media (max-width: 767px)` y para tableta en `@media (max-width: 1024px)` o `@media (min-width: 768px) and (max-width: 1024px)`; nada de `!important` salvo que el ticket lo pida.
- **JS:** todo en `src/sitio.js`, sin librerías, `var` y funciones como en el resto del archivo, cada parte con su comentario de sección.
- **Datos:** teléfono, correo, enlaces, redes y menú solo en `src/sitio.mjs`. Nunca se escriben a mano en una página.
- **Accesibilidad:** cada botón o enlace que solo tiene un ícono lleva `aria-label`; las fotos que dicen algo llevan texto alternativo y las decorativas `alt=""`.
- **Git:** un commit por ticket con su mensaje Conventional Commits en español. Se suben también `fotos/optimizadas/` cuando cambian fotos.

---

## 8. Auditoría: los 50 hallazgos y la decisión de Juan

Claude revisó la copia el 22 de octubre de 2026 (Lighthouse, axe, validador de HTML, todos los textos, capturas en 390 y 1440 px, enlaces, dominio y normas). Juan decidió el orden el 27 de octubre.

### 8.1 Lo primero

| H | Hallazgo | Ticket | Decisión |
| --- | --- | --- | --- |
| H1 | El dominio vence el 15 de enero de 2027 (Hostinger) | F9-01 | Con fecha: renovar a tiempo |
| H2 | cenpaif.com tiene correo en Hostinger; para usar el dominio sin www en Cloudflare hay que pasar los DNS | F9-02 | Se pasan los DNS copiando los registros del correo |
| H3 | Dos formularios de Google piden iniciar sesión (inscripción a talleres de inteligencia emocional y solicitud de alquiler) | F1-14 | Ahora: que se llenen sin iniciar sesión |
| H4 | Contenido equivocado: en Batería aparece "Objetivo: desarrollar habilidades internas y externas..." (es de Empoderamiento); "Interacciones exitosas" tiene la descripción de "Complicidad emocional" | F0-03 y F5-01 | Revisar todo con cuidado con la tía |
| H5 | En celular no se ven los nombres de los servicios del inicio ni los planes y precios de Alquiler (solo salen al pasar el mouse) | F1-01 | Ahora: es la mejora más grande |

### 8.2 Legal (al final)

| H | Hallazgo | Ticket |
| --- | --- | --- |
| H6 | La Ley 1090 de 2006 (art. 11, literal b) prohíbe "prometer resultados en la curación" y publicar "falsos éxitos terapéuticos"; el art. 2 pide anunciar las competencias "cuidadosa y objetivamente". Frases: "Resultados en corto tiempo", "resultados rápidos y duraderos", "Resultados comprobados", "Mejor psicóloga", "los mejores psicólogos" | F8-01 |
| H7 | Falta la política de tratamiento de datos (Ley 1581 de 2012 y Decreto 1377 de 2013) y la casilla de autorización en los formularios; en un centro de psicología los mensajes pueden traer datos de salud, que son sensibles | F8-02 |
| H8 | Las fotos de servicios parecen de Freepik (con cuenta gratis exige dar crédito) y Gilroy Medium y Bold son de pago | F8-03 |

### 8.3 Textos

| H | Hallazgo | Ticket | Decisión |
| --- | --- | --- | --- |
| H9 | Ortografía: Escríbemos (inicio), escribemos y Prepraración (orientación), Sábamos (talleres de inteligencia emocional), "decisione" cortado (empoderamiento), ¿Porqué? y "a si mismo" (orientación), "mind fullness" y "Re-Programar" (empoderamiento), "técnicas cómo" y "compromiso. adaptamos" (sobre nosotros), Cedula (alquiler), "secretaria de salud" (psicólogos), "tu máximo. potencial", "y a escucha activamente" y "y fortalecer" donde va "y fortalece" (talleres de inteligencia emocional), "test auto aplicables" y la coma en "La aplicación de la Batería..., es una exigencia legal" (inicio y batería), "Diaz" sin tilde (pie) | F7-01 | Al final; cada corrección va al documento final |
| H10 | En inglés: "Home" (menú), "Email" (formulario y pie), Prev, Next y Close (visor), "Read more", "Posted on Google", "2 years ago" y el aviso de Trustindex (reseñas) | F7-02 (las reseñas se resuelven en F2-06) | Al final |
| H11 | Signos y mayúsculas: "¡¡Decídete y escribemos para iniciar!!.", frases que terminan en "!." sin "¡", títulos con mayúscula en cada palabra ("¿Cuándo Necesitas Terapia de Pareja?", "Agenda Tu Consulta"), comillas alrededor de párrafos que no son citas (inicio, terapia de pareja, sobre nosotros), "Domingo a Domingo", "AV. Bolívar" | F7-03 | Al final |
| H12 | El nombre sale como CENPAIF, Cenpaif y cenpaif, y la dirección de tres formas (Cl o Cll, Consultorio u Oficina 509, "Offices Center Chía Elite") | F7-04 | Al final |
| H13 | Repetidos: "¿Por qué Elegir Psicólogos en CENPAIF?" dos veces seguidas; Orientación Vocacional repite su título; Talleres Empresariales se titula "Servicios Empresariales" | F1-12 | Ahora |
| H14 | El pie dice "© Cenpaif 2024"; se mezcla tú con usted ("sus valores", "sus metas", "sus áreas" en empoderamiento) | F1-13 | Ahora |

### 8.4 Celular y uso (ahora)

| H | Hallazgo | Ticket |
| --- | --- | --- |
| H15 | La portada del inicio en celular es diminuta: el texto casi no se lee y queda encima de la foto | F1-05 (propuesta) |
| H16 | Texto justificado (`.texto-gilroy`, `.texto-manrope`, `.cita`): en celular deja huecos enormes, hasta en títulos | F1-02 |
| H17 | Teléfono y correo no se pueden tocar; la dirección no abre el mapa | F1-03 |
| H18 | Listas escritas como párrafo corrido (Empoderamiento) o con "●" a mano (Batería) | F1-04 |
| H19 | Botones confusos. Juan: ver la propuesta y no cambiar nada hasta estar de acuerdo; Doctoralia o Calendar lo decide la tía | F1-15 |
| H20 | WhatsApp sin mensaje: la tía no sabe desde qué página escriben | F1-07 |
| H21 | El formulario dice "Enviar" pero abre WhatsApp | F1-06 |
| H22 | Alquiler no está en el menú; "por horas" en el título y "por jornadas" en el texto; precios sin $ | F1-08 |
| H23 | La página de error no tiene mensaje | F1-09 |
| H24 | El botón flotante tapa la firma al final de la página y en celular tapa títulos | F1-10 |
| H25 | En computador el contenido salta 34 px cuando la barra del menú se vuelve fija | F1-11 |

### 8.5 Confianza y contenido

| H | Hallazgo | Ticket | Decisión |
| --- | --- | --- | --- |
| H26 | Sobre Nosotros no dice el nombre de la doctora; faltan foto, tarjeta profesional, estudios, experiencia y el código de habilitación | F5-02 | De acuerdo |
| H27 | En Google tiene 5,0 con 25 opiniones; la web muestra 9 reseñas fijas de 2024 | F2-06 y F5-05 | Que escoja solas las mejores y más nuevas |
| H28 | Faltan precios y preguntas frecuentes | F5-03 | De acuerdo |
| H29 | Pagos son solo dos imágenes de botón, sin explicación | F5-04 | Hacerla mejor y más bonita |
| H30 | El canal de YouTube tiene 101 videos que no se usan | F5-06 | De acuerdo |

### 8.6 Diseño, velocidad, accesibilidad y Google (todo de acuerdo)

| H | Hallazgo | Ticket |
| --- | --- | --- |
| H31 | Seis familias de letra en 8 archivos | F6-01 (propuesta) |
| H32 | Espacios y tamaños disparejos: huecos en blanco, títulos gigantes en celular, botones de cuatro líneas | F6-02 |
| H33 | Fotos de stock y capturas de pantalla en los talleres | F6-03 |
| H34 | Botón "Asesoría en Línea" de masleads: 243 KB, lo que más frena el celular | F2-03 |
| H35 | Google Tag Manager y Analytics: unos 300 KB, y carga también en pruebas | F2-02 |
| H36 | Mapa de Google: casi 500 KB en todas las páginas | F2-01 |
| H37 | La primera foto de Alquiler carga tarde; JS sin minificar | F2-04 y F2-05 |
| H38 | Contraste: blanco sobre `--lila` da 3,33 a 1 (mínimo 4,5) en botones y barra del menú | F3-01 (propuesta) |
| H39 | 11 de 12 páginas sin h1; "Ver Video", "Teléfono" y "Email" marcados como títulos | F3-02 |
| H40 | Fotos con alt vacío que sí dicen algo; alt "1", "2" y "Foto Cluadia"; el lema del encabezado es una imagen | F3-03 |
| H41 | Portada y carrusel cambian solos sin pausa; los botones tiemblan; no se respeta "reducir movimiento" | F3-04 |
| H42 | Los videos no tienen subtítulos | F3-06 |
| H43 | Títulos de página pobres: "cenpaif - CENPAIF", "pagos - CENPAIF", "psicólogos en chía - CENPAIF" | F4-01 |
| H44 | Las 12 páginas tienen la misma descripción para Google | F4-01 |
| H45 | Datos estructurados incompletos; `og:locale` dice `es_ES` | F4-02 |
| H46 | Nombre, dirección y teléfono distintos en la web y en Google Maps ("#6A--56") | F4-03 |
| H47 | Sin artículos ni preguntas frecuentes para aparecer en más búsquedas | F4-04 |
| H48 | Plan del cambio de dominio | F9-02 y F9-03 |
| H49 | Falta HSTS | F9-03 |
| H50 | El enlace de YouTube trae `?view_as=subscriber` y el de Doctoralia ya redirige a `/perfil/claudia-yolima-diaz-ovalle` | F4-02 |

---

## 9. Plan de trabajo: fases y tickets

### 9.1 Fases

| Fase | Qué entrega | Depende de | Lista cuando |
| --- | --- | --- | --- |
| F0 Preparar el terreno | Manual y README al día, CSS partido por secciones, revisión de contenido para la tía | Nada | El CSS está en `src/estilos/` sin ningún cambio visible y la tía tiene sus preguntas |
| F1 Celular, uso y arreglos de una vez | H3, H5, H13 a H25 | La tía solo en F1-14 y en lo que diga F1-15 | Todo se lee y se toca bien en el S25 Ultra y el iPhone 18 Pro |
| F2 Velocidad | Mapa liviano, Analytics solo en producción, botón propio de WhatsApp, fotos, JS minificado, reseñas sin Trustindex | La tía en F2-02 y F2-03 | 95 o más en Lighthouse para celular en todas las páginas |
| F3 Accesibilidad | Contraste, títulos, textos alternativos, movimiento, regiones | Visto bueno al color (F3-01) | 100 en accesibilidad de Lighthouse y axe sin fallas |
| F4 Google | Títulos, descripciones, datos estructurados, nombre y dirección iguales | Coordenadas y horario de la tía | 12 títulos y 12 descripciones únicos; datos estructurados válidos |
| F5 Confianza y contenido | Contenido corregido, la doctora, precios y preguntas, pagos nueva, reseñas automáticas, videos | Textos, datos y fotos de la tía | La tía aprueba cada página |
| F6 Diseño | Dos familias de letra, espacios parejos, fotos reales | Visto bueno de Juan y la tía | Propuestas aprobadas y unidas a `main` |
| F7 Textos finales | Ortografía, inglés, signos y mayúsculas, un solo nombre y dirección | F5 cerrada | Ningún hallazgo de H9 a H12 queda y cada corrección está en la bitácora |
| F8 Legal y licencias | Frases de publicidad, política de datos, licencias | La tía | La tía aprueba los textos legales |
| F9 Cambio de dominio (con Claude) | Dominio renovado, DNS en Cloudflare con el correo, cenpaif.com en el Worker | F1 a F8 cerradas, salvo F9-01 que es urgente | cenpaif.com muestra la web nueva y el correo sigue llegando |
| F10 Documento final (con Claude) | Documento para la tía con todo lo que se hizo | Todo | La tía lo recibe |

Orden: F0, F1, F2, F3 y F4 se pueden hacer ya. F5 y F6 avanzan cuando lleguen las respuestas de la tía (sección 10). F7, F8, F9 y F10 van al final, en ese orden. **F9-01 (renovar el dominio) no espera: hay que hacerlo antes del 15 de enero de 2027.**

### 9.2 Cómo leer un ticket

Cada ticket trae: **rama**, **hallazgo** (H), **archivos** (los que se crean o cambian), **cat** (lo que Juan pega a la hormiga), **pasos**, **fuera de alcance**, **terminado cuando**, **verificación** y **para la bitácora** (la frase del documento final). Los tickets se hacen en orden salvo que se diga lo contrario. Los de F0 a F2 están completos; los demás traen lo esencial y el jefe los completa con la plantilla 12.3 cuando lleguen.

### 9.3 F0 · Preparar el terreno

**F0-01 · README al día**
- Rama: `main`. Hallazgo: ninguno (documentación).
- Archivos: `README.md`, `package.json`.
- cat: `cat README.md` · `cat package.json` · `cat wrangler.jsonc`
- Pasos:
  1. En `README.md`, cambiar todo lo de Cloudflare Pages por Cloudflare Workers: proyecto `cenpaif-web` conectado a GitHub, compilación `npm run build`, despliegue `npx wrangler deploy`, configuración en `wrangler.jsonc`, Node 22 desde `.node-version`.
  2. Agregar la dirección de prueba (sección 4.2) y una línea: "El plan, las reglas y los tickets están en HANDOFF.md".
  3. En `package.json`, la descripción pasa a "Copia estática de cenpaif.com publicada en Cloudflare Workers". Nada más cambia en ese archivo.
- Fuera de alcance: código.
- Terminado cuando: `grep -n "Pages" README.md package.json` no muestra nada y `npm run build` termina con `Listo: 12 páginas en dist/`.
- Para la bitácora: (nada visible).

**F0-02 · Partir el CSS por secciones (sin cambios visibles)**
- Rama: `main`. Hallazgo: ninguno (prepara el terreno: las hormigas trabajan con archivos de 20 a 470 líneas en vez de uno de 2.350).
- Archivos: se borra `src/estilos.css`; se crean 15 archivos en `src/estilos/` (tabla 5.4); cambia `build.mjs` (solo la función `compilarCss` y el comentario de la primera línea); un script temporal `partir-css.mjs` en la raíz que no se sube.
- cat: `cat build.mjs` · `grep -n "^/\* ---------- " src/estilos.css`
- Antes de empezar, Juan corre `npm run build` y luego `ls dist/css` y anota el nombre (hoy es `sitio.aec4c407.css`).
- Pasos:
  1. El `grep` debe mostrar 14 títulos de sección. Si muestra otro número, la hormiga para y se lo dice al jefe.
  2. La hormiga entrega este script tal cual (Claude lo probó con el CSS de Juan):

```
// Parte src/estilos.css en un archivo por sección dentro de src/estilos/.
// Se usa una sola vez (ticket F0-02) y después se borra.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const nombres = ['cabecera', 'letras', 'colores', 'base', 'rejilla', 'piezas', 'encabezado', 'inicio',
    'servicios', 'franja-edificio', 'pagos', 'visor', 'error-404', 'contacto', 'pie'];
const lineas = readFileSync('src/estilos.css', 'utf8').split('\n');
const cortes = [0];
lineas.forEach((l, i) => { if (/^\/\* ---------- .* ---------- \*\/$/.test(l)) cortes.push(i); });
if (cortes.length !== nombres.length) {
    console.error(`Esperaba ${nombres.length - 1} títulos de sección y encontré ${cortes.length - 1}. No se cambió nada.`);
    process.exit(1);
}
mkdirSync('src/estilos', { recursive: true });
cortes.forEach((inicio, k) => {
    const trozo = lineas.slice(inicio, cortes[k + 1] ?? lineas.length).join('\n').replace(/\n+$/, '') + '\n';
    const archivo = `src/estilos/${String(k).padStart(2, '0')}-${nombres[k]}.css`;
    writeFileSync(archivo, trozo);
    console.log(`${archivo}: ${trozo.split('\n').length - 1} líneas`);
});
```

  3. En `build.mjs`, `compilarCss` se reemplaza por esta versión (también probada; `construir()` ya la llama con `await`):

```
// El CSS está partido por secciones en src/estilos/ (00-cabecera.css, 01-letras.css...).
// Se juntan en orden alfabético y Tailwind solo los minifica.
async function compilarCss() {
    const carpeta = path.join(raiz, 'src', 'estilos');
    const partes = (await readdir(carpeta)).filter((f) => f.endsWith('.css')).sort();
    const textos = await Promise.all(partes.map((f) => readFile(path.join(carpeta, f), 'utf8')));
    const entrada = path.join(raiz, '.cache', 'estilos.css');
    await writeFile(entrada, textos.join('\n'));
    const paquete = path.join(raiz, 'node_modules', '@tailwindcss', 'cli', 'package.json');
    const cli = path.join(path.dirname(paquete), 'dist', 'index.mjs');
    const temporal = path.join(raiz, '.cache', 'sitio.css');
    const r = spawnSync(process.execPath, [cli, '-i', entrada, '-o', temporal, '--minify'], { cwd: raiz, encoding: 'utf8' });
    if (r.status !== 0) throw new Error(`El CSS no compiló:\n${r.stderr}`);
    return readFile(temporal, 'utf8');
}
```

  4. La primera línea de `build.mjs` dice "es lo que publica Cloudflare Pages": pasa a "es lo que publica Cloudflare".
  5. Juan guarda el script como `partir-css.mjs` en la raíz y corre `node partir-css.mjs`. Revisa que salgan los 15 archivos y luego borra el script y el CSS viejo (comandos abajo).
- Fuera de alcance: cambiar una sola regla de CSS. No se usa `@import` (Tailwind le agrega un comentario de licencia y cambia la huella).
- Terminado cuando: `ls dist/css` muestra exactamente el mismo nombre que antes (`sitio.aec4c407.css`): eso prueba que el CSS quedó idéntico. Y `npm run vista` vuelve a armar al guardar un archivo de `src/estilos/`.
- Verificación:

```
node partir-css.mjs
rm partir-css.mjs
git rm src/estilos.css
npm run build
ls dist/css
```

- Git: `git add src/estilos build.mjs` · `git commit -m "refactor(css): partir el CSS en un archivo por sección"` · `git push`
- Para la bitácora: (nada visible).

**F0-03 · Revisión de contenido para la tía (sin código)**
- Rama: `main`. Hallazgos: H4 y lo que encuentre.
- Archivos: nuevo `docs/CONTENIDO.md`.
- cat: `cat src/paginas/index.njk src/paginas/psicologos-en-chia.njk src/paginas/terapia-de-pareja.njk` y así con las 12 páginas (en tandas si el chat se llena) · `cat src/plantillas/pie.njk`
- Pasos:
  1. Por cada página, una sección con lo que hay que preguntarle a la tía, citando el texto actual entre comillas: (a) contenido equivocado o copiado de otra página, (b) frases incompletas o que no se entienden, (c) datos que faltan (precios, horarios, fechas de talleres), (d) títulos que preguntan algo que la página no responde.
  2. Incluir sí o sí lo de H4, además de: "¿Cuándo necesitas terapia de pareja?" no dice cuándo; "Sesiones personalizadas para adultos que buscan superar problemas como: ansiedad, depresión y crecimiento personal. Entre otras."; Orientación vocacional "Plan de acción claro: Orientación a padres si lo requieren" y "Cartilla material de trabajo"; Alquiler "por horas" o "por jornadas"; "Re.descubre" y "conecta.dos" (confirmar que el punto es a propósito).
  3. Terminar con "Preguntas para Claudia", numeradas y fáciles de responder por WhatsApp.
- Fuera de alcance: corregir ortografía (F7) o reescribir textos. Esto es solo la lista.
- Terminado cuando: el documento cubre las 12 páginas y el pie, y Juan lo puede reenviar a la tía.
- Git: `git add docs/CONTENIDO.md` · `git commit -m "docs: revisión de contenido para la tía"` · `git push`
- Para la bitácora: (nada visible).

**F0-04 · Mandarle las preguntas a la tía (Juan, sin hormiga)**
- Juan le manda a la tía el mensaje de la sección 10 y, cuando exista, `docs/CONTENIDO.md`. Las respuestas se anotan en la sección 10.

### 9.4 F1 · Celular, uso y arreglos de una vez

**F1-01 · Galerías que se leen sin mouse (servicios del inicio y precios de Alquiler)**
- Rama: `main`. Hallazgo: H5.
- Archivos: `src/estilos/07-inicio.css`, `src/paginas/index.njk`, `src/paginas/alquiler-de-oficina-por-horas.njk`.
- cat: `cat src/estilos/07-inicio.css` · `cat src/paginas/index.njk` · `sed -n 1,40p src/paginas/alquiler-de-oficina-por-horas.njk`
- Cómo es hoy: `.galeria__texto` está debajo de la foto con `transform: translateY(100%)` y solo sube con `.galeria__tarjeta:hover`. En Alquiler, `.galeria__ampliar` (el enlace que abre el visor) cubre toda la tarjeta.
- Pasos:
  1. Solo dentro de `@media (hover: none), (max-width: 1024px)`: el texto va debajo de la foto y siempre visible (`position: static`, sin `transform`), con colores del sitio sobre fondo claro: nombre en `--azul-noche`, descripción en `#000`. Sin velo oscuro ni zoom.
  2. Inicio: el nombre del servicio pasa a ser un enlace al servicio (`<a class="galeria__nombre" href="...">`, el mismo `href` del "+"). En táctil el "+" se ve siempre. En computador el nombre sigue apareciendo al pasar el mouse, igual que hoy.
  3. Alquiler: el enlace `.galeria__ampliar` pasa a estar dentro de `.galeria__foto` (que necesita `position: relative`), para que cubra solo la foto. Tocar la foto abre el visor y el texto con los precios queda visible debajo.
  4. En computador con mouse (más de 1024 px) todo queda igual que hoy.
- Fuera de alcance: textos, formato de precios (F1-08) y colores.
- Terminado cuando: en 390 y 768 px se leen los 7 servicios del inicio con su descripción y las 6 tarjetas de Alquiler con sus planes y precios; tocar el nombre de un servicio abre su página; tocar una foto de Alquiler abre el visor; en 1440 px todo se ve como antes.
- Para la bitácora: "En el celular ya se ven los servicios del inicio con su descripción y los planes y precios de la oficina."

**F1-02 · Texto alineado a la izquierda**
- Rama: `main`. Hallazgo: H16.
- Archivos: `src/estilos/05-piezas.css`.
- cat: `grep -rn "justify" src/estilos` · `cat src/estilos/05-piezas.css`
- Pasos: en `.texto-gilroy`, `.texto-manrope` y `.cita`, cambiar `text-align: justify` por `text-align: left`. Los títulos que hoy están centrados siguen centrados.
- Terminado cuando: `grep -rn "text-align: justify" src/estilos` no muestra nada; en 390 px no quedan huecos grandes entre palabras ("Servicios de Psicología en CENPAIF" en Psicólogos en Chía se ve normal).
- Para la bitácora: "Los textos se leen mejor: ya no quedan huecos grandes entre palabras en el celular."

**F1-03 · Teléfono, correo y dirección que se pueden tocar**
- Rama: `main`. Hallazgo: H17.
- Archivos: `src/sitio.mjs`, `src/plantillas/pie.njk`, `src/estilos/14-pie.css` si hace falta que los enlaces se vean igual que el texto de hoy.
- cat: `cat src/sitio.mjs` · `cat src/plantillas/pie.njk` · `cat src/estilos/14-pie.css`
- Pasos:
  1. En `sitio.mjs` agregar `telefonoEnlace: 'tel:+573132712530'` y, dentro de `enlaces`, `comoLlegar: 'https://www.google.com/maps?cid=14521195418546587632'` (es la ficha de CENPAIF en Google Maps; Juan comprueba que abre la ficha correcta).
  2. En el pie: el teléfono es un enlace `tel:`, el correo un `mailto:` y la dirección abre `comoLlegar` en otra pestaña. Mismo color y tamaño de hoy, con subrayado solo al pasar el mouse o con el foco.
- Terminado cuando: en el iPhone y el S25 Ultra, tocar el teléfono ofrece llamar, el correo abre la app de correo y la dirección abre Google Maps en la ficha de CENPAIF.
- Para la bitácora: "Desde el celular se puede llamar, escribir el correo o abrir el mapa con un toque."

**F1-04 · Listas de verdad**
- Rama: `main`. Hallazgo: H18.
- Archivos: `src/paginas/programa-de-empoderamiento-individual.njk`, `src/paginas/aplicacion-de-bateria-de-riesgo-psicosocial.njk`, `src/estilos/08-servicios.css` si las listas necesitan estilo.
- cat: las dos páginas · `cat src/estilos/08-servicios.css`
- Pasos:
  1. Empoderamiento: los párrafos de "1. Valoración", "2. Sanación / Liberación emocional", "3. Fortalecimiento", "4. Empoderamiento" y "Beneficios del proceso" pasan a `<ul>`, un punto por idea. Cortes para "1. Valoración": Establecer metas claras / Identificar propósito personal / Priorizar lo importante / Reconocimiento de Tu estado emocional actual. / Identificar lo que bloquea el crecimiento / Reconocer Situaciones y patrones de comportamiento que generen malestar o bloqueo O Dificultades o retos en tus relaciones interpersonales y con el dinero / Identificar Fortalezas y áreas de mejora. En las demás, cortar donde empieza cada idea con mayúscula. Las palabras no se cambian (mayúsculas y ortografía son de F7; "sus" a "tus" es de F1-13).
  2. Batería: las tres listas con "●" y `<br>` pasan a `<ul>` sin los "●". El bloque "Objetivo:" no se toca (es contenido equivocado, F5-01).
  3. Las listas se ven como las otras listas de las páginas de servicios (viñeta, sangría y espacio entre líneas).
- Terminado cuando: en 390 y 1440 px cada idea va en su línea con viñeta.
- Para la bitácora: "Las listas de Empoderamiento y Batería se leen punto por punto."

**F1-05 · Portada del inicio en celular (propuesta)**
- Rama: `propuesta/portada-movil`. Hallazgo: H15. Depende de F1-15 para los textos de los botones.
- Archivos: `src/paginas/index.njk`, `src/estilos/07-inicio.css`.
- cat: `cat src/paginas/index.njk` · `cat src/estilos/07-inicio.css`
- Pasos: solo hasta 767 px, la portada se ordena en columna: título grande (unos 30 px), el texto en 16 px que no quede encima de la foto, dos botones de ancho completo (agendar cita y WhatsApp, con los textos aprobados en F1-15) y la foto de la doctora más pequeña. Fondo morado con la ola, igual que hoy. Tableta y computador no cambian.
- Terminado cuando: Juan y la tía aprueban la vista previa en el celular; se une a `main` (12.4).
- Para la bitácora: "La portada del inicio se lee bien en el celular y tiene botones claros para agendar o escribir por WhatsApp."

**F1-06 · El botón del formulario dice que abre WhatsApp**
- Rama: `main`. Hallazgo: H21.
- Archivos: `src/plantillas/pie.njk`.
- Pasos: el botón "Enviar" del formulario de contacto pasa a "Enviar por WhatsApp". Si el botón queda más ancho, que no se salga del recuadro en 390 px.
- Para la bitácora: "El formulario de contacto avisa que el mensaje se envía por WhatsApp."

**F1-07 · WhatsApp con mensaje según la página**
- Rama: `main`. Hallazgo: H20.
- Archivos: `src/plantillas/encabezado.njk`, `src/paginas/index.njk`, `src/paginas/orientacion-vocacional.njk`, `src/paginas/talleres-empresariales.njk`, `src/paginas/alquiler-de-oficina-por-horas.njk`.
- cat: `grep -rn "whatsapp(" src/plantillas src/paginas` y los archivos que salgan.
- Pasos: cada `whatsapp()` sin mensaje pasa a `whatsapp('...')` con uno de estos:
  - Encabezado: "Hola, vengo de la página web de CENPAIF."
  - Inicio: "Hola, vengo de la página web de CENPAIF y quiero información."
  - Orientación vocacional: "Hola, quiero información sobre la orientación vocacional."
  - Talleres empresariales: "Hola, quiero información sobre los talleres para mi empresa."
  - Alquiler: "Hola, quiero información sobre el alquiler de la oficina."
- Fuera de alcance: los textos de los botones (F1-15).
- Terminado cuando: cada enlace abre WhatsApp con el mensaje escrito y `npm run build` no muestra avisos.
- Para la bitácora: "Los mensajes de WhatsApp llegan diciendo desde qué página escribe la persona."

**F1-08 · Alquiler en el menú y precios con formato**
- Rama: `main`. Hallazgo: H22 ("por horas" o "por jornadas" espera a la tía).
- Archivos: `src/sitio.mjs` (menú), `src/paginas/alquiler-de-oficina-por-horas.njk`.
- Pasos:
  1. Agregar "Alquiler de oficinas" al menú, después de "Pagos" y antes de "Contacto", con `url: '/alquiler-de-oficina-por-horas/'`. Revisar que el menú quepa en una línea en 768, 1024 y 1440 px y que en el celular salga en el panel.
  2. Precios: "48.000 hora" a "$48.000 la hora", "80.000 para planes..." a "$80.000 para planes...", "960.000 mensuales" a "$960.000 al mes" y "320.000 mensuales" a "$320.000 al mes".
- Terminado cuando: el menú tiene Alquiler en todas las páginas y la página marca la opción como actual; los cuatro precios llevan $.
- Para la bitácora: "El alquiler de oficinas aparece en el menú y los precios se leen claros."

**F1-09 · Página de error útil**
- Rama: `main`. Hallazgo: H23.
- Archivos: `src/paginas/404.njk`, `src/estilos/12-error-404.css`.
- Pasos: un mensaje corto ("No encontramos esta página"), una frase de ayuda y enlaces al inicio, a los servicios principales y a WhatsApp, con el estilo de la web.
- Terminado cuando: una dirección inventada (por ejemplo `/no-existe/`) muestra el mensaje en 390 y 1440 px; sigue con `noindex`.
- Para la bitácora: "Si alguien entra a una dirección que no existe, ve un mensaje y enlaces para seguir."

**F1-10 · El botón flotante no tapa la firma ni los títulos**
- Rama: `main`. Hallazgo: H24.
- Archivos: `src/estilos/14-pie.css`.
- Pasos: dar espacio debajo de la barra de derechos (unos 80 px) para que al final de la página el botón flotante quede debajo de la firma y no encima. La firma sigue abajo a la derecha (regla de Juan).
- Terminado cuando: en 390 y 1440 px, al bajar hasta el final, la firma juan-olarte-dev se ve completa.
- Para la bitácora: (nada para la tía).

**F1-11 · Sin salto al fijar el menú**
- Rama: `main`. Hallazgo: H25.
- Archivos: `src/sitio.js`, `src/estilos/06-encabezado.css`.
- Pasos: cuando la barra pasa a `menu--fija`, reservar su alto (por ejemplo con un relleno en el encabezado igual a `barra.offsetHeight`) para que el contenido no suba. En celular no cambia nada (ahí la barra no se fija).
- Terminado cuando: en 1440 y 1024 px, al bajar despacio por el inicio, el texto no salta cuando la barra se pega arriba.
- Para la bitácora: "Al bajar por la página el contenido ya no da un salto."

**F1-12 · Repetidos**
- Rama: `main`. Hallazgo: H13.
- Archivos: `src/paginas/psicologos-en-chia.njk`, `src/paginas/orientacion-vocacional.njk`, `src/paginas/talleres-empresariales.njk`.
- Pasos:
  1. Psicólogos en Chía: el segundo "¿Por qué Elegir Psicólogos en CENPAIF?" pasa a "Atención presencial y virtual", que es de lo que habla esa sección.
  2. Orientación vocacional: el segundo título "Orientación Vocacional" (el h2 de la sección "Acompañamiento profesional...") pasa a "Presencial y virtual". Los botones repetidos se resuelven en F1-15.
  3. Talleres empresariales: el título de la portada "Servicios Empresariales" pasa a "Talleres Empresariales", como en el menú.
- Para la bitácora: "Se quitaron títulos repetidos en Psicólogos en Chía, Orientación vocacional y Talleres empresariales."

**F1-13 · Año automático y tuteo**
- Rama: `main`. Hallazgo: H14.
- Archivos: `build.mjs` (global `anio`), `src/plantillas/pie.njk`, `src/paginas/programa-de-empoderamiento-individual.njk`.
- Pasos:
  1. En `build.mjs`, agregar a `globales` `anio: new Date().getFullYear()` y en el pie usar `{{ anio }}` en vez de 2024.
  2. Empoderamiento: "sus valores", "sus metas" y "sus áreas" pasan a "tus valores", "tus metas" y "tus áreas". Las frases que hablan de los pacientes en tercera persona ("sus pacientes") no se tocan.
- Terminado cuando: el pie dice el año actual y `grep -rn " sus " src/paginas` solo muestra frases en tercera persona.
- Para la bitácora: "El año del pie se actualiza solo y la web le habla a la persona siempre de tú."

**F1-14 · Formularios sin iniciar sesión**
- Hallazgo: H3. Depende de la respuesta de la tía (pregunta 2 de la sección 10).
- Opción A (la tía usa las respuestas en su hoja de cálculo): ella cambia dos cosas en cada formulario. En Configuración, Respuestas: apagar "Limitar a 1 respuesta" y en "Recopilar direcciones de correo" elegir "Respuestas del encuestado" (no "Verificados"). Y quitar las preguntas de "Subir archivo" (piden iniciar sesión siempre); los documentos del alquiler se piden por WhatsApp. Sin código. Juan comprueba en una ventana de incógnito que se abren sin pedir cuenta.
- Opción B (no le importa la hoja): formularios propios en la página que abren WhatsApp con los datos, como el de contacto. Talleres de inteligencia emocional: nombre, celular, correo y taller (lista con los talleres de la página). Alquiler: nombre, celular, correo, plan (por hora, 8 horas al mes, 64 horas al mes) y fecha deseada, con el aviso "Los documentos (cédula, RUT, cámara de comercio y tarjeta profesional si aplica) los recibimos por WhatsApp". Archivos: las dos páginas, `src/sitio.js` (generalizar `[data-formulario-whatsapp]` para que lea los campos de cada formulario), el CSS de los formularios.
- Terminado cuando: en el iPhone sin sesión de Google se puede inscribir a un taller y pedir la oficina.
- Para la bitácora: "Inscribirse a un taller o pedir la oficina ya no exige tener cuenta de Google."

**F1-15 · Propuesta de botones (no se cambia nada sin aprobación)**
- Hallazgo: H19. Esta es la propuesta de Claude. Juan marca qué aprueba; la tía decide Doctoralia o Google Calendar (pregunta 4). Con eso el jefe escribe F1-15b (aplicarla).

| # | Dónde | Hoy dice | Lleva a | Propuesta | Llevaría a |
| --- | --- | --- | --- | --- | --- |
| 1 | Encabezado | Escríbenos | WhatsApp | Escríbenos | WhatsApp con mensaje (F1-07) |
| 2 | Inicio, portada | Agenda tu cita | Doctoralia | Agenda tu cita, más un segundo botón "Escríbenos por WhatsApp" (F1-05) | Lo que decida la tía |
| 3 | Inicio, Psicología integral | Agenda tu consulta | Doctoralia | Agenda tu cita | Lo que decida la tía |
| 4 | Inicio, Beneficios | Escríbemos por whatsapp | WhatsApp | Escríbenos por WhatsApp | WhatsApp con mensaje |
| 5 | Psicólogos en Chía, Terapia de pareja y Empoderamiento (dos por página) | Agenda tu consulta, Agenda Tu Consulta Presencial o Virtual, Agenda tu consulta en CENPAIF | Doctoralia | Agenda tu cita (todos iguales) | Lo que decida la tía |
| 6 | Sobre Nosotros | Agenda tu consulta | Google Calendar | Agenda tu cita | El mismo destino que los demás |
| 7 | Orientación vocacional (dos botones iguales) | Orientación Vocacional Presencial y Virtual | WhatsApp | Uno solo: "Agenda tu orientación vocacional" | WhatsApp con mensaje |
| 8 | Orientación vocacional | "Más Información" (enlace) y "¡¡Decídete y escribemos para iniciar!!." (texto sin enlace) | WhatsApp / nada | Un solo botón: "Escríbenos por WhatsApp" | WhatsApp con mensaje |
| 9 | Talleres de inteligencia emocional (dos) | Formulario de Inscripción; Inscríbete y nos comunicaremos contigo | Formulario de Google | Inscríbete al taller | El formulario de F1-14 |
| 10 | Talleres empresariales | Consulta por whatsapp | WhatsApp | Cotiza talleres para tu empresa | WhatsApp con mensaje |
| 11 | Talleres empresariales | Inscríbete y nos comunicaremos contigo | Formulario de Google | Inscríbete a las capacitaciones virtuales | Igual |
| 12 | Batería de riesgo psicosocial | Solicita información y agenda tu evaluación de riesgo psicosocial con nosotros. | Doctoralia | Cotiza la batería para tu empresa | WhatsApp con mensaje (Doctoralia es para pacientes, no para empresas) |
| 13 | Alquiler | Diligencia el formulario | Formulario de Google | Solicita la oficina | El formulario de F1-14 |
| 14 | Pie | Enviar | WhatsApp | Enviar por WhatsApp (F1-06) | Igual |
| 15 | Pagos | Imágenes "Paga con Wompi" y "PayPal" | Wompi y PayPal | Botones de verdad "Pagar con Wompi" y "Pagar con PayPal" | Igual (F5-04) |

Reglas de la propuesta: el texto dice lo que pasa al tocar, máximo cinco palabras, un solo botón principal por sección y el mismo texto para la misma acción en toda la web.

### 9.5 F2 · Velocidad

**F2-01 · Mapa liviano**
- Rama: `propuesta/mapa` (cambia cómo se ve la sección). Hallazgo: H36.
- Archivos: `src/plantillas/pie.njk`, `src/estilos/14-pie.css`, `src/sitio.js`.
- Pasos: en vez del `<iframe>` de Google Maps, un recuadro del mismo alto con la dirección y dos botones: "Ver el mapa aquí" (al tocarlo, `sitio.js` pone el `iframe`) y "Cómo llegar" (abre `sitio.enlaces.comoLlegar` de F1-03). Sin imágenes de mapas de Google copiadas.
- Terminado cuando: al cargar cualquier página no se pide nada a google.com/maps hasta tocar "Ver el mapa aquí" (pestaña Red de Chrome); el mapa abre bien al tocar.
- Para la bitácora: "El mapa ya no se carga solo en cada página: la web abre más rápido y el mapa sale cuando la persona lo pide."

**F2-02 · Analytics solo en cenpaif.com**
- Rama: `main`. Hallazgo: H35. Depende de la pregunta 6 de la sección 10.
- Archivos: `src/sitio.js`.
- Pasos: Google Tag Manager se carga solo si `location.hostname` es `cenpaif.com` o `www.cenpaif.com`. Así las pruebas no cuentan como visitas.
- Si la tía no usa Analytics (F2-02b): se quita GTM y se activa Cloudflare Web Analytics (gratis, sin cookies) en el panel de Cloudflare cuando el dominio esté allá (fase 9). Ojo: GTM también pone el botón de masleads, así que F2-02b va junto con F2-03.
- Terminado cuando: en localhost y en la dirección de prueba no se pide `googletagmanager.com` (pestaña Red).
- Para la bitácora: (nada para la tía; si se cambia de Analytics, explicarlo).

**F2-03 · Botón propio de WhatsApp**
- Rama: `main`. Hallazgo: H34. Depende de la pregunta 5 (si la tía le paga a masleads o usa sus reportes).
- Archivos: `src/plantillas/base.njk` o `pie.njk`, `src/estilos/14-pie.css`.
- Pasos: un botón redondo verde de WhatsApp abajo a la derecha, con el texto "Asesoría en línea" en computador, que abre `whatsapp()` con mensaje; sin JavaScript externo. Se quita masleads del contenedor de GTM (eso lo hace quien administre GTM) o, si se quita GTM (F2-02b), desaparece solo. Respetar F1-10: no tapa la firma.
- Terminado cuando: el botón se ve en 390 y 1440 px, abre WhatsApp con mensaje y ya no se pide nada a masleads.com.co ni a tochat.be.
- Para la bitácora: "El botón de WhatsApp ahora es propio: la web carga mucho más rápido en el celular."

**F2-04 · Fotos que cargan a tiempo**
- Rama: `main`. Hallazgo: H37.
- Archivos: `src/paginas/alquiler-de-oficina-por-horas.njk` y las páginas que Lighthouse marque.
- Pasos: la primera foto que se ve al abrir cada página lleva `prioridad: true` (y `precargarFoto` si es la principal); las demás siguen perezosas. Revisar en Lighthouse "Properly size images" y ajustar `tamanos` donde la foto se pida más grande de lo que se ve.
- Terminado cuando: Lighthouse no marca "LCP image was lazily loaded" en ninguna página.

**F2-05 · JavaScript minificado**
- Rama: `main`. Hallazgo: H37.
- Archivos: `package.json`, `package-lock.json`, `build.mjs`.
- Pasos: agregar `esbuild` a `dependencies` (`npm install esbuild`) y en `construir()` minificar `src/sitio.js` antes de `escribirConHuella` (`esbuild.transform(codigo, { minify: true })`). La vista local puede seguir sin minificar si es más cómodo para depurar.
- Terminado cuando: `ls -l dist/js` muestra el archivo más liviano que antes y todo funciona igual (menú, carrusel, formulario, videos, visor).

**F2-06 · Reseñas propias sin Trustindex (versión fija)**
- Rama: `propuesta/resenas`. Hallazgos: H27 (primera parte), H10 (inglés de las reseñas).
- Archivos: `src/plantillas/resenas.njk`, `src/sitio.js` (quitar la carga de Trustindex), `src/estilos/07-inicio.css`, se borra `public/resenas/`, `src/resenas.mjs` (agregar `calificacion: 5.0` y `total: 25` mientras llega F5-05).
- Pasos: la sección de reseñas se arma con HTML y CSS propios con los datos de `src/resenas.mjs`: calificación general con estrellas ("5,0 · 25 opiniones en Google"), tarjetas con nombre, foto, estrellas, fecha ("marzo de 2024") y texto con "Leer más", y dos enlaces: "Ver todas en Google" y "Deja tu opinión". En celular se desliza de lado; en computador se ven tres. Sin JavaScript de terceros.
- Terminado cuando: la tía aprueba la vista previa; ya no se pide nada a trustindex.io; todo en español.
- Para la bitácora: "Las reseñas de Google se ven con el diseño de la web, en español y más rápido."

**F2-07 · Medición de velocidad**
- Juan corre PageSpeed Insights (sección 11.3) en las 12 páginas sobre la dirección de prueba y pega los resultados de celular al jefe. Lo que esté por debajo de 95 se vuelve un ticket.

### 9.6 F3 · Accesibilidad

| Ticket | Qué | Archivos y pistas |
| --- | --- | --- |
| F3-01 (propuesta) | Contraste (H38): nueva variable `--lila-fuerte: #6667ba` (blanco encima da 4,98 a 1) solo para fondos con letra blanca: botones y barra del menú. El fondo lila del pie lleva letra negra y no cambia. La opción actual del menú deja de ser azul sobre lila: blanca con subrayado | `02-colores.css`, `05-piezas.css`, `06-encabezado.css`. Vista previa para la tía |
| F3-02 | Títulos (H39): un h1 por página (el título principal, que hoy es h3 o h2, sin cambiar cómo se ve), luego h2 y h3 en orden; "Ver Video", "Teléfono", "Email" y "Dirección" dejan de ser títulos (`p` con la misma clase) | Las 12 páginas, `macros.njk` (`titulo` ya recibe `nivel`), `pie.njk` |
| F3-03 | Textos alternativos (H40): la foto de la doctora, el consultorio y el edificio llevan una descripción corta; "1", "2" y "Foto Cluadia" se corrigen; las de servicios siguen con `alt=""` porque el nombre está al lado | Las páginas y `pie.njk` |
| F3-04 | Movimiento (H41): con `prefers-reduced-motion: reduce` no tiembla ningún botón, la portada no alterna y el carrusel no avanza solo; el carrusel y la portada llevan un botón pequeño de pausa | `05-piezas.css`, `07-inicio.css`, `sitio.js` |
| F3-05 | Regiones y foco: el contacto queda dentro de una región con nombre (`section aria-label="Contacto"` dentro de `main` o en el `footer`) para que axe no marque "region"; foco visible en enlaces y botones | `pie.njk`, `base.njk`, `03-base.css` |
| F3-06 (opcional) | Subtítulos (H42): cuando existan los `.vtt` de los videos, `video()` agrega `<track kind="captions" srclang="es">` | `macros.njk`, `public/videos/` |

Terminado cuando de la fase: Lighthouse da 100 en accesibilidad en las 12 páginas.

### 9.7 F4 · Google

| Ticket | Qué | Pistas |
| --- | --- | --- |
| F4-01 | Títulos y descripciones (H43, H44): cada página con su título de 60 caracteres o menos ("Psicólogos en Chía · CENPAIF", "Terapia de pareja en Chía · CENPAIF"...) y su descripción única de 140 a 155 caracteres con lo que ofrece y "Chía". La hormiga propone la tabla y Juan la aprueba en el cierre antes de aplicarla | Datos del inicio de las 12 páginas |
| F4-02 | Datos estructurados (H45, H50): `organizacion()` en `build.mjs` con `geo` (coordenadas que Juan saca de Google Maps), `openingHoursSpecification` (horario de la tía), `hasMap` (`comoLlegar`), la doctora como `Person` con `jobTitle` y, si la tía lo da, el número de tarjeta profesional; `og:locale` a `es_CO` en `base.njk`; YouTube sin `?view_as=subscriber` y Doctoralia con su dirección nueva en `sitio.mjs` | Validar con la prueba de resultados enriquecidos de Google (11.3) |
| F4-03 | Nombre, dirección y teléfono iguales (H46): un solo formato en `sitio.mjs` usado en el pie, el contacto y los datos estructurados; la tía corrige "#6A--56" en su perfil de Google | Va con F7-04 |
| F4-04 (después) | Preguntas frecuentes por servicio y algún artículo (H47) | Con el contenido de F5-03 |

### 9.8 F5 · Confianza y contenido

| Ticket | Qué | Depende de |
| --- | --- | --- |
| F5-01 | Contenido corregido (H4) con los textos que mande la tía en respuesta a `docs/CONTENIDO.md` | La tía |
| F5-02 | Presentación de la Dra. Claudia en Sobre Nosotros (H26): foto, nombre completo, tarjeta profesional, estudios, experiencia, habilitación de la Secretaría de Salud y su forma de trabajar | La tía |
| F5-03 | Precios o "desde" y preguntas frecuentes (H28): duración de la sesión, virtual o presencial, cancelaciones, medios de pago, horarios | La tía |
| F5-04 (propuesta) | Página de pagos nueva (H29), más clara y bonita: qué se paga, botones de verdad para Wompi y PayPal (para quien paga desde el exterior), los pasos (paga, manda el comprobante por WhatsApp con un mensaje listo, recibe la confirmación) y la política de cancelación | La tía |
| F5-05 (con Claude) | Reseñas automáticas: las mejores y más nuevas (H27). Plan A: API de Google Business Profile con la cuenta de la tía; una GitHub Action corre cada día, trae todas las reseñas, escoge las de 5 estrellas con texto, las ordena por fecha, guarda las 9 más nuevas con la calificación y el total en `src/resenas.mjs` y hace commit, y Cloudflare publica solo. Google pide aprobar el acceso a esa API (formulario, cuota 0 hasta aprobar) y que el perfil esté verificado hace más de 60 días. Mientras tanto queda F2-06 | La tía (acceso al perfil) |
| F5-06 | Videos de YouTube en las páginas de servicios (H30), con una vista previa liviana que solo carga el reproductor al tocar | La tía elige los videos |

### 9.9 F6 · Diseño

| Ticket | Qué | Depende de |
| --- | --- | --- |
| F6-01 (propuesta) | Dos familias de letra (H31): una para textos y otra para títulos, quitando Oswald, Didact Gothic y lo que sobre. Como Gilroy Medium y Bold son de pago (H8), la propuesta debe usar letras gratuitas de Google parecidas. Menos archivos que cargar | Juan y la tía |
| F6-02 | Espacios y tamaños parejos (H32): rellenos de sección iguales, títulos de celular de 28 a 32 px, botones de una sola línea | F6-01 |
| F6-03 | Fotos reales del consultorio y de los talleres (H33) en vez de stock y capturas | Las fotos de la tía |

### 9.10 F7 · Textos finales (al final)

| Ticket | Qué |
| --- | --- |
| F7-01 | Ortografía (H9). La hormiga entrega la lista de cada corrección (antes y después) y esa lista va completa a la bitácora y al documento final |
| F7-02 | Textos en inglés (H10): Inicio, Correo, Anterior, Siguiente, Cerrar |
| F7-03 | Signos y mayúsculas (H11) |
| F7-04 | Un solo nombre (CENPAIF) y una sola dirección, igual a la del perfil de Google (H12, con F4-03) |

### 9.11 F8 · Legal y licencias (al final)

| Ticket | Qué |
| --- | --- |
| F8-01 | Frases de publicidad (H6): propuesta de versiones prudentes ("Te acompañamos con técnicas de terapia de tercera generación" en vez de "Resultados en corto tiempo") para que la tía apruebe |
| F8-02 | Política de tratamiento de datos (H7): página `/politica-de-datos/` con lo que pide el Decreto 1377 de 2013 (responsable, finalidad, derechos, quién atiende consultas, procedimiento y fecha), enlace en el pie y casilla de autorización en cada formulario. Lo revisa un abogado o la tía |
| F8-03 | Licencias (H8): confirmar con la tía o quien hizo la web si las fotos de Freepik y Gilroy tienen licencia; si no, reemplazarlas (F6-01, F6-03) o dar crédito |

### 9.12 F9 · Cambio de dominio (con Claude)

| Ticket | Qué |
| --- | --- |
| F9-01 (urgente, antes del 15 de enero de 2027) | Renovar cenpaif.com en Hostinger o, cuando los DNS estén en Cloudflare, transferirlo allá |
| F9-02 | Agregar cenpaif.com a Cloudflare, revisar que se copiaron todos los registros (MX `mx1` y `mx2.hostinger.com`, SPF, DKIM `hostingermail-a/b/c._domainkey`, DMARC, `autodiscover` y `autoconfig`) y cambiar los nameservers en Hostinger |
| F9-03 | Conectar cenpaif.com y www al Worker (dominios propios), www redirige a cenpaif.com, HTTPS siempre y HSTS (H48, H49) |
| F9-04 | Después del cambio: probar que el correo llega, las redirecciones de `_redirects`, Search Console con el sitemap y que la vieja WordPress quede respaldada antes de apagarla. No cancelar el plan de Hostinger hasta saber si el correo depende de él |

### 9.13 F10 · Documento final (con Claude)

- **F10-01:** con la bitácora (4.5) y la lista de ortografía de F7-01, Claude arma el documento para la tía: qué se hizo página por página, antes y después, las medidas de velocidad, y qué debe mantener ella (reseñas, precios, fotos).

---

## 10. Preguntas para la tía (decisiones abiertas)

Mensaje listo para mandarle por WhatsApp (F0-04). Las respuestas se anotan aquí.

| # | Pregunta | Para | Respuesta |
| --- | --- | --- | --- |
| 1 | ¿Quién tiene la cuenta de Hostinger (correo y clave)? ¿Usas algún correo @cenpaif.com? (el dominio vence el 15 de enero de 2027) | F9 | |
| 2 | Los formularios de inscripción a talleres y de alquiler piden iniciar sesión con Google. ¿Usas la hoja de cálculo con las respuestas, o prefieres que te lleguen por WhatsApp? | F1-14 | |
| 3 | El alquiler de la oficina, ¿es por horas o por jornadas? | F1-08 | |
| 4 | Para agendar citas, ¿usas Doctoralia o Google Calendar? Hoy la web manda a los dos | F1-15 | |
| 5 | ¿Le pagas a masleads por el botón verde "Asesoría en Línea" o te mandan algún reporte? | F2-03 | |
| 6 | ¿Miras Google Analytics (visitas de la web)? | F2-02 | |
| 7 | En la página de Batería aparece un texto de Empoderamiento y en Talleres, "Interacciones exitosas" tiene la descripción de otro taller. ¿Me mandas los textos correctos? (y lo de `docs/CONTENIDO.md`) | F5-01 | |
| 8 | Para presentarte bien: nombre como quieres que aparezca, número de tarjeta profesional, código de habilitación de la Secretaría de Salud, estudios, años de experiencia y una foto que te guste | F5-02 | |
| 9 | ¿Qué precios quieres mostrar (consulta, talleres, orientación), tu horario, cuánto dura una sesión y qué pasa si alguien cancela? | F5-03, F5-04 | |
| 10 | ¿Eres dueña del perfil de Google de CENPAIF? ¿Con qué correo? (para que las reseñas se actualicen solas) | F5-05 | |
| 11 | ¿Tienes fotos reales del consultorio y de los talleres? | F6-03 | |
| 12 | Las fotos de los servicios y la letra de la web, ¿las compraste tú o quien hizo la web? | F8-03 | |

---

## 11. Verificación

### 11.1 Comandos (copiar tal cual en zsh)

```
git status
git log --oneline -5
npm run build
npm run vista
ls dist/css
grep -rn "texto a buscar" src
```

- `npm run build` debe terminar con `Listo: 12 páginas en dist/ (N ms)` y sin líneas `⚠`.
- `npm run vista` se queda corriendo; se detiene con Ctrl + C.

### 11.2 Anchos de prueba

En Chrome, con `npm run vista` abierto en http://localhost:8080: Ver, Desarrollador, Herramientas para desarrolladores, y el ícono de celular (barra de dispositivos). Revisar siempre en **390, 768, 1024 y 1440 px**. Después del push, revisar la dirección de prueba en el S25 Ultra y en el iPhone 18 Pro.

### 11.3 Medir

- Velocidad: https://pagespeed.web.dev con la dirección de prueba, pestaña "Móvil".
- Accesibilidad: Lighthouse dentro de las herramientas de Chrome, categoría Accesibilidad.
- Red: pestaña Red de las herramientas de Chrome, para ver qué se pide al cargar (mapa, GTM, masleads, Trustindex).
- Datos estructurados: https://search.google.com/test/rich-results

### 11.4 Qué pegarle al jefe después de cada ticket

- La salida de `git log --oneline -3`.
- Las últimas líneas de `npm run build` (o desde la primera línea con `Error` si falló).
- Una frase de lo que se vio en cada ancho y en los teléfonos.

---

## 12. Plantillas de prompts

### 12.1 Arranque del Gemini jefe

```
Eres el Gemini jefe del proyecto CENPAIF, la web del consultorio de la Dra. Claudia Díaz. Te adjunto HANDOFF.md, el manual completo del proyecto. Léelo entero antes de responder.

Tu trabajo:
1. Confirmar en 5 líneas el estado actual (sección 4) y cuál es el siguiente ticket (sección 9).
2. Entregarme ese ticket completo con la plantilla 12.3, incluidos los comandos cat que la hormiga necesita. Si el ticket ya está escrito en la sección 9, cópialo y complétalo; si cambias algo, dime por qué.
3. Cuando te pegue el cierre de una hormiga, revisarlo contra el "Terminado cuando" y darme la fila nueva de la bitácora 4.5.
4. Si un ticket espera una respuesta de la tía (sección 10), no lo empieces: dime qué falta y pasa al siguiente que no dependa de ella.

Reglas: secciones 2.3 y 3. Si algo del manual choca con lo que te pego del repo, manda el repo y me dices qué corregir en el manual. No escribas código largo salvo que te lo pida.
```

### 12.2 Arranque de una hormiga

```
Eres una Gemini hormiga del proyecto CENPAIF. Haces un solo ticket. Te adjunto HANDOFF.md; lee sobre todo las secciones 2, 3, 5, 6 y 7 antes de escribir código.

Ticket:
<pegar aquí el ticket del jefe>

Archivos actuales:
<pegar aquí la salida de los cat>

Responde con el formato 12.4. Si te falta un archivo, pídeme el cat exacto en vez de suponer su contenido. No toques nada fuera del ticket y no cambies textos que el ticket no nombra.
```

### 12.3 Plantilla de ticket (la escribe el jefe)

```
Ticket <ID> · <título>
Rama: <main o propuesta/tema>
Hallazgo: <H del 8>
Objetivo: <una frase>
Archivos que se crean o cambian (rutas completas):
- ...
Comandos para que Juan pegue el estado actual:
cat ...
Pasos:
1. ...
Fuera de alcance: <lo que no se toca>
Terminado cuando:
- ...
Verificación:
npm run build
Para la bitácora: <frase para el documento final, en palabras de la tía>
```

### 12.4 Formato de entrega de la hormiga

```
Plan:
- (3 a 6 líneas)

Archivo 1: <ruta completa>
<contenido completo>

Archivo 2: <ruta completa>
<contenido completo>

Archivos que se borran:
git rm <ruta>

Verificación:
<comandos, uno por línea, sin #>

Git (ticket en main):
git add <rutas>
git commit -m "<tipo(alcance): mensaje en español>"
git push

Git (ticket de propuesta):
git checkout -b propuesta/<tema>
git add <rutas>
git commit -m "<tipo(alcance): mensaje en español>"
git push -u origin propuesta/<tema>

Cuando la propuesta se apruebe:
git checkout main
git pull
git merge propuesta/<tema>
git push
```

### 12.5 Cierre de ticket (la hormiga se lo da a Juan para el jefe)

```
Cierre <ID>
Commit: <hash corto que Juan ve en git log>
Archivos: <lista>
Verificación: <comando> · <resultado real pegado por Juan>
Revisado en: 390, 768, 1024 y 1440 px <y teléfonos si aplica>
Pendientes o riesgos: <si hay>
Fila para la bitácora 4.5: | <fecha> | <ID> <título> | <commit> | <frase para el documento final> | <qué se verificó> |
```

### 12.6 Reporte de error (Juan a la hormiga)

```
Falló <comando>. Salida desde el primer error:
<pegar>
Corrige solo lo que este error señala y entrégame completos los archivos que cambian.
```

### 12.7 Propuesta para aprobar (Juan a la tía)

```
Tía, te muestro una propuesta para la web: <qué cambia, en una frase>.
Míralo en el celular: <dirección de la vista previa>
¿Te gusta así o le cambio algo?
```

---

## 13. Enlaces

- Repositorio: https://github.com/Juandicho13/cenpaif-web
- Sitio de prueba: https://cenpaif-web.juanolartediaz13.workers.dev
- Web original (hasta la fase 9): https://cenpaif.com
- PageSpeed Insights: https://pagespeed.web.dev
- Cloudflare, dominios propios: https://developers.cloudflare.com/pages/platform/custom-domains/
- Cloudflare, cabeceras en Workers con archivos estáticos: https://developers.cloudflare.com/workers/static-assets/headers/
- Cloudflare, redirecciones en Workers con archivos estáticos: https://developers.cloudflare.com/workers/static-assets/redirects/
- Google Business Profile, requisitos de la API: https://developers.google.com/my-business/content/prereqs
- Google Business Profile, reseñas: https://developers.google.com/my-business/content/review-data
- Ley 1090 de 2006 (Función Pública): https://www.funcionpublica.gov.co/eva/gestornormativo/norma_pdf.php?i=66205
- Ley 1581 de 2012: https://normas.cra.gov.co/Gestor/Docs/ley_1581_2012.htm
- Decreto 1377 de 2013: https://normativa.colpensiones.gov.co/colpensiones/compilacion/docs/decreto_1377_2013.htm
