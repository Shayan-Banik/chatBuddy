import React from "react";
import { MessageSquare, Edit2, Trash2, Check, X } from "lucide-react";

export default function ChatList({
  chats,
  activeChatId,
  editingChatId,
  newChatName,
  onSelectChat,
  onEditChat,
  onDeleteChat,
  onChangeNewChatName,
  onSaveChatName,
  darkMode,
}) {
  const dark = darkMode;

  return (
    <div className="space-y-0.5">
      {chats.map((chat) => {
        const isActive = chat.id === activeChatId;
        const isEditing = editingChatId === chat.id;

        return (
          <div
            key={chat.id}
            onClick={() => !isEditing && onSelectChat(chat.id)}
            className={`
              group flex items-center gap-2 px-3 py-2.5 rounded-2xl
              transition-all duration-150 cursor-pointer select-none
              ${isActive
                ? dark
                  ? "bg-[#7c3aed]/18 border border-[#7c3aed]/28"
                  : "bg-[#7c3aed]/10 border border-[#7c3aed]/20"
                : dark
                ? "border border-transparent hover:bg-white/5 hover:border-white/8"
                : "border border-transparent hover:bg-black/4 hover:border-black/8"
              }
            `}
          >
            {isEditing ? (
              <div
                className="flex flex-1 items-center gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  value={newChatName}
                  onChange={(e) => onChangeNewChatName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSaveChatName();
                    if (e.key === "Escape") onEditChat(null);
                  }}
                  className={`flex-1 px-2.5 py-1.5 rounded-xl text-xs font-medium focus:outline-none border transition-all ${
                    dark
                      ? "bg-white/8 border-white/15 text-white focus:border-[#a78bfa]/60"
                      : "bg-white border-black/12 text-[#1a1a1a] focus:border-[#7c3aed]/50"
                  }`}
                  autoFocus
                />
                <button
                  onClick={(e) => { e.stopPropagation(); onSaveChatName(); }}
                  className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-emerald-400 hover:bg-emerald-400/15 transition-all"
                >
                  <Check size={13} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onEditChat(null); }}
                  className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-400/15 transition-all"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <>
                <MessageSquare
                  size={13}
                  className={`flex-shrink-0 transition-colors ${
                    isActive
                      ? dark ? "text-[#a78bfa]" : "text-[#7c3aed]"
                      : dark ? "text-white/30" : "text-black/25"
                  }`}
                />

                <span
                  className={`flex-1 text-xs font-medium truncate transition-colors ${
                    isActive
                      ? dark ? "text-[#a78bfa]" : "text-[#7c3aed]"
                      : dark ? "text-white/65" : "text-black/60"
                  }`}
                >
                  {chat.name}
                </span>

                <div
                  className={`flex items-center gap-0.5 flex-shrink-0 transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onEditChat(chat)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      dark
                        ? "text-white/35 hover:text-white/75 hover:bg-white/8"
                        : "text-black/30 hover:text-black/65 hover:bg-black/6"
                    }`}
                  >
                    <Edit2 size={11} />
                  </button>
                  <button
                    onClick={() => onDeleteChat(chat.id)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center transition-all text-red-400/50 hover:text-red-400 hover:bg-red-400/12"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}