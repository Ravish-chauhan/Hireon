const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['testRenderNode.ts'],
  bundle: true,
  outfile: 'testRenderNode.bundle.js',
  platform: 'node',
  target: 'node16',
  external: ['react', 'react-dom', 'react-router-dom', 'lucide-react']
}).then(() => {
  console.log('Build succeeded!');
}).catch(() => process.exit(1));
