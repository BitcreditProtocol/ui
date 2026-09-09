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
- `UiI18nProvider` for framework-agnostic shared UI message injection
- `Toaster` when using toast UI from `useToast`

## Translation Strategy

For shared UI text, prefer app-owned translations with library-owned keys and fallbacks.

The library now exports:

- `UiTranslationKey`
- `defaultUiMessages`
- `UiI18nProvider`
- `getUiText`

Minimal example:

```tsx
import "@bitcredit/ui-library/style.css";
import {
  Button,
  UiI18nProvider,
  defaultUiMessages,
  type UiTranslationKey,
} from "@bitcredit/ui-library";

const appMessages: Partial<Record<UiTranslationKey, string>> = {
  "ui.upload.label": "Datei hochladen",
};

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <UiI18nProvider messages={appMessages}>{children}</UiI18nProvider>;
}
```

You can also provide a translation function instead of a message map:

```tsx
import { UiI18nProvider, type UiT } from "@bitcredit/ui-library";

const t: UiT = (key, params) => myI18n.translate(key, params);

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <UiI18nProvider t={t}>{children}</UiI18nProvider>;
}
```

Current migration note:

- generic UI components can consume `UiI18nProvider`
- existing `react-intl` consumers continue to work
- domain and app copy should stay in consuming apps

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

## Package release recovery

The tag-push release workflow builds the library once, prepares separate npmjs
and GitHub Packages tarballs, and saves them in the immutable `release-package`
Actions artifact for 90 days before either publication starts. The saved plan
contains the full source SHA, tag/version, original run ID and both archive
checksums and npm integrity values. The two existing approval environments remain
independent; GitHub releases are still created separately.

Stable versions use `latest`. Prerelease versions whose first identifier is
`alpha`, `beta`, `rc` or `test` use that channel; other prereleases use `next`.
Full SemVer is validated with npm while rejecting loose coercions. Build metadata
is retained in tags and package manifests, but is not a separate npm registry
version identity.

To recover a partial publication, rerun only the failed publisher job in the
original workflow. It restores the exact tarballs and verifies both registries
before writing. Keep the successful build and its artifact. Do not select
**Re-run all jobs**, which removes previous artifacts despite their retention.
Matching publications are preserved; a missing publication is added. Conflicting
content, a moved tag, unreadable metadata, or an unavailable original artifact
stops the operation. Do not rebuild or overwrite an already published version.

Native Actions reruns are available for 30 days, even though the artifact is
retained for 90 days. Beyond that window, keep the evidence and arrange separate
operator recovery. A fresh workflow cannot adopt an existing publication without
its original artifact. Normal CI verifies real package contents without
publishing; the separate regression job uses simulated registry writes and has
no publication credentials.
