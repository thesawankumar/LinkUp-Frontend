import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function CreateRoomModal({ isOpen, onClose, onCreate }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleEsc = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error("Room ka naam dena zaroori hai!");
            return;
        }
        setLoading(true);
        await onCreate(name.trim(), description.trim());
        setName("");
        setDescription("");
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center
                       p-0 sm:p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Modal — bottom sheet on mobile, centered on sm+ */}
            <div
                className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-fade-up"
                style={{
                    background: "#0f0f1a",
                    border: "1px solid rgba(99,102,241,0.3)",
                    borderBottom: "none",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.1)",
                }}
            >
                {/* Drag Handle — mobile only */}
                <div className="sm:hidden flex justify-center mb-4">
                    <div className="w-10 h-1 rounded-full"
                        style={{ background: "rgba(255,255,255,0.15)" }} />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                            #
                        </div>
                        <div>
                            <h2 className="font-bold text-lg"
                                style={{ color: "var(--text-primary)" }}>
                                Create Channel
                            </h2>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                Naya room banao apni team ke liye
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 rounded-xl flex items-center justify-center
                                   transition-all text-lg"
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            color: "var(--text-muted)"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                        onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                        ×
                    </button>
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider mb-2 block"
                            style={{ color: "var(--text-muted)" }}>
                            Channel Name *
                        </label>
                        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl transition-all"
                            style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid var(--border)",
                            }}
                            onFocusCapture={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                            onBlurCapture={(e) => e.currentTarget.style.borderColor = "var(--border)"}>
                            <span style={{ color: "var(--accent-light)", fontWeight: "bold" }}>#</span>
                            <input
                                autoFocus
                                type="text"
                                placeholder="general, announcements, random..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                className="flex-1 bg-transparent outline-none text-sm"
                                style={{
                                    color: "var(--text-primary)",
                                    fontFamily: "Outfit, sans-serif"
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider mb-2 block"
                            style={{ color: "var(--text-muted)" }}>
                            Description
                            <span className="ml-1 normal-case" style={{ opacity: 0.5 }}>
                                (optional)
                            </span>
                        </label>
                        <textarea
                            placeholder="Is channel ka purpose kya hai?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-2xl text-sm outline-none
                                       transition-all resize-none"
                            style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid var(--border)",
                                color: "var(--text-primary)",
                                fontFamily: "Outfit, sans-serif",
                            }}
                            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                        />
                    </div>
                </div>

                {/* Preview */}
                {name.trim() && (
                    <div className="mt-4 px-4 py-3 rounded-2xl flex items-center gap-3 animate-fade-in"
                        style={{
                            background: "rgba(99,102,241,0.08)",
                            border: "1px solid rgba(99,102,241,0.2)"
                        }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center
                                        font-bold text-white text-sm flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                            {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate"
                                style={{ color: "var(--accent-light)" }}>
                                #{name.toLowerCase().replace(/\s+/g, "-")}
                            </p>
                            {description && (
                                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose}
                        className="flex-1 py-3 rounded-2xl text-sm font-medium transition-all"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid var(--border)",
                            color: "var(--text-muted)",
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                        onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}>
                        Cancel
                    </button>
                    <button onClick={handleSubmit}
                        disabled={loading || !name.trim()}
                        className="flex-1 py-3 rounded-2xl text-sm font-semibold
                                   text-white transition-all"
                        style={{
                            background: name.trim()
                                ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                                : "rgba(99,102,241,0.3)",
                            boxShadow: name.trim()
                                ? "0 4px 20px rgba(99,102,241,0.4)" : "none",
                            cursor: name.trim() ? "pointer" : "not-allowed",
                        }}>
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-3.5 h-3.5 border-2 border-white/30
                                                 border-t-white rounded-full animate-spin" />
                                Creating...
                            </span>
                        ) : "Create Channel ✨"}
                    </button>
                </div>
            </div>
        </div>
    );
}