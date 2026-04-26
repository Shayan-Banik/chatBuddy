import { useState, useRef, useEffect } from "react";
import MobileHeader from "../components/MobileHeader";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import { MessageSquare, Plus, Sparkles, Zap, Search, BookOpen } from "lucide-react";
import axios from "axios";
import { io as ioClient } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BaseUrl } from "../config";

const suggestions = [
  { icon: <Sparkles size={16} />, label: "Brainstorm ideas" },
  { icon: <Zap size={16} />, label: "Write some code" },
  { icon: <Search size={16} />, label: "Deep Research" },
  { icon: <BookOpen size={16} />, label: "Summarize text" },
];


const ChatPage = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const safeGetLocal = (k) => {
    try { return localStorage.getItem(k); } catch { return null; }
  };
  
  const safeSetLocal = (k, v) => {
    try { localStorage.setItem(k, v); } catch { /* ignore */ }
  };

  const [activeChatId, setActiveChatId] = useState(() => {
    const val = safeGetLocal("activeChatId");
    return val ? val : null;
  });
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [newChatName, setNewChatName] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const userMenuRef = useRef(null);
  const socketRef = useRef(null);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [activeChat]);

  useEffect(() => {
    if (activeChatId !== null && activeChatId !== undefined)
      safeSetLocal("activeChatId", String(activeChatId));
  }, [activeChatId]);

  useEffect(() => {
    const init = async () => {
      try {
        const resUser = await axios.get(`${BaseUrl}/api/auth/me`, { withCredentials: true });
        if (resUser.data && resUser.data.user) {
          const u = resUser.data.user;
          setUser({
            name: u.fullName?.firstName
              ? `${u.fullName.firstName} ${u.fullName.lastName || ""}`.trim()
              : u.email,
            email: u.email,
          });
          try {
            const res = await axios.get(`${BaseUrl}/api/chat`, { withCredentials: true });
            const serverChats = res.data.chats.reverse() || [];
            const normalized = serverChats.map((c) => ({
              id: c._id, _id: c._id, name: c.title,
              messages: (c.messages || []).map((m, idx) => ({
                id: idx + 1,
                text: m.text ?? m.content ?? "",
                isBot: typeof m.isBot === "boolean" ? m.isBot : m.role === "model",
                timestamp: m.timestamp ?? m.createdAt ?? null,
              })),
            }));
            setChats(normalized);
            const stored = safeGetLocal("activeChatId");
            if (stored) {
              const found = normalized.find((c) => String(c.id) === String(stored));
              if (found) setActiveChatId(String(stored));
            }
          } catch (e) { console.error("Failed to fetch chats", e); }

          try {
            const socket = ioClient(BaseUrl, { withCredentials: true });
            socketRef.current = socket;
            socket.on("connect", () => console.log("socket connected", socket.id));
            socket.on("connect_error", (err) => console.error("Socket connect error", err.message || err));
            socket.on("ai-response", (payload) => {
              const botMessage = { id: String(Date.now()), text: payload.content, isBot: true, timestamp: payload.timestamp || new Date().toISOString() };
              setChats((prev) => prev.map((chat) => String(chat.id) === String(payload.chat) ? { ...chat, messages: [...chat.messages, botMessage] } : chat));
              setIsTyping(false);
            });
          } catch (err) { console.error("Socket init failed", err); }
        } else {
          const seen = safeGetLocal("seenRegisterModal");
          if (!seen) { setTimeout(() => { setShowRegisterModal(true); safeSetLocal("seenRegisterModal", "1"); }, 2500); }
        }
      } catch (err) {
        const seen = safeGetLocal("seenRegisterModal");
        if (!seen) { setTimeout(() => { setShowRegisterModal(true); safeSetLocal("seenRegisterModal", "1"); }, 2500); }
        console.error("Auth check failed", err);
      }
    };
    init();
  }, []);

  useEffect(() => {
    try {
      const socket = ioClient(BaseUrl, { withCredentials: true });
      socketRef.current = socket;
      socket.on("connect", () => console.log("socket connected", socket.id));
      socket.on("connect_error", (err) => console.error("Socket connect error", err.message || err));
      socket.on("ai-response", (payload) => {
        const botMessage = { id: String(Date.now()), text: payload.content, isBot: true, timestamp: payload.timestamp || new Date().toISOString() };
        setChats((prev) => prev.map((chat) => String(chat.id) === String(payload.chat) ? { ...chat, messages: [...chat.messages, botMessage] } : chat));
        setIsTyping(false);
      });
      return () => { if (socket) { socket.off("ai-response"); socket.off("connect_error"); socket.off("connect"); socket.disconnect(); } };
    } catch (err) { console.error("Failed to initialize socket", err); }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNewChat = async (titleParam) => {
    if (!user || !user.email) { setShowRegisterModal(true); return null; }
    let title = null;
    if (typeof titleParam === "string" && titleParam.trim()) { title = titleParam.trim(); }
    else { title = window.prompt("Enter a title for this chat", "New Chat"); }
    if (!title) return null;

    const newChatId = String(Date.now());
    const newChat = { id: newChatId, name: title, messages: [] };

    try {
      const res = await axios.post(`${BaseUrl}/api/chat`, { title, messages: newChat.messages }, { withCredentials: true });
      const saved = res.data.chat;
      const savedNormalized = {
        id: saved._id, _id: saved._id, name: saved.title,
        messages: (saved.messages || []).map((m, idx) => ({ id: String(idx + 1), text: m.text, isBot: m.isBot, timestamp: m.timestamp })),
      };
      setChats((prev) => [savedNormalized, ...prev]);
      setActiveChatId(savedNormalized.id);
      safeSetLocal("activeChatId", String(savedNormalized.id));
      setSidebarOpen(false);
      return savedNormalized.id;
    } catch (err) {
      console.error("Error creating chat", err);
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChatId);
      setSidebarOpen(false);
      return newChatId;
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) { if (!activeChatId) { handleNewChat(); return; } return; }
    if (!user || !user.email) { setShowRegisterModal(true); return; }
    let ensuredChatId = activeChatId;
    const ensureChat = async () => {
      if (!ensuredChatId) {
        const title = inputMessage.length > 30 ? inputMessage.substring(0, 30) + "..." : inputMessage;
        ensuredChatId = await handleNewChat(title);
      }
    };
    const maybeSend = async () => {
      await ensureChat();
      const newMessage = { id: String(Date.now()), text: inputMessage, isBot: false, timestamp: new Date() };
      setChats((prev) => prev.map((chat) => chat.id === ensuredChatId ? { ...chat, messages: [...chat.messages, newMessage] } : chat));
      setInputMessage("");
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("user-message", { content: newMessage.text, chat: ensuredChatId });
        setIsTyping(true);
      }
    };
    maybeSend();
  };

  const handleDeleteChat = async (chatId) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (activeChatId === chatId) {
      const remaining = chats.filter((chat) => chat.id !== chatId);
      setActiveChatId(remaining.length ? remaining[0].id : null);
    }
    if (!user || !user.email) return;
    try {
      await axios.delete(`${BaseUrl}/api/chat/${chatId}`, { withCredentials: true });
      const res = await axios.get(`${BaseUrl}/api/chat`, { withCredentials: true });
      const normalized = (res.data.chats || []).map((c) => ({
        id: c._id, _id: c._id, name: c.title,
        messages: (c.messages || []).map((m, idx) => ({ id: idx + 1, text: m.text ?? m.content ?? "", isBot: typeof m.isBot === "boolean" ? m.isBot : m.role === "model", timestamp: m.timestamp ?? m.createdAt ?? null })),
      }));
      setChats(normalized);
    } catch (err) { console.error("Failed to delete chat on server", err); }
  };

  const handleEditChat = (chat) => { setEditingChatId(chat.id); setNewChatName(chat.name); };
  const handleSaveChatName = () => {
    if (newChatName.trim()) {
      setChats((prev) => prev.map((chat) => chat.id === editingChatId ? { ...chat, name: newChatName.trim() } : chat));
    }
    setEditingChatId(null);
    setNewChatName("");
  };

  const handleLogout = async () => {
    try { await axios.post(`${BaseUrl}/api/auth/logout`, {}, { withCredentials: true }); } catch (err) { console.error("Failed to logout", err); }
    safeSetLocal("activeChatId", "");
    toast.info("Logged out successfully");
    navigate("/login", { replace: true });
  };

  // ── Theme tokens ──────────────────────────────────────────────
  const dark = darkMode;
  const bg = dark ? "bg-[#0d0d0d]" : "bg-[#f5f3ef]";
  const text = dark ? "text-white" : "text-[#1a1a1a]";
  const subText = dark ? "text-white/45" : "text-black/45";
  const accent = dark ? "text-[#a78bfa]" : "text-[#7c3aed]";
  const accentBg = dark ? "bg-[#7c3aed] hover:bg-[#6d28d9] text-white" : "bg-[#7c3aed] hover:bg-[#6d28d9] text-white";
  const pillBg = dark ? "bg-white/6 border border-white/12 hover:bg-white/10 text-white/75" : "bg-black/5 border border-black/10 hover:bg-black/8 text-black/70";

  return (
    <div className={`flex h-screen ${bg} ${text} transition-colors duration-300`} style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

      {/* Ambient glow — same as homepage */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[320px] rounded-full blur-[110px] opacity-20 transition-colors duration-300 ${dark ? "bg-[#7c3aed]" : "bg-[#c4b5fd]"}`} />
        <div className={`absolute bottom-0 right-0 w-[350px] h-[250px] rounded-full blur-[90px] opacity-10 transition-colors duration-300 ${dark ? "bg-[#06b6d4]" : "bg-[#bae6fd]"}`} />
      </div>

      <MobileHeader onOpenSidebar={() => setSidebarOpen(true)} activeTitle={activeChat?.name} />

      {/* ── Sidebar ────────────────────────────────────────── */}
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        editingChatId={editingChatId}
        newChatName={newChatName}
        onNewChat={handleNewChat}
        onSelectChat={(id) => { setActiveChatId(id); setSidebarOpen(false); }}
        onEditChat={(chat) => handleEditChat(chat)}
        onDeleteChat={handleDeleteChat}
        onChangeNewChatName={(val) => setNewChatName(val)}
        onSaveChatName={handleSaveChatName}
        user={user}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        darkMode={darkMode}
        sidebarOpen={sidebarOpen}
        setDarkMode={setDarkMode}
        onLogout={handleLogout}
        setSidebarOpen={setSidebarOpen}
      />

      {/* ── Main area ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 pt-20 lg:pt-4">
          <div className="max-w-3xl mx-auto h-full">
            {!activeChat ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center w-full max-w-lg px-4">

                  {user ? (
                    /* ── Authenticated empty state ── */
                    <>
                      {/* Avatar */}
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-black"
                        style={{ background: "linear-gradient(135deg,#7c3aed,#38bdf8)" }}>
                        {user.name?.charAt(0).toUpperCase() ?? "C"}
                      </div>

                      <h2 className="text-3xl font-black mb-2" style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}>
                        Hey, <span className={accent}>{user.name?.split(" ")[0]}</span> 👋
                      </h2>
                      <p className={`text-sm mb-8 ${subText}`}>
                        {user.email} · Ready to chat
                      </p>

                      {/* Suggestion pills */}
                      <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {suggestions.map((s) => (
                          <button key={s.label}
                            onClick={() => handleNewChat(s.label)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all ${pillBg}`}>
                            {s.icon}{s.label}
                          </button>
                        ))}
                      </div>

                      {/* New chat CTA */}
                      <button
                        onClick={() => handleNewChat()}
                        className={`inline-flex items-center gap-2.5 px-7 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg ${accentBg}`}
                        style={{ boxShadow: "0 8px 28px rgba(124,58,237,0.35)" }}>
                        <Plus size={18} /> New Chat
                      </button>
                    </>
                  ) : (
                    /* ── Guest empty state ── */
                    <>
                      {/* Logo mark */}
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                        style={{ background: "linear-gradient(135deg,#7c3aed,#38bdf8)" }}>
                        <MessageSquare size={30} className="text-white" />
                      </div>

                      <h2 className="text-3xl font-black mb-3" style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}>
                        Welcome to <span className={accent}>ChatBuddy</span>
                      </h2>
                      <p className={`text-sm mb-8 leading-relaxed ${subText}`}>
                        Sign in to save your chats, sync across devices, and unlock all features.
                      </p>

                      {/* Feature pills */}
                      <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {suggestions.map((s) => (
                          <span key={s.label} className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium ${pillBg}`}>
                            {s.icon}{s.label}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => navigate("/register")}
                          className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg ${accentBg}`}
                          style={{ boxShadow: "0 8px 28px rgba(124,58,237,0.35)" }}>
                          Sign up free
                        </button>
                        <button onClick={() => navigate("/login")}
                          className={`px-6 py-3 rounded-2xl font-semibold text-sm border transition-all ${dark ? "border-white/20 hover:bg-white/8" : "border-black/15 hover:bg-black/5"}`}>
                          Log in →
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <ChatWindow
                activeChat={activeChat}
                isTyping={isTyping}
                messagesEndRef={messagesEndRef}
                darkMode={darkMode}
              />
            )}
          </div>
        </div>

        {/* Message input */}
        <MessageInput
          inputRef={inputRef}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSend={handleSendMessage}
          activeChatId={activeChatId}
          darkMode={darkMode}
        />
      </div>

      {/* ── Register nudge modal ──────────────────────────── */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}>
          <div className={`w-full max-w-sm rounded-3xl p-7 border shadow-2xl ${dark ? "bg-[#141414] border-white/10" : "bg-white border-black/8"}`}>
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: "linear-gradient(135deg,#7c3aed,#38bdf8)" }}>
              <MessageSquare size={24} className="text-white" />
            </div>

            <h3 className="text-xl font-black mb-1.5" style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}>
              Join <span className={accent}>ChatBuddy</span>
            </h3>
            <p className={`text-sm mb-6 leading-relaxed ${subText}`}>
              Create a free account to save your chats and access all features across devices.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowRegisterModal(false); navigate("/register"); }}
                className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${accentBg}`}
                style={{ boxShadow: "0 6px 20px rgba(124,58,237,0.3)" }}>
                Sign up free
              </button>
              <button
                onClick={() => setShowRegisterModal(false)}
                className={`flex-1 py-3 rounded-2xl font-semibold text-sm border transition-all ${dark ? "border-white/15 hover:bg-white/6" : "border-black/12 hover:bg-black/4"}`}>
                Maybe later
              </button>
            </div>

            <p className={`text-xs text-center mt-4 ${subText}`}>
              Already have an account?{" "}
              <button onClick={() => { setShowRegisterModal(false); navigate("/login"); }}
                className={`font-semibold underline underline-offset-2 ${accent}`}>
                Log in
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default ChatPage;