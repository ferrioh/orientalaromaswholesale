# Validación — versión 7

- Compilación React correcta y paquete Shopify regenerado.
- Logo, navegación y acciones comparten fila a 627 px. Menú con opacidad 1 y glass de mayor cuerpo.
- Tras hacer scroll, vídeo pausado en modo scroll. Al volver arriba: modo auto y reproducción activa de nuevo.
- Camión: 4,837 de 8 s con contenido en opacidad 0; después 5,389 s con opacidad del contenido 0,960. El menú conserva opacidad 1.
- Titulares y nombre del pie en Archivo Black mayúscula; textos de lectura en Manrope. Fuente incluida localmente con licencia.
- Los dos primeros bloques conservan más recorrido de lectura y el camión comienza después de su salida.

Integración Shopify sin instalar ni publicar en la tienda. Operaciones reales pendientes de validar en Shopify.

## Menú superior y firma del pie — 19 de octubre de 2026

- Compilación final correcta; dist/ y shopify/ regenerados.
- Menú superior con siete accesos visibles a 320, 390, 768 y 844 px; sin desbordamiento horizontal. A 1440 px permanece la navegación de escritorio.
- Apertura de marcas, categorías y complementos comprobada; se conservan 16 marcas, 8 categorías y 5 complementos.
- Escape cierra; el foco vuelve al activador. Shift+Tab desde el cierre recorre al último enlace del diálogo. El desplazamiento se desbloquea al cerrar.
- El menú permanece arriba al navegar a Contacto y al llegar al pie. No hay dock inferior.
- Firma del pie en Bodoni Moda 400; revisión visual en móvil, sin recorte del nombre.
- Consola del navegador sin errores durante estas comprobaciones. Vista guardada en MENU_SUPERIOR_Y_PIE.png.
- Shopify regenerado localmente; instalación/publicación no realizadas.

Transición entre videos: contorno orgánico suavizado con máscara SVG y gaussiano; blur direccional máximo de 2,2 × 0,65 px y separación cromática máxima de ±0,75 px. Estos efectos se desactivan al completar la transición y con movimiento reducido. La versión 4K AV1 se comprobó reproduciendo a 3840 × 2160 / 40 s en escritorio; la selección móvil utiliza Full HD. Los loops mantienen 960 fotogramas y pasaron la decodificación completa. Captura: TRANSICION_DIFUMINADA.png. Adaptación propia de la referencia, sin shader Three.js ni cambio permanente de color.

## Estado actual: transición anterior y reproducción corregida

Se restauró el fundido con blur y brillo suave anterior a la revelación orgánica. Se retiraron su máscara y aberración cromática. La portada mantiene la calidad mejorada con dos archivos H.264 de codificación continua: discovery-smooth-uhd.mp4 (3840 × 2160, 29,52 MB) y discovery-smooth-mobile.mp4 (1920 × 1080, 14,84 MB). Los dos conservan 40 segundos y 960 fotogramas, con faststart. Sustituyen el AV1 en reproducción para reducir el coste de decodificación. El arranque espera canplaythrough y no pausa el primer video al montar el efecto; el segundo precarga solo metadatos. Ambos archivos se decodificaron completos sin errores.

En navegador de escritorio: 4K H.264, modo auto, readyState 4 y tiempo avanzando más allá de 20 s. Registro inicial: playing a 0,006 s; waiting a 0,069 s y playing a 0,071 s en la misma marca de tiempo; sin eventos pause ni stalled en esa observación. No se reprodujeron las tres congelaciones denunciadas. La fluidez en otras conexiones/dispositivos requiere su comprobación real.
