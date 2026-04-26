import React from "react";

export default function MessageItem({ message, darkMode, index = 0 }) {
  const dark = darkMode;
  const isBot = message.isBot;

  const timeStr = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div
      className={`flex items-end gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}
      style={{
        animation: "msgIn 0.22s ease-out both",
        animationDelay: `${Math.min(index * 0.04, 0.3)}s`,
      }}
    >
      {/* Bot avatar */}
      {isBot && (
        <div
          className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-[10px] font-black mb-0.5"
          style={{ background: "linear-gradient(135deg,#7c3aed,#38bdf8)" }}
        >
          CB
        </div>
      )}

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[80%] sm:max-w-[72%] lg:max-w-[62%] ${isBot ? "items-start" : "items-end"}`}>
        <div
          className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words transition-all ${
            isBot
              ? dark
                ? "bg-white/7 border border-white/10 text-white/90 rounded-3xl rounded-bl-lg"
                : "bg-white border border-black/8 text-[#1a1a1a] rounded-3xl rounded-bl-lg shadow-sm"
              : "text-white rounded-3xl rounded-br-lg"
          }`}
          style={
            !isBot
              ? {
                  background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                  boxShadow: "0 4px 18px rgba(124,58,237,0.35)",
                }
              : undefined
          }
        >
          {message.text}
        </div>

        {/* Timestamp */}
        {timeStr && (
          <span className={`text-[10px] px-1 ${dark ? "text-white/22" : "text-black/25"}`}>
            {timeStr}
          </span>
        )}
      </div>

      {/* User avatar */}
      {!isBot && (
        <div
          className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-[10px] font-black mb-0.5"
          style={{ background: "linear-gradient(135deg,#6d28d9,#38bdf8)" }}
        >
          U
        </div>
      )}

      <style>{`
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}