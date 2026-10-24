# Oriental Aromas — Shopify theme

Tema completo para Shopify basado en Dawn 16 + la landing de Oriental Aromas.

## Qué incluye

- **Landing**: `templates/index.json` usa el layout `landing` y la sección `sections/oriental-aromas.liquid`.
- **Vídeo y scroll**: se cargan desde `assets/oa-discovery-pingpong.mp4` y `assets/oa-truck-scroll.mp4`; la app React compilada está en `assets/oriental-aromas.js` y `assets/oriental-aromas.css`.
- **Productos**: la sección toma los 4 productos de la colección elegida en el editor del tema.
- **Resto de la tienda**: producto, colección, carrito, búsqueda, páginas, blog, 404 y password usan las plantillas de Dawn, con la paleta beige/marrón aplicada.
- **Newsletter**: formulario nativo de Shopify.

## Cómo importarlo

### GitHub (recomendado)

1. En Shopify: Online Store → Themes → Add theme → Connect from GitHub.
2. Elige el repositorio `ferrioh/orientalaromaswholesale`.
3. Elige la rama `shopify-theme`.
4. Importa y revisa en vista previa.

### ZIP

También puedes comprimir el contenido de esta carpeta en un ZIP y usar **Add theme → Upload zip**. El ZIP debe contener las carpetas `assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/` y `templates/` en la raíz.

## Configurar la landing

1. Abre el editor del tema en la página de inicio.
2. En la sección **Oriental Aromas**, elige la colección de productos.
3. Opcionalmente, selecciona vídeos propios en los ajustes de la sección.
4. Revisa el menú, el footer, el selector ES/EN y los enlaces a colecciones.

## Archivos clave

| Archivo | Función |
| --- | --- |
| `layout/landing.liquid` | Layout sin header/footer del tema; la app ya incluye los suyos |
| `layout/theme.liquid` | Layout de Dawn para el resto de páginas |
| `templates/index.json` | Inicio con la landing |
| `templates/page.oriental-aromas.json` | Página alternativa con la landing |
| `sections/oriental-aromas.liquid` | Sección Liquid de la landing |
| `assets/oriental-aromas.js` | App React compilada |
| `assets/oriental-aromas.css` | Estilos de la landing |
| `assets/oa-*` | Vídeos, fuentes e imágenes de la landing |

## Límites

El vídeo principal pesa ~17,85 MB; el límite de Shopify para un asset del tema es ~20 MB. El tema completo pesa ~27 MB.

## Licencias

Dawn: MIT (`LICENSE-DAWN.md`). Fuentes: Archivo Black, Bodoni Moda, Lora y Manrope (OFL). Componente Magnet: React Bits (`LICENSE-REACT-BITS.md`).
