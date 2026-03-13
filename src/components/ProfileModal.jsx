import { useEffect } from "react";

export default function ProfileModal({ user, onClose, onOpenDM }) {
    useEffect(() => {
        const handleEsc = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    if (!user) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center
                       justify-center"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="w-full sm:w-auto sm:min-w-[380px] sm:max-w-sm
                           rounded-t-[3rem] sm:rounded-3xl overflow-hidden animate-fade-up"
                style={{
                    background: "linear-gradient(180deg, #13131f 0%, #0f0f1a 100%)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    borderBottom: "none",
                    boxShadow: "0 -8px 40px rgba(0,0,0,0.4), 0 0 60px rgba(99,102,241,0.08)",
                }}
            >
                {/* Drag Handle */}
                <div className="flex justify-center pt-3 sm:hidden">
                    <div className="w-12 h-1.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.12)" }} />
                </div>

                {/* Banner */}
                <div className="h-28 sm:h-28 relative mt-1 sm:mt-0"
                    style={{
                        background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a78bfa 100%)"
                    }}>

                    {/* Sheen effect */}
                    <div className="absolute inset-0"
                        style={{
                            background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)"
                        }} />

                    {/* Close */}
                    <button onClick={onClose}
                        className="absolute top-3 right-3 w-8 h-8 rounded-xl
                                   flex items-center justify-center transition-all
                                   text-white font-bold text-lg z-10"
                        style={{ background: "rgba(0,0,0,0.25)" }}
                        onMouseOver={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.45)"}
                        onMouseOut={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.25)"}>
                        ×
                    </button>

                    {/* Avatar */}
                    <div className="absolute -bottom-9 left-5">
                        <div className="w-[72px] h-[72px] rounded-2xl flex items-center
                                        justify-center text-2xl font-black text-white"
                            style={{
                                background: "linear-gradient(135deg, #4338ca, #6d28d9)",
                                border: "3.5px solid #0f0f1a",
                                boxShadow: "0 8px 32px rgba(99,102,241,0.5)"
                            }}>
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-5 pt-12 pb-6">

                    {/* Name row */}
                    <div className="flex items-center justify-between mb-1">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight"
                                style={{ color: "var(--text-primary)" }}>
                                {user.name}
                            </h2>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className={`w-2 h-2 rounded-full
                                    ${user.online ? "bg-green-400" : "bg-gray-500"}`} />
                                <span className="text-xs font-medium"
                                    style={{
                                        color: user.online ? "#4ade80" : "var(--text-muted)"
                                    }}>
                                    {user.online ? "Online" : "Offline"}
                                </span>
                            </div>
                        </div>

                        {onOpenDM && (
                            <button
                                onClick={() => { onOpenDM(user); onClose(); }}
                                className="flex items-center gap-2 px-4 py-2.5
                                           rounded-xl text-sm font-semibold
                                           text-white transition-all"
                                style={{
                                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                    boxShadow: "0 4px 20px rgba(99,102,241,0.45)"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.opacity = "0.88"}
                                onMouseOut={(e) => e.currentTarget.style.opacity = "1"}>
                                💬 Message
                            </button>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="my-4"
                        style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

                    {/* Info Cards */}
                    <div className="space-y-2.5">

                        {[
                            {
                                icon: "📧",
                                label: "Email",
                                value: user.email,
                                truncate: true
                            },
                            {
                                icon: user.provider === "GOOGLE" ? "🔵"
                                    : user.provider === "OTP" ? "📱" : "🔐",
                                label: "Login Method",
                                value: user.provider === "GOOGLE" ? "Google Account"
                                    : user.provider === "OTP" ? "Email OTP" : "Password"
                            },
                            {
                                icon: "📅",
                                label: "Joined",
                                value: user.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric", month: "long", year: "numeric"
                                    })
                                    : "N/A"
                            },
                            ...(!user.online && user.lastSeen ? [{
                                icon: "🕐",
                                label: "Last Seen",
                                value: new Date(user.lastSeen).toLocaleString("en-IN", {
                                    day: "numeric", month: "short",
                                    hour: "2-digit", minute: "2-digit"
                                })
                            }] : [])
                        ].map((item) => (
                            <div key={item.label}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.06)"
                                }}>
                                <div className="w-8 h-8 rounded-xl flex items-center
                                                justify-center text-base flex-shrink-0"
                                    style={{ background: "rgba(255,255,255,0.05)" }}>
                                    {item.icon}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                                        style={{ color: "var(--text-muted)" }}>
                                        {item.label}
                                    </p>
                                    <p className={`text-sm font-medium
                                                   ${item.truncate ? "truncate" : ""}`}
                                        style={{ color: "var(--text-primary)" }}>
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
