import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(root, '.env');
const outputPath = resolve(root, 'src/app/core/config.generated.ts');

let fileValues = {};
try {
  const envFile = await readFile(envPath, 'utf8');
  fileValues = Object.fromEntries(
    envFile
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const separator = line.indexOf('=');
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
      }),
  );
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error;
  }
}

const apiUrl = process.env.API_URL || fileValues.API_URL;
if (!apiUrl) {
  throw new Error('API_URL must be set in the environment or .env file.');
}

await writeFile(
  outputPath,
  `export const config = {\n  apiUrl: ${JSON.stringify(apiUrl)},\n} as const;\n`,
);
