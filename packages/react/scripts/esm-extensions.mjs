import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const SPECIFIER = /(from\s+|import\s+|export\s+\*\s+from\s+)(['"])(\.{1,2}\/[^'"]+)(['"])/g;

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(js|d\.ts)$/.test(entry.name) ? [full] : [];
  });
}

let patched = 0;
for (const file of walk(dist)) {
  const source = readFileSync(file, 'utf8');
  const next = source.replace(SPECIFIER, (match, keyword, open, specifier, close) =>
    path.extname(specifier) === '' ? `${keyword}${open}${specifier}.js${close}` : match,
  );
  if (next !== source) {
    writeFileSync(file, next, 'utf8');
    patched += 1;
  }
}

process.stderr.write(`Расширения .js проставлены в ${patched} файлах dist\n`);
