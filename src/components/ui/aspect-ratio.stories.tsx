import type { Meta, StoryObj } from "@storybook/react"
import { AspectRatio } from "./aspect-ratio"
import Image from "next/image"

const meta = {
  title: "UI/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof AspectRatio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <AspectRatio ratio={16 / 9} className="bg-muted flex items-center justify-center rounded-md">
        <div className="text-muted-foreground text-sm">16 / 9 비율</div>
      </AspectRatio>
    </div>
  ),
}

export const Square: Story = {
  render: () => (
    <div className="w-full max-w-xs">
      <AspectRatio ratio={1 / 1} className="bg-muted flex items-center justify-center rounded-md">
        <div className="text-muted-foreground text-sm">1 / 1 비율</div>
      </AspectRatio>
    </div>
  ),
}

export const Widescreen: Story = {
  render: () => (
    <div className="w-full max-w-2xl">
      <AspectRatio ratio={21 / 9} className="bg-muted flex items-center justify-center rounded-md">
        <div className="text-muted-foreground text-sm">21 / 9 비율</div>
      </AspectRatio>
    </div>
  ),
}

export const WithImage: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <AspectRatio ratio={16 / 9} className="bg-muted overflow-hidden rounded-md">
        <Image
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop"
          alt="건물 이미지"
          fill
          className="object-cover"
        />
      </AspectRatio>
    </div>
  ),
}

export const Multiple: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">16:9 (일반적)</h3>
        <div className="w-full max-w-sm">
          <AspectRatio ratio={16 / 9} className="bg-slate-200 rounded-md" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">1:1 (정사각형)</h3>
        <div className="w-full max-w-xs">
          <AspectRatio ratio={1} className="bg-slate-200 rounded-md" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">4:3 (표준)</h3>
        <div className="w-full max-w-sm">
          <AspectRatio ratio={4 / 3} className="bg-slate-200 rounded-md" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">21:9 (시네마)</h3>
        <div className="w-full max-w-2xl">
          <AspectRatio ratio={21 / 9} className="bg-slate-200 rounded-md" />
        </div>
      </div>
    </div>
  ),
}
