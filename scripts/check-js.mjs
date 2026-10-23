import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const directory = new URL('../assets/marain/js/', import.meta.url);
for (const file of readdirSync(directory)) {
  if (!/\.m?js$/.test(file)) continue;
  const result = spawnSync(process.execPath, ['--check', new URL(file, directory).pathname], { stdio: 'inherit' });
  if (result.error || result.status !== 0) process.exit(1);
}
