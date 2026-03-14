import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ChatWindow({ messages, typingUser, room,
    currentUser, onToggleMembers, showMembers, onProfileClick, onEditMessage, onDeleteMessage }) {
    const { user } = useAuth();
    const bottomRef = useRef(null);
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    // State — kaun sa message edit mode mein hai
    // ChatWindow ke andar add karo
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typingUser]);

    if (!room) {
        return (
            <div className="flex-1 flex items-center justify-center"
                style={{ background: "var(--bg-primary)" }}>
                <div className="text-center animate-fade-up">
                    <div className="text-6xl mb-4">💬</div>
                    <h2 className="text-xl font-semibold mb-2"
                        style={{ color: "var(--text-primary)" }}>
                        Welcome to LinkUp
                    </h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                        Select a channel to start chatting
                    </p>
                </div>
            </div>
        );
    }

    // DM mein doosre ka naam nikalo
    const otherPersonName = room?.roomType === "DIRECT"
        ? room.name
            ?.replace(currentUser?.name + " & ", "")
            .replace(" & " + currentUser?.name, "")
            .trim()
        : null;

    return (
        <div className="flex-1 flex flex-col overflow-hidden"
            style={{ background: "var(--bg-primary)" }}>

            {/* ── Header ── */}
            <div className="px-3 md:px-6 py-3 md:py-4 hidden md:flex items-center gap-4 flex-shrink-0"
                style={{
                    background: "var(--bg-secondary)",
                    borderBottom: "1px solid var(--border)"
                }}>

                {room?.roomType === "DIRECT" ? (
                    // DM Header
                    <div className="flex items-center gap-3 flex-1">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center
                                            font-bold text-white text-base"
                                style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}>
                                {otherPersonName?.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full
                                            bg-green-400 border-2"
                                style={{ borderColor: "var(--bg-secondary)" }} />
                        </div>
                        <div>
                            <h2 className="font-semibold"
                                style={{ color: "var(--text-primary)" }}>
                                {otherPersonName}
                            </h2>
                            <p className="text-xs flex items-center gap-1"
                                style={{ color: "#4ade80" }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                                Online
                            </p>
                        </div>
                    </div>
                ) : (
                    // Group Header
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center
                                        font-bold text-white"
                            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                            #
                        </div>
                        <div>
                            <h2 className="font-semibold"
                                style={{ color: "var(--text-primary)" }}>
                                {room.name}
                            </h2>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                {room.members?.length || 0} members
                                {room.description && ` • ${room.description}`}
                            </p>
                        </div>
                    </div>
                )}

                {/* Right Side */}
                <div className="flex items-center gap-2">

                    {/* Members Button — sirf GROUP pe */}
                    {room?.roomType === "GROUP" && (
                        <button
                            onClick={onToggleMembers}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl
                                       transition-all text-xs font-medium"
                            style={showMembers ? {
                                background: "rgba(99,102,241,0.2)",
                                color: "var(--accent-light)",
                                border: "1px solid rgba(99,102,241,0.3)"
                            } : {
                                background: "rgba(255,255,255,0.05)",
                                color: "var(--text-muted)",
                                border: "1px solid var(--border)"
                            }}
                            onMouseOver={(e) => !showMembers &&
                                (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                            onMouseOut={(e) => !showMembers &&
                                (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}>
                            👥 {room?.members?.length || 0}
                        </button>
                    )}

                    {/* Live Indicator */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full"
                        style={{
                            background: "rgba(34,197,94,0.1)",
                            border: "1px solid rgba(34,197,94,0.2)"
                        }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        <span className="text-xs font-medium"
                            style={{ color: "#4ade80" }}>Live</span>
                    </div>
                </div>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-1">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3"
                        style={{ color: "var(--text-muted)" }}>
                        <div className="text-5xl">
                            {room?.roomType === "DIRECT" ? "👋" : "💬"}
                        </div>
                        <p className="text-sm">
                            {room?.roomType === "DIRECT"
                                ? `${otherPersonName} ko pehla message bhejo!`
                                : "Be the first to say something!"}
                        </p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderName === user?.name;

                        const showAvatar = index === 0 ||
                            messages[index - 1]?.senderName !== msg.senderName;

                        const showTime = index === messages.length - 1 ||
                            messages[index + 1]?.senderName !== msg.senderName;

                        return (
                            <div key={index}
                                className={`flex items-end gap-3 group
                                    ${showAvatar ? "mt-4" : "mt-0.5"}
                                    ${isMe ? "flex-row-reverse" : "flex-row"}`}>

                                {/* Avatar */}
                                <div className="w-8 flex-shrink-0 self-end">
                                    {!isMe && showAvatar ? (
                                        <div
                                            onClick={() => onProfileClick && onProfileClick(msg)}
                                            className="w-8 h-8 rounded-xl flex items-center
                                                       justify-center text-xs font-bold text-white
                                                       cursor-pointer hover:scale-110 transition-transform"
                                            style={{
                                                background: "linear-gradient(135deg, #8b5cf6, #6366f1)"
                                            }}
                                            title={`${msg.senderName} ka profile`}>
                                            {msg.senderName?.charAt(0).toUpperCase()}
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8" />
                                    )}
                                </div>

                                {/* Bubble */}
                                <div className={`flex flex-col  w-full max-w-[75vw] sm:max-w-sm lg:max-w-md
                 ${isMe ? "items-end" : "items-start"}`}>

                                    {/* Sender Name */}
                                    {!isMe && showAvatar && room?.roomType === "GROUP" && (
                                        <span
                                            onClick={() => onProfileClick && onProfileClick(msg)}
                                            className="text-xs mb-1 ml-1 cursor-pointer hover:underline"
                                            style={{ color: "var(--accent-light)" }}>
                                            {msg.senderName}
                                        </span>
                                    )}

                                    {/* ── EDIT MODE ── */}
                                    {editingId === msg.id ? (
                                        <div className="flex flex-col gap-2">
                                            <input
                                                autoFocus
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && editContent.trim()) {
                                                        onEditMessage(msg.id, editContent.trim());
                                                        setEditingId(null);
                                                    }
                                                    if (e.key === "Escape") setEditingId(null);
                                                }}
                                                className="px-4 py-2.5 rounded-2xl text-sm outline-none w-72"
                                                style={{
                                                    background: "rgba(99,102,241,0.15)",
                                                    border: "2px solid var(--accent)",
                                                    color: "var(--text-primary)"
                                                }}
                                            />
                                            <div className="flex gap-2 text-xs ml-1"
                                                style={{ color: "var(--text-muted)" }}>
                                                <span>Enter = save</span>
                                                <span>•</span>
                                                <span>Esc = cancel</span>
                                            </div>
                                        </div>

                                    ) : (
                                        // ── NORMAL MESSAGE ──
                                        <div className="relative">

                                            {/* Hover Buttons — sirf apne msgs pe */}
                                            {isMe && (
                                                <div
                                                    className="absolute -top-4 -left-20
                   opacity-0 group-hover:opacity-100
                   transition-all duration-200 scale-95
                   group-hover:scale-100
                   flex items-center z-20"
                                                    style={{
                                                        filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.4))"
                                                    }}>

                                                    {/* Pill container */}
                                                    <div className="flex items-center rounded-2xl overflow-hidden"
                                                        style={{
                                                            background: "rgba(18,18,30,0.95)",
                                                            border: "1px solid rgba(255,255,255,0.08)",
                                                            backdropFilter: "blur(12px)",
                                                        }}>

                                                        {/* Edit button */}
                                                        <button
                                                            onClick={() => {
                                                                setEditingId(msg.id);
                                                                setEditContent(msg.content);
                                                            }}
                                                            className="group/btn flex items-center gap-1.5 px-3 py-2
                           transition-all duration-150 relative"
                                                            style={{ color: "rgba(255,255,255,0.45)" }}
                                                            onMouseOver={(e) => {
                                                                e.currentTarget.style.background = "rgba(99,102,241,0.15)";
                                                                e.currentTarget.style.color = "#a5b4fc";
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.currentTarget.style.background = "transparent";
                                                                e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                                                            }}>
                                                            <svg width="13" height="13" viewBox="0 0 24 24"
                                                                fill="none" stroke="currentColor"
                                                                strokeWidth="2.5" strokeLinecap="round">
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                            </svg>
                                                            <span className="text-xs font-medium">Edit</span>
                                                        </button>

                                                        {/* Divider */}
                                                        <div className="w-px h-5 self-center"
                                                            style={{ background: "rgba(255,255,255,0.06)" }} />

                                                        {/* Delete button */}
                                                        <button
                                                            onClick={() => setDeleteConfirmId(msg.id)}
                                                            className="flex items-center gap-1.5 px-3 py-2
                           transition-all duration-150"
                                                            style={{ color: "rgba(255,255,255,0.45)" }}
                                                            onMouseOver={(e) => {
                                                                e.currentTarget.style.background = "rgba(239,68,68,0.12)";
                                                                e.currentTarget.style.color = "#fca5a5";
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.currentTarget.style.background = "transparent";
                                                                e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                                                            }}>
                                                            <svg width="13" height="13" viewBox="0 0 24 24"
                                                                fill="none" stroke="currentColor"
                                                                strokeWidth="2.5" strokeLinecap="round">
                                                                <polyline points="3 6 5 6 21 6" />
                                                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                                <path d="M10 11v6M14 11v6" />
                                                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                                            </svg>
                                                            <span className="text-xs font-medium">Delete</span>
                                                        </button>
                                                    </div>

                                                    {/* Arrow pointing right */}
                                                    <div className="w-2 h-2 rotate-45 -ml-1 flex-shrink-0"
                                                        style={{
                                                            background: "rgba(18,18,30,0.95)",
                                                            borderRight: "1px solid rgba(255,255,255,0.08)",
                                                            borderTop: "1px solid rgba(255,255,255,0.08)",
                                                        }} />
                                                </div>
                                            )}
                                            {/* Message Bubble */}
                                            <div className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                                                style={isMe ? {
                                                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                                    color: "#fff",
                                                    borderBottomRightRadius: showTime ? "4px" : "18px",
                                                    boxShadow: "0 4px 15px rgba(99,102,241,0.3)"
                                                } : {
                                                    background: "rgba(255,255,255,0.05)",
                                                    color: "var(--text-primary)",
                                                    border: "1px solid var(--border)",
                                                    borderBottomLeftRadius: showTime ? "4px" : "18px"
                                                }}>
                                                {msg.content && <span>{msg.content}</span>}
                                                {msg.edited && (
                                                    <span className="text-xs ml-2 opacity-60">
                                                        (edited)
                                                    </span>
                                                )}
                                                {msg.fileUrl && (
                                                    <div className="mb-2">
                                                        {msg.fileType === "image" ? (
                                                            <img
                                                                src={`${BASE_URL}${msg.fileUrl}`}
                                                                alt={msg.fileName}
                                                                className="max-w-xs rounded-2xl cursor-pointer"
                                                                style={{
                                                                    maxHeight: "300px", objectFit: "cover", maxWidth: "min(280px, 60vw)", width: "100%",
                                                                    display: "block",  // ← mobile pe 60vw max
                                                                    maxHeight: "200px",
                                                                }}
                                                                onClick={() => window.open(
                                                                    `${BASE_URL}${msg.fileUrl}`, "_blank"
                                                                )}
                                                            />
                                                        ) : msg.fileType === "video" ? (
                                                            <video
                                                                src={`${BASE_URL}${msg.fileUrl}`}
                                                                controls
                                                                className="max-w-xs rounded-2xl"
                                                                style={{
                                                                    maxHeight: "300px", maxWidth: "min(280px, 60vw)", width: "100%",
                                                                    display: "block"
                                                                }}
                                                            />
                                                        ) : (
                                                            <a
                                                                href={`${BASE_URL}${msg.fileUrl}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
                                                                style={{
                                                                    background: "rgba(255,255,255,0.1)",
                                                                    color: "var(--text-primary)"
                                                                }}>
                                                                📎 {msg.fileName}
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Time */}
                                    {showTime && editingId !== msg.id && (
                                        <span className="text-xs mt-1 mx-1"
                                            style={{ color: "var(--text-muted)" }}>
                                            {msg.sentAt
                                                ? new Date(msg.sentAt).toLocaleTimeString("en-IN", {
                                                    hour: "2-digit", minute: "2-digit"
                                                })
                                                : "now"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                {/* Delete Confirm Modal */}
                {deleteConfirmId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
                        onClick={(e) => e.target === e.currentTarget && setDeleteConfirmId(null)}>

                        <div className="w-full max-w-xs rounded-3xl p-6 animate-fade-up"
                            style={{
                                background: "#0f0f1a",
                                border: "1px solid rgba(239,68,68,0.25)",
                                boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 30px rgba(239,68,68,0.08)"
                            }}>

                            {/* Icon */}
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center
                            text-2xl mx-auto mb-4"
                                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                                🗑️
                            </div>

                            <h3 className="text-center font-bold text-lg mb-2"
                                style={{ color: "var(--text-primary)" }}>
                                Delete Message?
                            </h3>
                            <p className="text-center text-sm mb-6"
                                style={{ color: "var(--text-muted)" }}>
                                Yeh message permanently delete ho jayega. Wapas nahi aayega!
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="flex-1 py-2.5 rounded-2xl text-sm font-medium transition-all"
                                    style={{
                                        background: "rgba(255,255,255,0.04)",
                                        border: "1px solid var(--border)",
                                        color: "var(--text-muted)"
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                                    onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}>
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        onDeleteMessage(deleteConfirmId);
                                        setDeleteConfirmId(null);
                                    }}
                                    className="flex-1 py-2.5 rounded-2xl text-sm font-semibold
                               text-white transition-all"
                                    style={{
                                        background: "linear-gradient(135deg, #ef4444, #dc2626)",
                                        boxShadow: "0 4px 15px rgba(239,68,68,0.35)"
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.opacity = "0.88"}
                                    onMouseOut={(e) => e.currentTarget.style.opacity = "1"}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* Typing Indicator */}
                {typingUser && (
                    <div className="flex items-end gap-3 msg-animate mt-4">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center
                                        text-xs font-bold text-white flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}>
                            {typingUser?.charAt(0).toUpperCase()}
                        </div>
                        <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1"
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid var(--border)"
                            }}>
                            <span className="text-xs mr-2" style={{ color: "var(--text-muted)" }}>
                                {typingUser}
                            </span>
                            {[0, 150, 300].map((delay) => (
                                <div key={delay} className="w-1.5 h-1.5 rounded-full"
                                    style={{
                                        background: "var(--accent-light)",
                                        animation: "bounce-dot 1.2s ease-in-out infinite",
                                        animationDelay: `${delay}ms`
                                    }} />
                            ))}
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>
        </div >
    );
}