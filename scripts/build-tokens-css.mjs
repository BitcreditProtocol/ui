import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { compile } from "tailwindcss";

// Publishes the Bitcredit design tokens (colors, fonts, shadows, radius) as a
// plain, framework-independent CSS file so static sites can use them without
// pulling in React or the full component library.
//
// Rather than hand-duplicating token values (which would drift from
// src/index.css over time), this script extracts the token declarations
// directly from src/index.css and re-compiles them in isolation with the
// real Tailwind engine, so dist/tokens.css always matches the library.

const root = process.cwd();
const indexCssPath = path.resolve(root, "src/index.css");
const outPath = path.resolve(root, "dist/tokens.css");

function extractBraceBlock(source, openBraceIndex) {
  let depth = 0;
  for (let i = openBraceIndex; i < source.length; i++) {
    if (source[i] === "{") {
      depth++;
    } else if (source[i] === "}") {
      depth--;
      if (depth === 0) {
        return source.slice(openBraceIndex + 1, i);
      }
    }
  }
  throw new Error(`Unbalanced braces starting at index ${openBraceIndex} while building tokens.css`);
}

function extractNamedBlock(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`Could not find "${marker}" in src/index.css while building tokens.css`);
  }
  const openBrace = markerIndex + marker.length - 1;
  return extractBraceBlock(source, openBrace);
}

function findAllIndices(source, marker) {
  const indices = [];
  for (let index = source.indexOf(marker); index !== -1; index = source.indexOf(marker, index + 1)) {
    indices.push(index);
  }
  return indices;
}

const source = await readFile(indexCssPath, "utf8");

const theme = extractNamedBlock(source, "@theme {");

let baseRoot;
let baseDark;
let variantDark;

for (const index of findAllIndices(source, "@layer base {")) {
  const openBrace = index + "@layer base {".length - 1;
  const content = extractBraceBlock(source, openBrace);

  if (/^\s*:root\s*\{/.test(content)) {
    baseRoot = extractNamedBlock(content, ":root {");
    baseDark = extractNamedBlock(content, ".dark {");
  } else if (content.includes("@variant dark {")) {
    variantDark = extractNamedBlock(content, "@variant dark {");
  }
}

if (baseRoot === undefined || baseDark === undefined) {
  throw new Error("Could not find the :root/.dark semantic token block in src/index.css while building tokens.css");
}
if (variantDark === undefined) {
  throw new Error("Could not find the `@variant dark` token overrides in src/index.css while building tokens.css");
}

// `static` forces Tailwind to always emit these variables, even though this
// isolated compile has no utility classes that would otherwise mark them "used".
const tokensSource = `
@theme static {
${theme}
}

:root {
${baseRoot}
}

.dark {
${baseDark}
${variantDark}
}
`;

const { build } = await compile(tokensSource, { base: root });
const css = build([]);

await mkdir(path.dirname(outPath), { recursive: true });
await writeFile(outPath, `${css.trim()}\n`);
