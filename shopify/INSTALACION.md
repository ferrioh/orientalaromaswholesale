# Integrar Oriental Aromas en Shopify (Liquid)

La carpeta `shopify/` se genera con `npm run build:shopify`. **No es un tema completo**: es una **sección + plantilla de página** para integrarla en un tema existente. Así conservas las páginas de producto, colecciones, cuenta, carrito y checkout de la tienda; esta entrega sustituye solo la portada.

## Qué incluye

| Archivo generado | Destino en el tema | Función |
| --- | --- | --- |
| `shopify/assets/*` | `assets/` | JavaScript, CSS, fuentes, imágenes y vídeos |
| `shopify/sections/oriental-aromas.liquid` | `sections/` | Sección Liquid con el config dinámico de Shopify |
| `shopify/layout/oriental-aromas.liquid` | `layout/` | Layout independiente para la landing |
| `shopify/templates/page.oriental-aromas.json` | `templates/` | Plantilla de página que monta la sección |

La sección ya incluye el menú, el footer, la suscripción nativa `{% form 'customer' %}`, los productos de una colección y los vídeos.

## Opción recomendada: integrar en tu tema actual

1. En Shopify, duplica el tema que quieras usar y trabaja sobre la copia.
2. Copia los archivos generados:
   - Todo `shopify/assets/` → `assets/`
   - `shopify/sections/oriental-aromas.liquid` → `sections/`
   - `shopify/layout/oriental-aromas.liquid` → `layout/`
   - `shopify/templates/page.oriental-aromas.json` → `templates/`
3. En el editor de código del tema (Online Store → Themes → Edit code) puedes subir los archivos manualmente. Para muchos assets es más rápido usar Shopify CLI (ver Opción B).
4. Crea una página en Shopify Admin → Online Store → Pages. En **Theme template** elige **oriental-aromas**.
5. Abre la vista previa de esa página. En el editor del tema, dentro de la sección **Oriental Aromas**, selecciona la colección de la selección (si no eliges ninguna, usa `new-arrivals` y luego `collections.all`).
6. Revisa los vídeos: por defecto se usan los incluidos; si quieres otros, súbelos a Shopify Files y selecciónalos en los ajustes de la sección.

### Usarla como página de inicio

El paquete incluye `shopify/templates/index.json` con el mismo contenido que `page.oriental-aromas.json`. En la copia del tema, guarda el `templates/index.json` actual y reemplázalo por ese archivo, o copia el contenido de `page.oriental-aromas.json`. La plantilla usa el layout `oriental-aromas`, así que la landing mantiene su propio header y footer (la app React ya los incluye).

### Si prefieres el header/footer de tu tema

No uses el layout independiente. Añade la sección **Oriental Aromas** desde el editor a una plantilla normal (`index.json` o una página) y elimina la línea `"layout": "oriental-aromas"` del JSON. Ten en cuenta que la app React también trae su propio header y footer; si los dos aparecen, quita los de la app o usa el layout independiente.

## Opción B: Shopify CLI (recomendada para desarrolladores)

Requisitos: Shopify CLI instalado y acceso a la tienda.

```powershell
npm run build:shopify

shopify theme pull --store TU-TIENDA.myshopify.com --theme ID_DEL_TEMA --path tema
Copy-Item -Recurse -Force shopify\assets\* tema\assets\
Copy-Item -Force shopify\sections\oriental-aromas.liquid tema\sections\
Copy-Item -Force shopify\layout\oriental-aromas.liquid tema\layout\
Copy-Item -Force shopify\templates\page.oriental-aromas.json tema\templates\
shopify theme push --store TU-TIENDA.myshopify.com --theme ID_DEL_TEMA --path tema --unpublished
```

Luego asigna la plantilla **oriental-aromas** a una página de prueba o copia el JSON a `templates/index.json` para usarla como inicio. `--unpublished` crea una copia de trabajo para revisar antes de publicar.

## Opción C: tema completo para una demo

No se incluye un tema completo a propósito. Subir un ZIP con **Add theme → Upload zip** reemplaza todo el tema y dejaría sin diseño las páginas de producto, colección, carrito y checkout. Para una demo visual usa **Vercel** (ver README). Si necesitas un tema Shopify independiente solo para la landing, se puede preparar, pero las páginas internas tendrían que construirse aparte.

## Vídeos y límites

- `oa-discovery-pingpong.mp4`: loop de 40 s (960 fotogramas), 1920×1080, H.264, sin audio, faststart. Empieza y termina en el logo; incluye la transición al camión.
- `oa-truck-scroll.mp4`: vídeo del camión controlado por scroll.
- El archivo principal pesa ~18,7 MB. Shopify tiene un límite de ~20 MB por archivo en los assets del tema; si lo reemplazas por uno más grande, usa Shopify Files y el ajuste de vídeo de la sección.
- Los vídeos se sirven con `preload` y autoplay silenciado; el scroll controla el segundo vídeo y el primer loop se pausa al hacer scroll.

## Datos dinámicos y enlaces

- Los cuatro productos salen de la colección elegida: título, URL, imagen y precio reales de Shopify.
- Los enlaces a colecciones, cuenta, carrito, políticas y páginas son relativos a la tienda.
- El selector ES/EN cambia los textos de la landing; no cambia Shopify Markets, divisas ni las traducciones del resto de la tienda.
- El límite de USD 499 es contenido informativo; las reglas de pedido mínimo y el checkout dependen de la configuración de Shopify.
- La suscripción usa el formulario nativo de Shopify. En la demo de Vercel no se envía una suscripción real.

## Comprobaciones antes de publicar

- La plantilla `oriental-aromas` aparece en el selector de plantillas.
- La colección tiene al menos cuatro productos con imagen y precio.
- El header, el footer, los overlays y el selector ES/EN funcionan en móvil y escritorio.
- El vídeo principal arranca solo, hace loop desde el logo y el camión responde al scroll.
- El formulario de suscripción responde en la tienda de Shopify.
- Los enlaces de producto y carrito abren las páginas reales de la tienda.

## Notas de desarrollo

- Textos: `src/data.js`.
- Componentes y lógica: `src/main.jsx`.
- Estilos: `src/styles.css` y `src/mobile-dock.css`.
- Build web (Vercel): `npm run build:web` → `dist/`.
- Build Shopify: `npm run build:shopify` → `dist/` + `shopify/`.
- Build completo: `npm run build` (genera ambos).

No se ha instalado ni publicado en una tienda Shopify desde este proyecto; la integración debe probarse en una copia del tema antes de publicar.
