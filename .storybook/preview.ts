import type { Preview } from "@storybook/react-vite";
import "../src/index.css";
import { createElement, Fragment, type ReactElement, useEffect } from "react";

import { Toaster } from "@/components/ui/toaster";

type ThemeMode = "light" | "dark";

function ThemeWrapper({ story, theme }: { story: () => ReactElement; theme: ThemeMode }) {
  useEffect(() => {
    const isDark = theme === "dark";

    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.setAttribute("data-theme", theme);
    document.body.classList.toggle("dark", isDark);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return createElement(Fragment, null, story(), createElement(Toaster));
}

function ThemeDecorator(Story: () => ReactElement, context: { globals: { theme?: ThemeMode } }) {
  return createElement(ThemeWrapper, {
    story: Story,
    theme: context.globals.theme ?? "light",
  });
}

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Preview theme mode",
      defaultValue: "light",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [ThemeDecorator],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
