import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.join(__dirname, '../node_modules/lucide-react-native/dist/esm/icons');

if (!fs.existsSync(iconsDir)) {
  console.error('Icons directory not found');
  process.exit(1);
}

const files = fs.readdirSync(iconsDir)
  .filter(f => f.endsWith('.js') && !f.endsWith('.map') && f !== 'index.js');

// Create a simple index that re-exports all icons
const exports = files.map(f => {
  const baseName = f.replace('.js', '');
  // Convert kebab-case to PascalCase
  const name = baseName
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  return `export { default as ${name} } from './${f}';`;
}).join('\n');

const indexContent = `// Auto-generated index file for lucide-react-native icons
${exports}
`;

fs.writeFileSync(path.join(iconsDir, 'index.js'), indexContent);
console.log(`✅ Created index.js with ${files.length} icon exports`);

