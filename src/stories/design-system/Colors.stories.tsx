import type { Meta, StoryObj } from "@storybook/react";

interface ColorToken {
  name: string;
  variable: string;
  lightValue: string;
  darkValue: string;
  description?: string;
}

const colorTokens: ColorToken[] = [
  // Brand
  { name: "Brand", variable: "--brand", lightValue: "#0064FF", darkValue: "#0064FF", description: "Primary brand color" },
  { name: "Brand Secondary", variable: "--brand-secondary", lightValue: "rgba(0, 100, 255, 0.1)", darkValue: "rgba(0, 100, 255, 0.8)" },

  // Background
  { name: "Background", variable: "--background", lightValue: "#FFFFFF", darkValue: "#080808" },
  { name: "Foreground", variable: "--foreground", lightValue: "#2C2C2C", darkValue: "#EFEFEF" },

  // Panel (Surface Hierarchy)
  { name: "Panel 10", variable: "--panel-10", lightValue: "#FFFFFF", darkValue: "#1E1E1E" },
  { name: "Panel 20", variable: "--panel-20", lightValue: "#FAFAFA", darkValue: "#2C2C2C" },
  { name: "Panel 30", variable: "--panel-30", lightValue: "#F5F5F5", darkValue: "#393939" },
  { name: "Panel 40", variable: "--panel-40", lightValue: "#EAEAEA", darkValue: "#494949" },

  // System Colors
  { name: "System Red", variable: "--system-red", lightValue: "#C9252D", darkValue: "#D7373F" },
  { name: "System Orange", variable: "--system-orange", lightValue: "#CB6F10", darkValue: "#F97316" },
  { name: "System Yellow", variable: "--system-yellow", lightValue: "#BEA736", darkValue: "#BEA736" },
  { name: "System Green", variable: "--system-green", lightValue: "#12805C", darkValue: "#268E6C" },
  { name: "System Blue", variable: "--system-blue", lightValue: "#0D66D0", darkValue: "#1473E6" },

  // Chart Colors
  { name: "Chart 1", variable: "--chart-1", lightValue: "#0064FF", darkValue: "#3B82F6" },
  { name: "Chart 2", variable: "--chart-2", lightValue: "#12805C", darkValue: "#22C55E" },
  { name: "Chart 3", variable: "--chart-3", lightValue: "#CB6F10", darkValue: "#F97316" },
  { name: "Chart 4", variable: "--chart-4", lightValue: "#7C3AED", darkValue: "#A855F7" },
  { name: "Chart 5", variable: "--chart-5", lightValue: "#C9252D", darkValue: "#EF4444" },

  // Text
  { name: "Text Primary", variable: "--text-primary", lightValue: "#2C2C2C", darkValue: "#EFEFEF" },
  { name: "Text Secondary", variable: "--text-secondary", lightValue: "#6E6E6E", darkValue: "#A2A2A2" },
  { name: "Text Brand", variable: "--text-brand", lightValue: "#0064FF", darkValue: "#3B82F6" },
  { name: "Text Link", variable: "--text-link", lightValue: "#1473E6", darkValue: "#1473E6" },
];

function ColorPalette() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-6 text-2xl font-semibold">색상 토큰 (Design Tokens)</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {colorTokens.map((token) => (
            <div key={token.variable} className="space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className="h-12 w-12 rounded border border-gray-300"
                  style={{
                    backgroundColor: token.lightValue,
                  }}
                  title={token.name}
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{token.name}</p>
                  <p className="text-xs text-gray-500">{token.variable}</p>
                </div>
              </div>
              <div className="text-xs">
                <p className="text-gray-600">Light: {token.lightValue}</p>
                <p className="text-gray-600">Dark: {token.darkValue}</p>
              </div>
              {token.description && <p className="text-xs italic text-gray-500">{token.description}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-8">
        <h3 className="mb-4 text-lg font-semibold">Gradients</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium">Brand Gradient</p>
            <div
              className="h-20 rounded"
              style={{
                background: "linear-gradient(135deg, #0064FF 0%, #4B90FF 100%)",
              }}
            />
            <p className="mt-1 text-xs text-gray-600">--gradient-brand</p>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Success Gradient</p>
            <div
              className="h-20 rounded"
              style={{
                background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
              }}
            />
            <p className="mt-1 text-xs text-gray-600">--gradient-success</p>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Warning Gradient</p>
            <div
              className="h-20 rounded"
              style={{
                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
              }}
            />
            <p className="mt-1 text-xs text-gray-600">--gradient-warning</p>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Danger Gradient</p>
            <div
              className="h-20 rounded"
              style={{
                background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
              }}
            />
            <p className="mt-1 text-xs text-gray-600">--gradient-danger</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: "Design System/Colors",
  component: ColorPalette,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Complete color palette used across the insite-web application. Includes brand colors, system colors, chart colors, and semantic colors for light and dark themes.",
      },
    },
  },
} satisfies Meta<typeof ColorPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => <ColorPalette />,
};
