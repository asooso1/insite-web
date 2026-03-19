import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["../public"],
  viteFinal: async (config) => {
    config.plugins = config.plugins ?? [];
    config.plugins.push(tailwindcss());
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...((config.resolve.alias as Record<string, string>) ?? {}),
      "@": path.resolve(__dirname, "../src"),
    };
    return config;
  },
};

export default config;
