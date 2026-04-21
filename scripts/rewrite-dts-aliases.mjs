import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");

function visit(directory) {
  for (const entry of readdirSync(directory)) {
    const fullPath = path.join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      visit(fullPath);
      continue;
    }

    if (!fullPath.endsWith(".d.ts")) {
      continue;
    }

    const source = readFileSync(fullPath, "utf8");
    const withoutCssSideEffects = source.replace(/^import\s+["'][^"']+\.css["'];?\r?\n/gm, "");
    const rewritten = withoutCssSideEffects.replaceAll(/from\s+["']@\/([^"']+)["']/g, (_match, specifier) => {
      const absoluteTarget = path.resolve(distDir, specifier);
      const relativePath = path.relative(path.dirname(fullPath), absoluteTarget).replaceAll(path.sep, "/");
      const normalizedPath = relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
      return `from "${normalizedPath}"`;
    });

    if (rewritten !== source) {
      writeFileSync(fullPath, rewritten);
    }
  }
}

visit(distDir);
