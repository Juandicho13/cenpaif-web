/*
 * CENPAIF · comportamiento de la página (sin librerías)
 *   1. Menú del celular, submenú de servicios y barra del menú fija al bajar
 *   2. Fotos de la portada que se alternan cada 5 segundos
 *   3. Carrusel de fotos de "Beneficios"
 *   4. Formulario de contacto: arma el mensaje y abre WhatsApp
 *   5. Google Tag Manager, cargado después de la página para no frenarla
 *      (también pone el botón flotante de WhatsApp "Asesoría en Línea")
 *   Además: ventana de los videos de los talleres, visor de fotos de Alquiler y reseñas del inicio
 */
(function () {
    'use strict';

    var WHATSAPP = '573132712530';
    var celular = window.matchMedia('(max-width: 767px)');

    // ---------- 1. Menú ----------
    var abrir = document.querySelector('.menu__abrir');
    var panel = document.getElementById('menu-panel');
    var cerrar = document.querySelector('.menu__cerrar');

    function mostrarPanel(si) {
        if (!panel) return;
        panel.classList.toggle('abierto', si);
        abrir.setAttribute('aria-expanded', si ? 'true' : 'false');
        document.documentElement.style.overflow = si ? 'hidden' : '';
    }
    if (abrir && panel) {
        abrir.addEventListener('click', function () { mostrarPanel(true); });
        cerrar.addEventListener('click', function () { mostrarPanel(false); });
        panel.addEventListener('click', function (e) {
            var enlace = e.target.closest('a');
            if (enlace && !enlace.classList.contains('menu__padre')) mostrarPanel(false);
        });
        celular.addEventListener('change', function (m) { if (!m.matches) mostrarPanel(false); });
    }

    document.querySelectorAll('.menu__padre').forEach(function (padre) {
        var sub = padre.nextElementSibling;
        padre.addEventListener('click', function (e) {
            e.preventDefault();
            if (!celular.matches) return;
            var abierto = sub.classList.toggle('abierto');
            padre.setAttribute('aria-expanded', abierto ? 'true' : 'false');
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && panel && panel.classList.contains('abierto')) {
            mostrarPanel(false);
            abrir.focus();
        }
    });

    // Al bajar 60 px la barra del menú queda fija arriba (en computador y tableta, como en la original)
    var barra = document.querySelector('.menu');
    if (barra) {
        var fijarBarra = function () {
            var fija = document.documentElement.clientWidth > 767 && window.scrollY >= 60;
            barra.classList.toggle('menu--fija', fija);
        };
        window.addEventListener('scroll', fijarBarra, { passive: true });
        window.addEventListener('resize', fijarBarra);
        fijarBarra();
    }

    // ---------- 2. Portada ----------
    document.querySelectorAll('[data-alternar]').forEach(function (seccion) {
        var fotos = seccion.querySelectorAll('.portada__foto');
        if (fotos.length < 2) return;
        var actual = 0;
        setInterval(function () {
            fotos[actual].classList.remove('activa');
            actual = (actual + 1) % fotos.length;
            fotos[actual].classList.add('activa');
        }, 5000);
    });

    // ---------- 3. Carrusel ----------
    document.querySelectorAll('[data-carrusel]').forEach(function (carrusel) {
        var pista = carrusel.querySelector('.carrusel__pista');
        var total = pista.children.length;
        // Copia de la primera foto al final: así el carrusel sigue avanzando sin devolverse
        var copia = pista.firstElementChild.cloneNode(true);
        copia.setAttribute('aria-hidden', 'true');
        pista.appendChild(copia);
        var indice = 0;
        var pausa = false;
        carrusel.addEventListener('mouseenter', function () { pausa = true; });
        carrusel.addEventListener('mouseleave', function () { pausa = false; });
        pista.addEventListener('transitionend', function () {
            if (indice === total) {
                pista.style.transition = 'none';
                indice = 0;
                pista.style.transform = 'translateX(0)';
                pista.offsetHeight; // aplica el salto sin animación
                pista.style.transition = '';
            }
        });
        setInterval(function () {
            if (pausa || document.hidden) return;
            indice += 1;
            pista.style.transform = 'translateX(' + (-100 * indice) + '%)';
        }, 5000);
    });

    // ---------- 4. Formulario de contacto ----------
    document.querySelectorAll('[data-formulario-whatsapp]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var datos = new FormData(form);
            var nombre = String(datos.get('nombre') || '').trim();
            var correo = String(datos.get('email') || '').trim();
            var mensaje = String(datos.get('mensaje') || '').trim();
            var lineas = ['Hola, soy ' + (nombre || 'una persona interesada') + '.'];
            if (correo) lineas.push('Mi correo: ' + correo);
            if (mensaje) lineas.push(mensaje);
            window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lineas.join('\n')), '_blank', 'noopener');
        });
    });

    // ---------- Videos de los talleres ----------
    var ventana = document.getElementById('video-ventana');
    if (ventana) {
        var video = ventana.querySelector('video');
        document.querySelectorAll('[data-video]').forEach(function (boton) {
            boton.addEventListener('click', function () {
                video.src = boton.getAttribute('data-video');
                ventana.showModal();
                video.play().catch(function () {});
            });
        });
        ventana.querySelector('.video-ventana__cerrar').addEventListener('click', function () { ventana.close(); });
        ventana.addEventListener('click', function (e) { if (e.target === ventana) ventana.close(); });
        ventana.addEventListener('close', function () { video.pause(); video.removeAttribute('src'); video.load(); });
    }

    // ---------- Visor de fotos de las galerías (Alquiler) ----------
    var visor = document.getElementById('visor');
    if (visor) {
        var visorImg = visor.querySelector('.visor__img');
        var visorCuenta = visor.querySelector('.visor__cuenta');
        var visorMinis = visor.querySelector('.visor__miniaturas');
        var visorPlay = visor.querySelector('.visor__play');
        var fotos = [];
        var actual = 0;
        var pase = null;

        var mostrarFoto = function (i) {
            actual = (i + fotos.length) % fotos.length;
            visor.classList.remove('visor--ampliado');
            visorImg.src = fotos[actual].grande;
            visorCuenta.textContent = (actual + 1) + '/' + fotos.length;
            Array.prototype.forEach.call(visorMinis.children, function (b, j) {
                b.classList.toggle('activa', j === actual);
            });
        };
        var pararPase = function () {
            clearInterval(pase);
            pase = null;
            visorPlay.classList.remove('activo');
            visorPlay.setAttribute('aria-label', 'Pasar las fotos solas');
        };

        document.querySelectorAll('[data-visor]').forEach(function (galeria) {
            var enlaces = galeria.querySelectorAll('.galeria__ampliar');
            enlaces.forEach(function (enlace, i) {
                enlace.addEventListener('click', function (e) {
                    e.preventDefault();
                    fotos = Array.prototype.map.call(enlaces, function (a) {
                        return { grande: a.href, mini: a.getAttribute('data-miniatura') };
                    });
                    visorMinis.textContent = '';
                    fotos.forEach(function (f, j) {
                        var b = document.createElement('button');
                        var mini = document.createElement('img');
                        b.type = 'button';
                        b.setAttribute('aria-label', 'Foto ' + (j + 1));
                        mini.src = f.mini;
                        mini.alt = '';
                        b.appendChild(mini);
                        b.addEventListener('click', function () { pararPase(); mostrarFoto(j); });
                        visorMinis.appendChild(b);
                    });
                    mostrarFoto(i);
                    visor.showModal();
                });
            });
        });

        visor.querySelectorAll('[data-ir]').forEach(function (b) {
            b.addEventListener('click', function () {
                pararPase();
                mostrarFoto(actual + Number(b.getAttribute('data-ir')));
            });
        });
        // Pasar las fotos solas cada 5 segundos, como en la original
        visorPlay.addEventListener('click', function () {
            if (pase) { pararPase(); return; }
            visorPlay.classList.add('activo');
            visorPlay.setAttribute('aria-label', 'Detener');
            pase = setInterval(function () { mostrarFoto(actual + 1); }, 5000);
        });
        visor.querySelector('.visor__expandir').addEventListener('click', function () {
            visor.classList.toggle('visor--ampliado');
        });
        // El botón de tamaño real solo aparece si la foto se achicó para caber en la pantalla
        visorImg.addEventListener('load', function () {
            visor.classList.toggle('visor--achicada', visorImg.naturalWidth > visorImg.clientWidth + 1);
        });
        visor.querySelector('.visor__cerrar').addEventListener('click', function () { visor.close(); });
        visor.addEventListener('click', function (e) { if (e.target === visor) visor.close(); });
        visor.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') { pararPase(); mostrarFoto(actual - 1); }
            if (e.key === 'ArrowRight') { pararPase(); mostrarFoto(actual + 1); }
        });
        visor.addEventListener('close', pararPase);
    }

    // ---------- Reseñas de Google (inicio) ----------
    // El widget de Trustindex (el mismo de la original) se carga cuando las reseñas están por aparecer
    var resenas = document.querySelector('[data-resenas]');
    if (resenas) {
        var cargarResenas = function () {
            var s = document.createElement('script');
            s.async = true;
            s.src = 'https://cdn.trustindex.io/loader.js?ver=1';
            document.body.appendChild(s);
        };
        if ('IntersectionObserver' in window) {
            var vigia = new IntersectionObserver(function (entradas) {
                if (entradas.some(function (e) { return e.isIntersecting; })) {
                    vigia.disconnect();
                    cargarResenas();
                }
            }, { rootMargin: '800px 0px' });
            vigia.observe(resenas);
        } else {
            cargarResenas();
        }
    }

    // ---------- 5. Google Tag Manager diferido ----------
    var gtm = window.CENPAIF_GTM;
    if (gtm) {
        var cargado = false;
        var cargar = function () {
            if (cargado) return;
            cargado = true;
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
            var s = document.createElement('script');
            s.async = true;
            s.src = 'https://www.googletagmanager.com/gtm.js?id=' + gtm;
            document.head.appendChild(s);
        };
        ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (evento) {
            window.addEventListener(evento, cargar, { once: true, passive: true });
        });
        window.addEventListener('load', function () { setTimeout(cargar, 2000); });
    }
})();
