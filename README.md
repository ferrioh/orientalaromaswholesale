# Oriental Aromas Wholesale

Landing de perfumería mayorista construida con React, Vite y Motion. Incluye portada cinematográfica con vídeo, catálogo destacado, colecciones, beneficios, newsletter y selector ES/EN.

## Stack

- React 19 + Vite 7
- Motion para animaciones y transiciones de scroll
- CSS propio (sin framework)
- Build estático para Vercel
- Sección Liquid + plantilla de página para Shopify

## Desarrollo local

```powershell
npm install
npm run dev
```

Abre `http://127.0.0.1:5173`.

## Demo en Vercel

El proyecto ya está preparado para Vercel:

1. Sube el repositorio a GitHub, GitLab o Bitbucket.
2. En Vercel, importa el repositorio.
3. Vercel detecta Vite. Si pregunta, usa:
   - **Framework**: Vite
   - **Build command**: `npm run build:web`
   - **Output directory**: `dist`
4. No necesitas variables de entorno.
5. Despliega.

`vercel.json` ya fija el build, la carpeta de salida y caché larga para `/assets` y `/media`. `.nvmrc` pide Node 22 (Vite 7 requiere Node 20.19+).

La demo usa datos de vista previa (`src/products.json`) y enlaces a la tienda real. El formulario de newsletter está desactivado en la demo; en Shopify usa el formulario nativo.

## Shopify (Liquid)

La carpeta `shopify/` no es un tema completo: es una **sección + plantilla de página** para integrarla en un tema existente y conservar producto, carrito y checkout. Incluye assets, layout independiente, sección y plantilla.

```powershell
npm run build:shopify
```

Sigue la guía completa en [SHOPIFY.md](SHOPIFY.md). Resumen:

1. Duplica el tema en Shopify.
2. Copia `shopify/assets/`, `shopify/sections/oriental-aromas.liquid`, `shopify/layout/oriental-aromas.liquid` y `shopify/templates/page.oriental-aromas.json` al tema.
3. Crea una página y asígnale la plantilla **oriental-aromas**.
4. Selecciona la colección en el editor.
5. Revisa en vista previa antes de publicar.

Para usarla como inicio, reemplaza el `templates/index.json` de la copia del tema por `shopify/templates/index.json`.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor local |
| `npm run build:web` | Build estático en `dist/` (Vercel) |
| `npm run build:shopify` | Build + paquete Shopify en `shopify/` |
| `npm run build` | Build + paquete Shopify |
| `npm run preview` | Vista previa del build |

## Estructura

```text
src/                 React, datos, estilos y componentes
public/media/        Fuentes, imágenes y vídeos usados por la web
public/favicon.svg   Icono
scripts/             Empaquetado para Shopify
shopify-src/         Fuente de la sección, layout y plantilla Liquid
shopify/             Paquete Shopify generado (assets incluidos)
dist/                Build web generado (no se sube a Git)
```

## Vídeos

- `discovery-pingpong.mp4`: loop de 40 s que empieza y termina en el logo. 1920×1080, H.264, sin audio, faststart, ~18,7 MB.
- `truck-scroll.mp4`: camión controlado por scroll.
- El loop se reproduce solo al cargar y se pausa al hacer scroll; el camión avanza con el scroll.

## Licencias

Fuentes, vídeos y componentes conservan sus licencias en los archivos `*-OFL.txt`, `MANROPE-LICENSE.txt` y `REACT-BITS-LICENSE.md`.
