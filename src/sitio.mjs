// Datos del sitio que se repiten en varias páginas

export const sitio = {
    url: 'https://cenpaif.com',
    nombre: 'CENPAIF',
    telefono: '313 2712530',
    telefonoEnlace: 'tel:+573132712530',
    correo: 'cenpaif@gmail.com',
    // Una sola forma de escribir la dirección en toda la web
    direccion: 'Calle 11 # 6A-56, Edificio Offices Center Chía Elite, consultorio 509',
    ciudad: 'Chía, Cundinamarca',
    whatsapp: '573132712530',
    enlaces: {
        // Agenda de citas de la tía (Google Calendar). Ya no usa Doctoralia.
        agenda: 'https://calendar.app.google/qhr7ZgQBvZDQM2Bb9',
        wompi: 'https://checkout.wompi.co/l/VPOS_vOjvu7',
        paypal: 'https://www.paypal.com/paypalme/CenClaudiaDiazOvalle',
        // Ficha de CENPAIF en Google Maps (botón "Cómo llegar")
        comoLlegar: 'https://www.google.com/maps?cid=14521195418546587632'
    },
    redes: [
        { nombre: 'Facebook', icono: 'facebook', url: 'https://www.facebook.com/1962076727412535' },
        { nombre: 'Instagram', icono: 'instagram', url: 'https://www.instagram.com/psicologa.claudiadiaz/' },
        { nombre: 'LinkedIn', icono: 'linkedin', url: 'https://www.linkedin.com/in/cenpaif' },
        { nombre: 'YouTube', icono: 'youtube', url: 'https://www.youtube.com/channel/UCSjZLQ6vsG7_ZXHl185ZrUQ' }
    ],
    menu: [
        { texto: 'Inicio', url: '/' },
        {
            texto: 'Servicios',
            hijos: [
                { texto: 'Psicólogos en Chía', url: '/psicologos-en-chia/' },
                { texto: 'Terapia de Pareja', url: '/terapia-de-pareja/' },
                { texto: 'Aplicación de Batería de Riesgo Psicosocial', url: '/aplicacion-de-bateria-de-riesgo-psicosocial/' },
                { texto: 'Programa de Empoderamiento individual', url: '/programa-de-empoderamiento-individual/' },
                { texto: 'Talleres Empresariales', url: '/talleres-empresariales/' },
                { texto: 'Orientación Vocacional', url: '/orientacion-vocacional/' },
                { texto: 'Talleres de Inteligencia Emocional', url: '/talleres-de-inteligencia-emocional/' }
            ]
        },
        { texto: 'Sobre Nosotros', url: '/sobre-nosotros/' },
        { texto: 'Pagos', url: '/pagos/' },
        { texto: 'Alquiler de oficinas', url: '/alquiler-de-oficina-por-horas/' },
        { texto: 'Contacto', url: '#contacto' }
    ]
};

// Rutas de los servicios, para resaltar "Servicios" en el menú cuando se está en uno de ellos
for (const item of sitio.menu) {
    if (item.hijos) item.rutas = item.hijos.map((h) => h.url);
}

// Enlace de WhatsApp con mensaje opcional
export function whatsapp(mensaje = '') {
    const base = `https://wa.me/${sitio.whatsapp}`;
    return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}