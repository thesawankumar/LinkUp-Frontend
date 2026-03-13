import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function MembersPanel({ room, allUsers, onClose, onProfileClick }) {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inviting, setInviting] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!room) return;
        api.get(`/api/rooms/${room.id}/members`)
            .then((res) => setMembers(res.data))
            .catch(console.error);
    }, [room]);

    const memberIds = members.map((m) => m.id);

    const nonMembers = allUsers.filter(
        (u) => !memberIds.includes(u.id) &&
            u.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleInvite = async (user) => {
        setInviting(user.id);
        try {
            await api.post(`/api/rooms/${room.id}/invite/${user.id}`);
            setMembers((prev) => [...prev, user]);
            toast.success(`${user.name} ko add kar diya! ✅`);
        } catch (err) {
            toast.error("Invite fail ho gaya!");
        }
        setInviting(null);
    };

    return (
        <div className="w-64 flex flex-col h-full flex-shrink-0"
            style={{
                background: "var(--bg-secondary)",
                borderLeft: "1px solid var(--border)"
            }}>

            {/* Header */}
            <div className="px-4 py-4 flex items-center justify-between"
                style={{ borderBottom: "1px solid var(--border)" }}>
                <div>
                    <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                        Members
                    </h3>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {members.length} in #{room?.name}
                    </p>
                </div>
                <button onClick={onClose}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}
                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                    onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                    ×
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">

                {/* Current Members */}
                <div className="px-4 pt-4 pb-2">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                        style={{ color: "var(--text-muted)" }}>
                        Members — {members.length}
                    </p>
                    <div className="space-y-1">
                        {members.map((member) => (
                            <div key={member.id}
                                onClick={() => onProfileClick(member)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                                style={{ background: "rgba(255,255,255,0.03)" }}>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center
                                text-xs font-bold text-white flex-shrink-0"
                                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                                    {member.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate"
                                        style={{ color: "var(--text-primary)" }}>
                                        {member.name}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <div className={`w-1.5 h-1.5 rounded-full 
                                    ${member.online ? "bg-green-400" : "bg-gray-500"}`} />
                                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                            {member.online ? "Online" : "Offline"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Invite Section */}
                <div className="px-4 pt-2 pb-4">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-3"
                        style={{ color: "var(--text-muted)" }}>
                        Invite People
                    </p>

                    {/* Search */}
                    <input
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs outline-none mb-2 transition-all"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid var(--border)",
                            color: "var(--text-primary)",
                        }}
                        onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                        onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                    />

                    <div className="space-y-1">
                        {nonMembers.length === 0 ? (
                            <p className="text-xs text-center py-3" style={{ color: "var(--text-muted)" }}>
                                {search ? "No users found" : "Sab already members hain! 🎉"}
                            </p>
                        ) : (
                            nonMembers.map((user) => (
                                <div key={user.id}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
                                    style={{ background: "rgba(255,255,255,0.02)" }}>
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center
                                  text-xs font-bold text-white flex-shrink-0"
                                        style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}>
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <p className="text-xs font-medium flex-1 truncate"
                                        style={{ color: "var(--text-secondary)" }}>
                                        {user.name}
                                    </p>
                                    <button
                                        onClick={() => handleInvite(user)}
                                        disabled={inviting === user.id}
                                        className="px-2 py-1 rounded-lg text-xs font-medium transition-all flex-shrink-0"
                                        style={{
                                            background: "rgba(99,102,241,0.15)",
                                            color: "var(--accent-light)",
                                            border: "1px solid rgba(99,102,241,0.2)"
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = "rgba(99,102,241,0.3)"}
                                        onMouseOut={(e) => e.currentTarget.style.background = "rgba(99,102,241,0.15)"}>
                                        {inviting === user.id ? "..." : "+ Add"}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}