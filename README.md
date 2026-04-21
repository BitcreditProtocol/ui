# @bitcredit/ui-library

Bitcredit design system and reusable React UI library.

## Installation

Install the package together with its peer dependencies:

```bash
npm install @bitcredit/ui-library react react-dom
```

If you consume the GitHub Packages build instead, use the published package name for that registry:

```bash
npm install @bitcreditprotocol/ui-library react react-dom
```

## Quick Start

Import the library stylesheet once near your app entrypoint, then import the components you need:

```tsx
import "@bitcredit/ui-library/style.css";
import { Button } from "@bitcredit/ui-library";

export function Example() {
  return <Button>Continue</Button>;
}
```

For predictable consumer behavior, treat the explicit `style.css` import as required public API.
The JS package entry currently carries the stylesheet through the library build, but consumers should not rely on implicit style loading.

The package ships:

- `dist/index.mjs` for ESM consumers
- `dist/index.cjs` for CommonJS consumers
- `dist/index.d.ts` for TypeScript types
- `dist/style.css` for the shared library styles

## CSS

This library currently expects consumers to load the exported stylesheet:

```tsx
import "@bitcredit/ui-library/style.css";
```

Without that import, many components will render without the expected design system styling.

Recommended pattern:

```tsx
import "@bitcredit/ui-library/style.css";
import { Button, Card } from "@bitcredit/ui-library";
```

## Provider Setup

Some components and hooks depend on providers from the library. A common app-level setup looks like this:

```tsx
import "@bitcredit/ui-library/style.css";
import {
  LanguageProvider,
  PreferencesProvider,
  Toaster,
} from "@bitcredit/ui-library";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <PreferencesProvider>
        {children}
        <Toaster />
      </PreferencesProvider>
    </LanguageProvider>
  );
}
```

Use the providers you actually need:

- `PreferencesProvider` for theme, currency, and decimal preferences
- `LanguageProvider` for `react-intl`-based localization helpers
- `Toaster` when using toast UI from `useToast`

## Example Imports

```tsx
import {
  Button,
  Card,
  DatePicker,
  Input,
  Search,
  useToast,
} from "@bitcredit/ui-library";
```

## Package Notes

- The package is built in Vite library mode.
- Only library artifacts are published; app bundle files like `index.html` are not part of the package.
- `react` and `react-dom` are peer dependencies and must be provided by the consuming app.
- Tailwind and Vite integration packages are build-time dependencies of this repository, not runtime requirements for consumers.
- TypeScript declarations are generated and published with the package.

## Development

Useful local commands:

```bash
npm run dev
npm run storybook
npm run build
npm run test
npm run lint
npm run style:check
```

## Repository

- Repository: `https://github.com/BitcreditProtocol/ui.git`
- Storybook and local component development remain part of this repository, but the published package is a consumable UI library.
