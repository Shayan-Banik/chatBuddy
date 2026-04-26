import React from "react";
import { ArrowUp, Paperclip, Mic } from "lucide-react";

export default function MessageInput({
  inputRef,
  inputMessage,
  setInputMessage,
  onSend,
  activeChatId,
  darkMode,
}) {
  const dark = darkMode;
  const hasText = inputMessage.trim().length > 0;

  return (
    <div
      className={`relative z-10 px-4 pb-5 pt-3 ${dark ? "bg-transparent" : "bg-transparent"}`}>
      <div className="max-w-3xl mx-auto">
        {/* Outer card */}
        <div
          className={`relative flex flex-col rounded-3xl border transition-all duration-200 ${
            dark
              ? "bg-white/6 border-white/12 hover:border-white/20 focus-within:border-[#a78bfa]/50 focus-within:bg-white/8"
              : "bg-white border-black/10 hover:border-black/18 focus-within:border-[#7c3aed]/40 shadow-sm focus-within:shadow-md"
          }`}
          style={{
            boxShadow: dark ? "0 0 0 0 transparent" : undefined,
          }}>
          {/* Textarea */}
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder={
              activeChatId ? "Message ChatBuddy…" : "Start a new conversation…"
            }
            rows={1}
            style={{ minHeight: "52px", maxHeight: "160px", resize: "none" }}
            onInput={(e) => {
              e.target.style.height = "52px";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 160) + "px";
            }}
            className={`w-full bg-transparent px-5 pt-4 pb-2 text-sm leading-relaxed focus:outline-none placeholder-opacity-40 transition-colors ${
              dark
                ? "text-white placeholder-white/35"
                : "text-[#1a1a1a] placeholder-black/35"
            }`}
          />

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-3 pb-3 pt-1">
            {/* Left: attachment + mic */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Attach file"
                className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all ${
                  dark
                    ? "text-white/35 hover:text-white/70 hover:bg-white/8"
                    : "text-black/30 hover:text-black/60 hover:bg-black/6"
                }`}>
                <Paperclip size={16} />
              </button>
              <button
                type="button"
                aria-label="Voice input"
                className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all ${
                  dark
                    ? "text-white/35 hover:text-white/70 hover:bg-white/8"
                    : "text-black/30 hover:text-black/60 hover:bg-black/6"
                }`}>
                <Mic size={16} />
              </button>
            </div>

            {/* Right: char hint + send */}
            <div className="flex items-center gap-2">
              {hasText && (
                <span
                  className={`text-[11px] font-medium tabular-nums ${dark ? "text-white/25" : "text-black/25"}`}>
                  ↵ to send
                </span>
              )}
              <button
                onClick={onSend}
                disabled={!hasText}
                aria-label="Send message"
                className={`flex items-center justify-center w-9 h-9 rounded-2xl font-bold transition-all duration-200 ${
                  hasText
                    ? "bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-lg"
                    : dark
                      ? "bg-white/8 text-white/25 cursor-not-allowed"
                      : "bg-black/8 text-black/25 cursor-not-allowed"
                }`}
                style={
                  hasText
                    ? { boxShadow: "0 4px 16px rgba(124,58,237,0.4)" }
                    : undefined
                }>
                <ArrowUp size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <p
          className={`text-center text-[11px] mt-2.5 ${dark ? "text-white/18" : "text-black/20"}`}>
          ChatBuddy can make mistakes. Double-check important info.
        </p>
      </div>
    </div>
  );
}
