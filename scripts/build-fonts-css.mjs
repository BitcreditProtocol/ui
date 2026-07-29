import { cp, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Publishes the Geist typeface (referenced by --font-sans/--font-mono in
// tokens.css) as a framework-independent fonts.css + woff2 files, so static
// sites get the real typeface instead of falling back to system-ui.
//
// The font files live in assets/fonts/ (vendored from the `geist` npm
// package, SIL Open Font License, see assets/fonts/LICENSE.txt) rather than
// being installed as a dependency, since `geist` pulls in `next` as a peer
// dependency purely for its next/font wrapper modules, which we don't use.

const root = process.cwd();
const assetsDir = path.resolve(root, "assets/fonts");
const outDir = path.resolve(root, "dist/fonts");

await mkdir(outDir, { recursive: true });
await cp(assetsDir, outDir, { recursive: true });

const fontsCss = `@font-face {
  font-family: "Geist";
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url("./fonts/geist-sans/Geist-Variable.woff2") format("woff2");
}

@font-face {
  font-family: "Geist Mono";
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url("./fonts/geist-mono/GeistMono-Variable.woff2") format("woff2");
}
`;

await writeFile(path.resolve(root, "dist/fonts.css"), fontsCss);
