import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const project = process.cwd();
const output = path.join(project, 'shopify');
await mkdir(output, { recursive: true });
await cp(path.join(project, 'shopify-src'), output, { recursive: true });
await mkdir(path.join(output, 'assets'), { recursive: true });
await cp('dist/assets/oriental-aromas.js', path.join(output, 'assets/oriental-aromas.js'));
const css = (await readFile('dist/assets/oriental-aromas.css', 'utf8'))
  .replaceAll('../media/', './oa-')
  .replaceAll('/media/', './oa-');
await writeFile(path.join(output, 'assets/oriental-aromas.css'), css);
const files = (await readdir('public/media')).filter(file => file !== 'logo.png');
for (const file of files) await cp(path.join(project, 'public/media', file), path.join(output, 'assets', `oa-${file}`));
await cp('public/favicon.svg', path.join(output, 'assets/oa-favicon.svg'));
const mapping = files.map(file => {
  const value = ['intro.mp4', 'truck-scroll.mp4'].includes(file) ? 'intro_url' : ['discovery.mp4', 'story.mp4', 'discovery-scroll.mp4', 'discovery-reverse.mp4', 'discovery-pingpong.mp4'].includes(file) ? 'discovery_url' : `'oa-${file}' | asset_url`;
  return `    ${JSON.stringify(file)}: {{ ${value} | json }}`;
}).join(',\n');
const source = await readFile('shopify-src/sections/oriental-aromas.liquid', 'utf8');
await writeFile(path.join(output, 'sections/oriental-aromas.liquid'), source.replace('    __ASSET_MAP__', mapping));
await cp('REACT-BITS-LICENSE.md', path.join(output, 'REACT-BITS-LICENSE.md'));
await cp('MANROPE-LICENSE.txt', path.join(output, 'MANROPE-LICENSE.txt'));
await cp('BODONI-MODA-OFL.txt', path.join(output, 'BODONI-MODA-OFL.txt'));
await cp('ARCHIVO-BLACK-OFL.txt', path.join(output, 'ARCHIVO-BLACK-OFL.txt'));
await cp('LORA-OFL.txt', path.join(output, 'LORA-OFL.txt'));
await cp('SHOPIFY.md', path.join(output, 'INSTALACION.md'));
console.log('Shopify: sección, diseño independiente, plantilla y recursos generados en shopify/.');
