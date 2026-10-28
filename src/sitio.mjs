// Datos del sitio que se repiten en varias páginas

export const sitio = {
    url: 'https://cenpaif.com',
    nombre: 'CENPAIF',
    telefono: '313 2712530',
    telefonoEnlace: 'tel:+573132712530',
    telefonoEnlace: 'tel:+573132712530',
    correo: 'cenpaif@gmail.com',
    whatsapp: '573132712530',
    enlaces: {
        doctoralia: 'https://www.doctoralia.co/claudia-yolima-diaz-ovalle/psicologo/chia',
        mapa: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15901.900663809294!2d-74.0569561!3d4.8597463!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f878ec7ceae53%3A0xc985a64bec7fc7f0!2sCenpaif.%20Centro%20Psicol%C3%B3gico%20de%20Atenci%C3%B3n%20Integral%20Familiar%20y%20Empresarial.!5e0!3m2!1ses-419!2sco!4v1733500330836!5m2!1ses-419!2sco',
        comoLlegar: 'https://www.google.com/maps?cid=14521195418546587632',
        comoLlegar: 'https://www.google.com/maps?cid=14521195418546587632',
        wompi: 'https://checkout.wompi.co/l/VPOS_vOjvu7',
        paypal: 'https://www.paypal.com/paypalme/CenClaudiaDiazOvalle'
    },
    redes: [
        { nombre: 'Facebook', icono: 'facebook', url: 'https://www.facebook.com/1962076727412535' },
        { nombre: 'Instagram', icono: 'instagram', url: 'https://www.instagram.com/psicologa.claudiadiaz/' },
        { nombre: 'LinkedIn', icono: 'linkedin', url: 'https://www.linkedin.com/in/cenpaif' },
        { nombre: 'YouTube', icono: 'youtube', url: 'https://www.youtube.com/channel/UCSjZLQ6vsG7_ZXHl185ZrUQ?view_as=subscriber' }
    ],
    menu: [
        { texto: 'Home', url: '/' },
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
        { texto: 'Contacto', url: '#contacto' }
    ],
    // Google Tag Manager: Analytics y el botón verde "Asesoría en Línea" de WhatsApp
    gtm: 'GTM-KHSMRWMG'
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