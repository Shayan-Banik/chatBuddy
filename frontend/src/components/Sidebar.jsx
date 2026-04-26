import React from "react";
import ChatList from "./ChatList";
import UserProfile from "./UserProfile";
import { X, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar({
  chats,
  activeChatId,
  editingChatId,
  newChatName,
  onNewChat,
  onSelectChat,
  onEditChat,
  onDeleteChat,
  onChangeNewChatName,
  onSaveChatName,
  user,
  showUserMenu,
  setShowUserMenu,
  darkMode,
  setDarkMode,
  onLogout,
  setSidebarOpen,
  sidebarOpen = false,
}) {
  const dark = darkMode;

  return (
    <div
      className={`
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        fixed inset-y-0 left-0 z-50 w-72
        lg:translate-x-0 lg:static lg:inset-0
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        border-r
        ${dark
          ? "bg-[#0d0d0d] border-white/8"
          : "bg-[#f5f3ef] border-black/8"
        }
      `}
    >
      {/* ── Header ── */}
      <div className={`flex items-center justify-between px-4 py-4 border-b ${dark ? "border-white/8" : "border-black/8"}`}>
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[10px] font-black"
            style={{ background: "linear-gradient(135deg,#7c3aed,#38bdf8)" }}>
            CB
          </div>
          <span className="font-black text-base tracking-tight"
            style={{ color: dark ? "#a78bfa" : "#7c3aed" }}>
            ChatBuddy
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Go Home */}
          <Link to="/">
            <button className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              dark
                ? "border-white/15 text-white/60 hover:bg-white/8 hover:text-white/90"
                : "border-black/12 text-black/50 hover:bg-black/6 hover:text-black/80"
            }`}>
              Home
            </button>
          </Link>

          {/* Close (mobile only) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className={`lg:hidden w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
              dark ? "text-white/40 hover:bg-white/8 hover:text-white/80" : "text-black/35 hover:bg-black/6 hover:text-black/70"
            }`}>
            <X size={15} />
          </button>
        </div>
      </div>

      {/* ── New Chat button ── */}
      <div className="px-3 pt-3 pb-2">
        <button
          onClick={() => onNewChat()}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-sm font-bold text-white transition-all"
          style={{
            background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
            boxShadow: "0 4px 16px rgba(124,58,237,0.35)",
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          New Chat
        </button>
      </div>

      {/* ── Chat list ── */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {chats.length === 0 ? (
          <div className={`text-center py-10 text-xs ${dark ? "text-white/25" : "text-black/25"}`}>
            No chats yet
          </div>
        ) : (
          <ChatList
            chats={chats}
            activeChatId={activeChatId}
            editingChatId={editingChatId}
            newChatName={newChatName}
            onSelectChat={onSelectChat}
            onEditChat={onEditChat}
            onDeleteChat={onDeleteChat}
            onChangeNewChatName={onChangeNewChatName}
            onSaveChatName={onSaveChatName}
            darkMode={darkMode}
          />
        )}
      </div>

      {/* ── Footer / User profile ── */}
      <div className={`border-t px-3 py-3 ${dark ? "border-white/8" : "border-black/8"}`}>
        <UserProfile
          user={user}
          showUserMenu={showUserMenu}
          setShowUserMenu={setShowUserMenu}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onLogout={onLogout}
        />
      </div>
    </div>
  );
}