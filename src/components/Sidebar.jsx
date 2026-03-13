import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Sidebar({
    groupRooms, directRooms, allUsers,
    selectedRoom, onSelectRoom, onOpenDM,
    onCreateRoom, currentUser
}) {
    const { logout } = useAuth();
    const [showUsers, setShowUsers] = useState(false);
    const [searchUser, setSearchUser] = useState("");

    const handleLogout = () => {
        logout();
        toast.success("Logged out! See you soon 👋");
    };

    const filtered = allUsers.filter((u) =>
        u.name.toLowerCase().includes(searchUser.toLowerCase())
    );

    return (

        <div className="w-72 md:w-64 lg:w-72 flex flex-col h-screen flex-shrink-0"
            style={{ background: "var(--bg-secondary)", borderRight: "1px solid var(--border)" }}>

            {/* Logo */}
            <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                        <span className="text-lg">🔗</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight" style={{ color: "var(--text-primary)" }}>
                            LinkUp
                        </h1>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Real-time Chat</p>
                    </div>
                </div>
            </div>

            {/* User Profile */}
            <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="flex items-center gap-3 p-3 rounded-2xl"
                    style={{ background: "var(--bg-card)" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                        {currentUser?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>
                            {currentUser?.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Online</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">

                {/* ── CHANNELS ── */}
                <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-widest"
                        style={{ color: "var(--text-muted)" }}>Channels</span>
                    <button onClick={onCreateRoom}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-lg transition-all"
                        style={{ background: "rgba(99,102,241,0.15)", color: "var(--accent-light)" }}
                        onMouseOver={(e) => e.currentTarget.style.background = "rgba(99,102,241,0.3)"}
                        onMouseOut={(e) => e.currentTarget.style.background = "rgba(99,102,241,0.15)"}>
                        +
                    </button>
                </div>

                <div className="px-3 space-y-0.5 mb-2">
                    {groupRooms.map((room) => (
                        <RoomButton key={room.id} room={room} selected={selectedRoom?.id === room.id}
                            onClick={() => onSelectRoom(room)} icon="#" />
                    ))}
                    {groupRooms.length === 0 && (
                        <p className="text-xs text-center py-3 px-2" style={{ color: "var(--text-muted)" }}>
                            No channels yet
                        </p>
                    )}
                </div>

                {/* ── DIRECT MESSAGES ── */}
                <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-widest"
                        style={{ color: "var(--text-muted)" }}>Direct Messages</span>
                    <button onClick={() => setShowUsers(!showUsers)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-lg transition-all"
                        style={{ background: "rgba(99,102,241,0.15)", color: "var(--accent-light)" }}
                        onMouseOver={(e) => e.currentTarget.style.background = "rgba(99,102,241,0.3)"}
                        onMouseOut={(e) => e.currentTarget.style.background = "rgba(99,102,241,0.15)"}>
                        +
                    </button>
                </div>

                {/* User Search Panel */}
                {showUsers && (
                    <div className="mx-3 mb-3 rounded-2xl overflow-hidden animate-fade-in"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
                        <div className="p-2">
                            <input
                                placeholder="Search users..."
                                value={searchUser}
                                onChange={(e) => setSearchUser(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl text-xs outline-none"
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid var(--border)",
                                    color: "var(--text-primary)",
                                }}
                            />
                        </div>
                        <div className="max-h-40 overflow-y-auto">
                            {filtered.map((u) => (
                                <button key={u.id}
                                    onClick={() => { onOpenDM(u); setShowUsers(false); setSearchUser(""); }}
                                    className="w-full flex items-center gap-2 px-3 py-2 transition-all text-left"
                                    style={{ color: "var(--text-secondary)" }}
                                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                                    onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                        style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                                        {u.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium truncate">{u.name}</p>
                                        <div className="flex items-center gap-1">
                                            <div className={`w-1.5 h-1.5 rounded-full ${u.online ? "bg-green-400" : "bg-gray-500"}`} />
                                            <span className="text-xs" style={{ color: "var(--text-muted)", fontSize: "10px" }}>
                                                {u.online ? "Online" : "Offline"}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                            {filtered.length === 0 && (
                                <p className="text-xs text-center py-3" style={{ color: "var(--text-muted)" }}>
                                    No users found
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Existing DMs */}
                <div className="px-3 space-y-0.5 mb-4">
                    {directRooms.map((room) => {
                        const otherName = room.name?.replace(currentUser?.name + " & ", "")
                            .replace(" & " + currentUser?.name, "");
                        return (
                            <RoomButton key={room.id} room={room}
                                selected={selectedRoom?.id === room.id}
                                onClick={() => onSelectRoom(room)}
                                icon={otherName?.charAt(0).toUpperCase()}
                                isDM={true}
                                label={otherName}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Sign Out */}
            <div className="p-4" style={{ borderTop: "1px solid var(--border)" }}>
                <button onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
                    style={{
                        background: "rgba(239,68,68,0.08)",
                        color: "#ef4444",
                        border: "1px solid rgba(239,68,68,0.15)"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
                    onMouseOut={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}>
                    🚪 Sign Out
                </button>
            </div>
        </div>
    );
}

// Room Button Component
function RoomButton({ room, selected, onClick, icon, isDM, label }) {
    return (
        <button onClick={onClick}
            className="w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3"
            style={selected ? {
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)"
            } : {
                background: "transparent",
                border: "1px solid transparent"
            }}
            onMouseOver={(e) => { if (!selected) e.currentTarget.style.background = "var(--bg-hover)" }}
            onMouseOut={(e) => { if (!selected) e.currentTarget.style.background = "transparent" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={selected ? {
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff"
                } : {
                    background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)"
                }}>
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate"
                    style={{ color: selected ? "var(--accent-light)" : "var(--text-secondary)" }}>
                    {label || room.name}
                </p>
                {!isDM && (
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                        {room.members?.length || 0} members
                    </p>
                )}
            </div>
        </button>
    );
}