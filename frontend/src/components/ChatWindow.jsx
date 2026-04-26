import React from "react";
import MessageItem from "./MessageItem";

export default function ChatWindow({ activeChat, isTyping, messagesEndRef, darkMode }) {
  const dark = darkMode;

  return (
    <div className="space-y-4 pb-6 pt-2">
      {activeChat.messages.map((message, index) => (
        <MessageItem key={message.id} message={message} darkMode={darkMode} index={index} />
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex items-end gap-2.5 justify-start">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-[10px] font-black"
            style={{ background: "linear-gradient(135deg,#7c3aed,#38bdf8)" }}
          >
            CB
          </div>
          <div
            className={`px-5 py-3.5 rounded-3xl rounded-bl-lg ${
              dark
                ? "bg-white/7 border border-white/10"
                : "bg-white border border-black/8 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-1.5">
              {[0, 0.16, 0.32].map((delay, i) => (
                <span
                  key={i}
                  className="block w-2 h-2 rounded-full"
                  style={{
                    background: dark
                      ? "linear-gradient(135deg,#a78bfa,#38bdf8)"
                      : "linear-gradient(135deg,#7c3aed,#6d28d9)",
                    animation: "cbDot 1.2s ease-in-out infinite",
                    animationDelay: `${delay}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes cbDot {
          0%, 75%, 100% { transform: translateY(0);    opacity: 0.4; }
          35%            { transform: translateY(-6px); opacity: 1;   }
        }
      `}</style>

      <div ref={messagesEndRef} />
    </div>
  );
}