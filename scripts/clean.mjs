// Remove pastas de resultados/relatórios de forma portátil (Windows, Linux, macOS).
import { rmSync } from 'node:fs';
import { resolve } from 'node:path';

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error('Uso: node scripts/clean.mjs <pasta> [<pasta> ...]');
  process.exit(1);
}

for (const target of targets) {
  rmSync(resolve(process.cwd(), target), { recursive: true, force: true });
  console.log(`Removido (se existia): ${target}`);
}
