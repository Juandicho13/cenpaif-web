// Arma el sitio en la carpeta dist/ (es lo que publica Cloudflare Pages).
//
//   npm run build   arma todo una vez
//   npm run vista   arma, abre http://localhost:8080 y vuelve a armar al guardar
//
// Pasos: copia public/, optimiza las fotos de fotos/ (AVIF y WebP en varios tamaños),
// copia las letras, compila el CSS, arma cada página de src/paginas/ y revisa los enlaces.

import { readFile, writeFile, mkdir, rm, cp, readdir, copyFile } from 'node:fs/promises';
import { existsSync, watch, createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import http from 'node:http';
import path from 'node:path';
import nunjucks from 'nunjucks';
import sharp from 'sharp';

const raiz = path.dirname(fileURLToPath(import.meta.url));
const SALIDA = path.join(raiz, 'dist');
// Fotos ya optimizadas: se suben al repositorio para que Cloudflare no tenga que repetir el trabajo
const CACHE = path.join(raiz, 'fotos', 'optimizadas');
const ANCHOS = [400, 800, 1200, 1600];

// Letras: las de Google salen de los paquetes instalados; Gilroy está en la carpeta fuentes/
const FUENTES = {
    manrope: 'node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2',
    montserrat: 'node_modules/@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2',
    'dancing-script': 'node_modules/@fontsource-variable/dancing-script/files/dancing-script-latin-wght-normal.woff2',
    oswald: 'node_modules/@fontsource-variable/oswald/files/oswald-latin-wght-normal.woff2',
    'didact-gothic': 'node_modules/@fontsource/didact-gothic/files/didact-gothic-latin-400-normal.woff2',
    'gilroy-light': 'fuentes/gilroy-light.woff2',
    'gilroy-medium': 'fuentes/gilroy-medium.woff2',
    'gilroy-bold': 'fuentes/gilroy-bold.woff2'
};

const corto = (contenido) => createHash('sha1').update(contenido).digest('hex').slice(0, 8);
const aRuta = (...partes) => path.join(SALIDA, ...partes);
const seguro = (html) => new nunjucks.runtime.SafeString(html);

// Archivo con huella en el nombre: si cambia el contenido cambia el nombre y el navegador
// lo descarga de nuevo; si no cambia, lo guarda en caché por un año.
async function escribirConHuella(carpeta, nombre, extension, contenido) {
    const archivo = `${nombre}.${corto(contenido)}.${extension}`;
    await mkdir(aRuta(carpeta), { recursive: true });
    await writeFile(aRuta(carpeta, archivo), contenido);
    return `/${carpeta}/${archivo}`;
}

// ---------- Fotos ----------

async function procesarFotos() {
    const carpeta = path.join(raiz, 'fotos');
    const archivos = (await readdir(carpeta)).filter((f) => /\.(jpe?g|png|webp|avif|tiff?)$/i.test(f));
    const manifiesto = {};
    await mkdir(aRuta('img'), { recursive: true });
    await mkdir(CACHE, { recursive: true });

    for (const archivo of archivos.sort()) {
        const nombre = archivo.replace(/\.[^.]+$/, '').toLowerCase();
        const origen = path.join(carpeta, archivo);
        const huella = corto(await readFile(origen));
        const meta = await sharp(origen).metadata();
        let [ancho, alto] = [meta.width, meta.height];
        if ((meta.orientation || 1) >= 5) [ancho, alto] = [alto, ancho];

        const anchos = ANCHOS.filter((a) => a <= ancho);
        if (ancho < ANCHOS.at(-1) && (!anchos.length || ancho - anchos.at(-1) > 100)) anchos.push(ancho);

        const cache = path.join(CACHE, `${nombre}.${huella}`);
        if (!existsSync(path.join(cache, 'listo'))) {
            await rm(cache, { recursive: true, force: true });
            await mkdir(cache, { recursive: true });
            // Se conserva la transparencia de los PNG (por ejemplo, el botón de PayPal)
            const base = sharp(origen).rotate();
            for (const a of anchos) {
                const tamano = base.clone().resize({ width: a, withoutEnlargement: true });
                await tamano.clone().avif({ quality: 50, effort: 4 }).toFile(path.join(cache, `${nombre}-${a}.${huella}.avif`));
                await tamano.clone().webp({ quality: 74, effort: 4 }).toFile(path.join(cache, `${nombre}-${a}.${huella}.webp`));
            }
            await writeFile(path.join(cache, 'listo'), '');
            console.log(`  foto optimizada: ${archivo}`);
        }
        for (const f of await readdir(cache)) {
            if (f !== 'listo') await copyFile(path.join(cache, f), aRuta('img', f));
        }
        manifiesto[nombre] = { ancho, alto, anchos, huella };
    }

    // Borra las versiones optimizadas de fotos que ya no existen o cambiaron
    const vigentes = new Set(Object.entries(manifiesto).map(([n, f]) => `${n}.${f.huella}`));
    for (const carpetaVieja of await readdir(CACHE)) {
        if (!vigentes.has(carpetaVieja)) await rm(path.join(CACHE, carpetaVieja), { recursive: true, force: true });
    }
    return manifiesto;
}

// Etiqueta <picture> con AVIF y WebP en todos los tamaños disponibles
function crearFoto(manifiesto) {
    const escapar = (t) => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    const datos = (nombre) => {
        const f = manifiesto[nombre];
        if (!f) throw new Error(`Falta la foto "${nombre}" en la carpeta fotos/`);
        return f;
    };
    const fuentes = (nombre, formato) => {
        const f = datos(nombre);
        return f.anchos.map((a) => `/img/${nombre}-${a}.${f.huella}.${formato} ${a}w`).join(', ');
    };
    const foto = (nombre, alt, opciones = {}) => {
        const f = datos(nombre);
        const { tamanos = '100vw', clase = '', prioridad = false } = opciones;
        const medio = f.anchos.find((a) => a >= 800) || f.anchos.at(-1);
        const carga = prioridad ? 'fetchpriority="high"' : 'loading="lazy"';
        return seguro(
            `<picture><source type="image/avif" srcset="${fuentes(nombre, 'avif')}" sizes="${tamanos}">` +
            `<img src="/img/${nombre}-${medio}.${f.huella}.webp" srcset="${fuentes(nombre, 'webp')}" sizes="${tamanos}" ` +
            `width="${f.ancho}" height="${f.alto}" alt="${escapar(alt)}"${clase ? ` class="${clase}"` : ''} ${carga} decoding="async"></picture>`
        );
    };
    // Para la foto principal de una página: el navegador la pide antes de leer el CSS.
    // "tamanos" debe ser igual al de la foto; "medio" limita la precarga (por ejemplo, solo en computador).
    const precargarFoto = (nombre, tamanos = '100vw', medio = '') => {
        const f = datos(nombre);
        const medioAncho = f.anchos.find((a) => a >= 800) || f.anchos.at(-1);
        return seguro(
            `<link rel="preload" as="image" type="image/avif" href="/img/${nombre}-${medioAncho}.${f.huella}.avif" ` +
            `imagesrcset="${fuentes(nombre, 'avif')}" imagesizes="${tamanos}"${medio ? ` media="${medio}"` : ''} fetchpriority="high">`
        );
    };
    // Ruta de un tamaño concreto (para la imagen al compartir en redes)
    const rutaFoto = (nombre, ancho = 1200) => {
        const f = datos(nombre);
        const a = f.anchos.find((x) => x >= ancho) || f.anchos.at(-1);
        return `/img/${nombre}-${a}.${f.huella}.webp`;
    };
    // Foto como fondo de CSS, en AVIF y WebP (para la franja con la foto quieta, que no puede ser <img>).
    // Va en un atributo style: <section style="{{ fondoFoto('fondo-edificio') }}">
    const fondoFoto = (nombre, ancho = 1600) => {
        const f = datos(nombre);
        const a = f.anchos.find((x) => x >= ancho) || f.anchos.at(-1);
        const ruta = (formato) => `/img/${nombre}-${a}.${f.huella}.${formato}`;
        return seguro(
            `background-image: url('${ruta('webp')}'); ` +
            `background-image: image-set(url('${ruta('avif')}') type('image/avif'), url('${ruta('webp')}') type('image/webp'));`
        );
    };
    return { foto, precargarFoto, rutaFoto, fondoFoto };
}

// ---------- Íconos, formas y favicon ----------

// Cada SVG de src/iconos/ y src/formas/ se puede poner en línea: {{ icono('facebook', 'clase') }}
async function cargarSvgs(carpeta, tipo) {
    const mapa = {};
    for (const f of (await readdir(carpeta)).filter((n) => n.endsWith('.svg'))) {
        mapa[f.slice(0, -4)] = (await readFile(path.join(carpeta, f), 'utf8')).trim();
    }
    return (nombre, clase = '') => {
        const svg = mapa[nombre];
        if (!svg) throw new Error(`Falta ${tipo} "${nombre}" en la carpeta src/${tipo === 'el ícono' ? 'iconos' : 'formas'}/`);
        return seguro(svg
            .replace(' xmlns="http://www.w3.org/2000/svg"', '')
            .replace('<svg ', `<svg${clase ? ` class="${clase}"` : ''} fill="currentColor" aria-hidden="true" focusable="false" `));
    };
}

async function generarFavicon() {
    const icono = path.join(raiz, 'src', 'marca', 'icono.webp');
    await sharp(icono).resize(32).png().toFile(aRuta('favicon-32.png'));
    await sharp(icono).resize(180).png().toFile(aRuta('apple-touch-icon.png'));
    await sharp(icono).resize(192).png().toFile(aRuta('icono-192.png'));
    await sharp(icono).resize(270).png().toFile(aRuta('icono-270.png'));
}

// ---------- Letras, CSS y JS ----------

async function copiarFuentes() {
    const rutas = {};
    for (const [nombre, archivo] of Object.entries(FUENTES)) {
        rutas[nombre] = await escribirConHuella('fuentes', nombre, 'woff2', await readFile(path.join(raiz, archivo)));
    }
    return rutas;
}

function compilarCss() {
    const paquete = path.join(raiz, 'node_modules', '@tailwindcss', 'cli', 'package.json');
    const cli = path.join(path.dirname(paquete), 'dist', 'index.mjs');
    const temporal = path.join(raiz, '.cache', 'sitio.css');
    const r = spawnSync(process.execPath, [cli, '-i', 'src/estilos.css', '-o', temporal, '--minify'], { cwd: raiz, encoding: 'utf8' });
    if (r.status !== 0) throw new Error(`El CSS no compiló:\n${r.stderr}`);
    return readFile(temporal, 'utf8');
}

// ---------- Páginas ----------

// Cada página empieza con datos en JSON entre dos líneas con ---
function separarDatos(fuente, archivo) {
    const m = fuente.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
    if (!m) return { datos: {}, cuerpo: fuente };
    try {
        return { datos: JSON.parse(m[1]), cuerpo: fuente.slice(m[0].length) };
    } catch (e) {
        throw new Error(`Los datos del inicio de ${archivo} no son JSON válido: ${e.message}`);
    }
}

function organizacion(sitio) {
    return {
        '@type': 'MedicalBusiness',
        '@id': `${sitio.url}/#organizacion`,
        name: sitio.nombre,
        url: `${sitio.url}/`,
        logo: `${sitio.url}/icono-270.png`,
        telephone: '+57 313 271 2530',
        email: sitio.correo,
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Calle 11 # 6A-56, Edificio Offices Center Chía Elite, Consultorio 509',
            addressLocality: 'Chía',
            addressRegion: 'Cundinamarca',
            addressCountry: 'CO'
        },
        sameAs: sitio.redes.map((r) => r.url)
    };
}

async function escribirPagina(ruta, html) {
    const destino = ruta === '/' ? aRuta('index.html') : ruta === '/404' ? aRuta('404.html') : aRuta(ruta.slice(1), 'index.html');
    await mkdir(path.dirname(destino), { recursive: true });
    await writeFile(destino, html);
}

// ---------- Revisiones ----------

async function revisar(rutas) {
    const avisos = [];
    for (const ruta of rutas) {
        const archivo = ruta === '/' ? aRuta('index.html') : ruta === '/404' ? aRuta('404.html') : aRuta(ruta.slice(1), 'index.html');
        const html = await readFile(archivo, 'utf8');
        for (const [, enlace] of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
            if (enlace.startsWith('//')) continue;
            const destino = enlace.endsWith('/') ? aRuta(enlace.slice(1), 'index.html') : aRuta(enlace.slice(1));
            if (!existsSync(destino)) avisos.push(`${ruta}: enlace roto ${enlace}`);
        }
        for (const [, lista] of html.matchAll(/srcset="([^"]+)"/g)) {
            for (const parte of lista.split(',')) {
                const archivoImg = parte.trim().split(/\s+/)[0];
                if (archivoImg.startsWith('/') && !existsSync(aRuta(archivoImg.slice(1)))) avisos.push(`${ruta}: falta ${archivoImg}`);
            }
        }
    }
    return [...new Set(avisos)];
}

// ---------- Todo junto ----------

async function construir() {
    const inicio = Date.now();
    const v = `?v=${inicio}`;
    const { sitio, whatsapp } = await import(pathToFileURL(path.join(raiz, 'src', 'sitio.mjs')).href + v);
    const { resenas } = await import(pathToFileURL(path.join(raiz, 'src', 'resenas.mjs')).href + v);

    await rm(SALIDA, { recursive: true, force: true });
    await mkdir(SALIDA, { recursive: true });
    await mkdir(path.join(raiz, '.cache'), { recursive: true });
    await cp(path.join(raiz, 'public'), SALIDA, { recursive: true });

    const manifiesto = await procesarFotos();
    await generarFavicon();
    const fuentes = await copiarFuentes();
    let css = await compilarCss();
    for (const [nombre, ruta] of Object.entries(fuentes)) css = css.replaceAll(`/fuentes/${nombre}.woff2`, ruta);
    const rutaCss = await escribirConHuella('css', 'sitio', 'css', css);
    const rutaJs = await escribirConHuella('js', 'sitio', 'js', await readFile(path.join(raiz, 'src', 'sitio.js')));

    const env = new nunjucks.Environment(
        new nunjucks.FileSystemLoader([path.join(raiz, 'src', 'plantillas'), path.join(raiz, 'src', 'paginas')], { noCache: true }),
        { autoescape: true, trimBlocks: true, lstripBlocks: true, throwOnUndefined: false }
    );
    const { foto, precargarFoto, rutaFoto, fondoFoto } = crearFoto(manifiesto);
    const globales = {
        sitio, foto, precargarFoto, rutaFoto, fondoFoto,
        icono: await cargarSvgs(path.join(raiz, 'src', 'iconos'), 'el ícono'),
        forma: await cargarSvgs(path.join(raiz, 'src', 'formas'), 'la forma'),
        activos: { css: rutaCss, js: rutaJs, fuentes },
        whatsapp: (m) => whatsapp(m),
        // El widget de reseñas usa la fecha en segundos
        resenas: resenas.map((r) => ({ ...r, tiempo: Date.parse(`${r.fecha}T00:00:00Z`) / 1000 }))
    };
    for (const [k, valor] of Object.entries(globales)) env.addGlobal(k, valor);
    env.addFilter('jsonld', (grafo) => seguro(
        JSON.stringify({ '@context': 'https://schema.org', '@graph': grafo }).replace(/</g, '\\u003c')
    ));

    const org = organizacion(sitio);
    const rutas = [];

    // Una página por archivo de src/paginas/
    for (const archivo of (await readdir(path.join(raiz, 'src', 'paginas'))).filter((f) => f.endsWith('.njk'))) {
        const nombre = archivo.slice(0, -4);
        const ruta = nombre === 'index' ? '/' : nombre === '404' ? '/404' : `/${nombre}/`;
        const { datos, cuerpo } = separarDatos(await readFile(path.join(raiz, 'src', 'paginas', archivo), 'utf8'), archivo);
        const html = env.renderString(cuerpo, { ...datos, ruta, grafo: [org] });
        await escribirPagina(ruta, html);
        rutas.push(ruta);
    }

    // Mapa del sitio para Google
    const urls = rutas.filter((r) => r !== '/404').sort().map((r) => `  <url><loc>${sitio.url}${r}</loc></url>`).join('\n');
    await writeFile(aRuta('sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);

    const avisos = await revisar(rutas);
    avisos.forEach((a) => console.warn(`  ⚠ ${a}`));
    console.log(`Listo: ${rutas.length} páginas en dist/ (${Date.now() - inicio} ms)`);
    return avisos;
}

// ---------- Vista local ----------

function servir(puerto = 8080) {
    const tipos = {
        '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
        '.avif': 'image/avif', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2',
        '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json', '.mp4': 'video/mp4'
    };
    http.createServer((req, res) => {
        let ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
        let archivo = path.join(SALIDA, ruta);
        if (!archivo.startsWith(SALIDA)) { res.writeHead(403).end(); return; }
        if (ruta.endsWith('/')) archivo = path.join(archivo, 'index.html');
        else if (!path.extname(ruta) && existsSync(path.join(archivo, 'index.html'))) {
            res.writeHead(308, { Location: `${ruta}/` }).end();
            return;
        }
        let estado = 200;
        if (!existsSync(archivo)) { archivo = path.join(SALIDA, '404.html'); estado = 404; }
        res.writeHead(estado, { 'Content-Type': tipos[path.extname(archivo)] || 'application/octet-stream' });
        createReadStream(archivo).pipe(res);
    }).listen(puerto, () => console.log(`Vista lista en http://localhost:${puerto}`));
}

await construir();

if (process.argv.includes('--vista')) {
    servir();
    let espera;
    for (const carpeta of ['src', 'public', 'fotos', 'fuentes']) {
        watch(path.join(raiz, carpeta), { recursive: true }, (evento, archivo) => {
            if (archivo && archivo.includes('optimizadas')) return;
            clearTimeout(espera);
            espera = setTimeout(() => construir().catch((e) => console.error(e.message)), 250);
        });
    }
}