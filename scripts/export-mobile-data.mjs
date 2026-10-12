// Exports the web service catalogue to mobile/src/data/services.json so both apps share one source of truth.
// Usage: node scripts/export-mobile-data.mjs
import { build } from 'esbuild'
import { mkdirSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const out = 'node_modules/.cache/services.mjs'
await build({
  entryPoints: ['src/data/services.ts'],
  bundle: true,
  format: 'esm',
  outfile: out,
  loader: { '.webp': 'empty' },
  plugins: [{
    name: 'stub-icons',
    setup(b) {
      b.onResolve({ filter: /^lucide-react$/ }, () => ({ path: 'lucide', namespace: 'stub' }))
      b.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ contents: 'export default new Proxy({}, { get: () => null }); export const Building2=null, HardHat=null, Home=null, PackageOpen=null, Sofa=null, Sparkles=null;', loader: 'js' }))
    },
  }],
})
const { services } = await import(pathToFileURL(out).href)
const data = services.map(({ icon: _icon, image: _image, ...rest }) => rest)
mkdirSync('mobile/src/data', { recursive: true })
writeFileSync('mobile/src/data/services.json', JSON.stringify(data, null, 2) + '\n')
console.log(`Exported ${data.length} services`)
