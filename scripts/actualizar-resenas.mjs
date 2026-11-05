// Trae las reseñas más nuevas de la ficha de Google de CENPAIF y las guarda en src/resenas.json.
// Lo corre la GitHub Action .github/workflows/resenas.yml todos los días.
//
// Necesita la variable GOOGLE_PLACES_KEY (clave de Google Cloud con "Places API" activada).
// Uso local: GOOGLE_PLACES_KEY=xxxx node scripts/actualizar-resenas.mjs
//
// Google entrega como máximo las 5 reseñas más nuevas en cada consulta, así que el archivo
// las va acumulando: las nuevas se suman y las viejas se quedan.

import { readFile, writeFile } from 'node:fs/promises';

const archivo = new URL('../src/resenas.json', import.meta.url);
const clave = process.env.GOOGLE_PLACES_KEY;
if (!clave) {
    console.error('Falta GOOGLE_PLACES_KEY');
    process.exit(1);
}

const api = 'https://maps.googleapis.com/maps/api/place';
const pedir = async (url) => {
    const r = await fetch(url);
    const json = await r.json();
    if (json.status !== 'OK') throw new Error(`Google respondió ${json.status}: ${json.error_message || ''}`);
    return json;
};

const datos = JSON.parse(await readFile(archivo, 'utf8'));

// La primera vez se busca el identificador de la ficha y se guarda
if (!datos.placeId) {
    const q = new URLSearchParams({ input: 'Cenpaif Centro Psicológico Chía', inputtype: 'textquery', fields: 'place_id,name', key: clave });
    const { candidates } = await pedir(`${api}/findplacefromtext/json?${q}`);
    const ficha = candidates.find((c) => /cenpaif/i.test(c.name)) || candidates[0];
    datos.placeId = ficha.place_id;
    console.log(`Ficha encontrada: ${ficha.name} (${ficha.place_id})`);
}

const q = new URLSearchParams({
    place_id: datos.placeId,
    fields: 'rating,user_ratings_total,reviews',
    reviews_sort: 'newest',
    reviews_no_translations: 'true',
    language: 'es',
    key: clave
});
const { result } = await pedir(`${api}/details/json?${q}`);

const clave2 = (r) => `${r.nombre.toLowerCase()}|${r.fecha}`;
const existentes = new Map(datos.resenas.map((r) => [clave2(r), r]));
let nuevas = 0;
for (const g of result.reviews || []) {
    const r = {
        nombre: g.author_name,
        fecha: new Date(g.time * 1000).toISOString().slice(0, 10),
        estrellas: g.rating,
        texto: (g.text || '').trim(),
        foto: g.profile_photo_url || ''
    };
    if (!existentes.has(clave2(r))) nuevas += 1;
    existentes.set(clave2(r), r);
}

datos.resenas = [...existentes.values()].sort((a, b) => b.fecha.localeCompare(a.fecha));
if (result.rating) datos.resumen.calificacion = result.rating.toFixed(1).replace('.', ',');
if (result.user_ratings_total) datos.resumen.total = result.user_ratings_total;
datos.actualizado = new Date().toISOString().slice(0, 10);

await writeFile(archivo, JSON.stringify(datos, null, 2) + '\n');
console.log(`Listo: ${nuevas} reseñas nuevas, ${datos.resenas.length} guardadas, ${datos.resumen.calificacion} con ${datos.resumen.total} opiniones.`);
