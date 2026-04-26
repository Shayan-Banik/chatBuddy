import React from "react";
import { Menu } from "lucide-react";

export default function MobileHeader({ onOpenSidebar, activeTitle, darkMode }) {
  const dark = darkMode !== false; // default dark if not passed

  return (
    <div
      className={`lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 border-b backdrop-blur-xl transition-colors duration-300 ${
        dark
          ? "bg-[#0d0d0d]/85 border-white/8"
          : "bg-[#f5f3ef]/85 border-black/8"
      }`}
    >
      {/* Menu button */}
      <button
        onClick={onOpenSidebar}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${
          dark
            ? "border-white/10 text-white/60 hover:bg-white/8 hover:text-white/90"
            : "border-black/10 text-black/50 hover:bg-black/6 hover:text-black/80"
        }`}
      >
        <Menu size={17} strokeWidth={2} />
      </button>

      {/* Title / Brand */}
      <div className="flex items-center gap-2">
        {!activeTitle && (
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[9px] font-black"
            style={{ background: "linear-gradient(135deg,#7c3aed,#38bdf8)" }}
          >
            CB
          </div>
        )}
        <span
          className={`text-sm font-bold tracking-tight truncate max-w-[180px] ${
            activeTitle
              ? dark ? "text-white/80" : "text-black/75"
              : dark ? "text-[#a78bfa]" : "text-[#7c3aed]"
          }`}
          style={!activeTitle ? { fontFamily: "'DM Sans','Segoe UI',sans-serif" } : undefined}
        >
          {activeTitle || "ChatBuddy"}
        </span>
      </div>

      {/* Spacer to balance layout */}
      <div className="w-9" />
    </div>
  );
}