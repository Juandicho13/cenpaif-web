// Reseñas de Google del inicio. Los datos viven en src/resenas.json y los actualiza solo
// la GitHub Action "Reseñas de Google" (scripts/actualizar-resenas.mjs) una vez al día.
// La web muestra las de 5 estrellas con texto, de la más nueva a la más vieja (máximo 6).
//   fecha: día de la reseña (año-mes-día)
//   foto: foto de perfil de Google (no se muestra; la web usa la inicial)

import { readFileSync } from 'node:fs';

const datos = JSON.parse(readFileSync(new URL('./resenas.json', import.meta.url), 'utf8'));

export const resumen = datos.resumen;
export const resenas = datos.resenas;
