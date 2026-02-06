import { create } from "zustand";
import { persist } from "zustand/middleware";

type SidebarMode = "closed" | "open" | "pinned";

interface UIState {
  // 사이드바 상태
  sidebarMode: SidebarMode;
  sidebarWidth: number;

  // Command Palette 상태
  isCommandPaletteOpen: boolean;

  // 액션
  setSidebarMode: (mode: SidebarMode) => void;
  toggleSidebar: () => void;
  pinSidebar: () => void;
  unpinSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

/**
 * UI 상태 스토어
 * - 사이드바 열림/닫힘/고정 상태
 * - Command Palette 상태
 */
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarMode: "open",
      sidebarWidth: 250,
      isCommandPaletteOpen: false,

      setSidebarMode: (mode) => {
        set({
          sidebarMode: mode,
          sidebarWidth: mode === "closed" ? 64 : 250,
        });
      },

      toggleSidebar: () => {
        const current = get().sidebarMode;
        if (current === "closed") {
          set({ sidebarMode: "open", sidebarWidth: 250 });
        } else {
          set({ sidebarMode: "closed", sidebarWidth: 64 });
        }
      },

      pinSidebar: () => {
        set({ sidebarMode: "pinned", sidebarWidth: 250 });
      },

      unpinSidebar: () => {
        set({ sidebarMode: "open", sidebarWidth: 250 });
      },

      setCommandPaletteOpen: (open) => {
        set({ isCommandPaletteOpen: open });
      },
    }),
    {
      name: "ui-store",
      partialize: (state) => ({
        sidebarMode: state.sidebarMode,
      }),
    }
  )
);
