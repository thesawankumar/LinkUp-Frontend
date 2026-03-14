import { useState, useRef } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function MessageInput({ onSend, onTyping, disabled }) {
    const [message, setMessage] = useState("");
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null); // selected file preview
    const [fileData, setFileData] = useState(null); // uploaded file info
    const typingTimer = useRef(null);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setMessage(e.target.value);
        onTyping(true);
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => onTyping(false), 2000);
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 50MB limit
        if (file.size > 50 * 1024 * 1024) {
            toast.error("File 50MB se badi nahi honi chahiye!");
            return;
        }

        // Local preview
        const localUrl = URL.createObjectURL(file);
        setPreview({ url: localUrl, type: file.type, name: file.name });

        // Upload karo
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await api.post("/api/files/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setFileData(res.data);
            toast.success("File ready to send! ✅");
        } catch (err) {
            toast.error("Upload failed!");
            setPreview(null);
        }
        setUploading(false);
    };

    const handleSend = () => {
        if ((!message.trim() && !fileData) || disabled) return;
        onSend(message.trim(), fileData);
        setMessage("");
        setPreview(null);
        setFileData(null);
        onTyping(false);
        clearTimeout(typingTimer.current);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removePreview = () => {
        setPreview(null);
        setFileData(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="px-3 md:px-6 py-3 md:py-4 flex-shrink-0"
            style={{
                background: "var(--bg-secondary)",
                borderTop: "1px solid var(--border)"
            }}>

            {/* File Preview */}
            {preview && (
                <div className="mb-3 relative inline-block">
                    {preview.type.startsWith("image/") ? (
                        <img src={preview.url} alt="preview"
                            className="h-24 w-auto rounded-2xl object-cover"
                            style={{ border: "2px solid var(--accent)" }} />
                    ) : preview.type.startsWith("video/") ? (
                        <video src={preview.url}
                            className="h-24 w-auto rounded-2xl"
                            style={{ border: "2px solid var(--accent)" }}
                            controls />
                    ) : (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl"
                            style={{
                                background: "rgba(99,102,241,0.1)",
                                border: "1px solid rgba(99,102,241,0.3)"
                            }}>
                            <span>📎</span>
                            <span className="text-xs" style={{ color: "var(--text-primary)" }}>
                                {preview.name}
                            </span>
                        </div>
                    )}

                    {/* Remove button */}
                    <button onClick={removePreview}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full
                                   flex items-center justify-center text-xs font-bold
                                   text-white"
                        style={{ background: "#ef4444" }}>
                        ×
                    </button>

                    {/* Uploading indicator */}
                    {uploading && (
                        <div className="absolute inset-0 rounded-2xl flex items-center
                                        justify-center"
                            style={{ background: "rgba(0,0,0,0.5)" }}>
                            <div className="w-5 h-5 border-2 border-white/30
                                            border-t-white rounded-full animate-spin" />
                        </div>
                    )}
                </div>
            )}

            {/* Input Row */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl transition-all"
                style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)"
                }}
                onFocusCapture={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                onBlurCapture={(e) => e.currentTarget.style.borderColor = "var(--border)"}>

                {/* File attach button */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                />
                <label htmlFor="file-upload"
                    className="w-8 h-8 rounded-xl flex items-center justify-center
                               cursor-pointer transition-all flex-shrink-0 text-base"
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        color: "var(--text-muted)"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(99,102,241,0.15)"}
                    onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                    📎
                </label>

                {/* Text input */}
                <input type="text" value={message} onChange={handleChange}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    placeholder={disabled ? "Select a channel first..."
                        : uploading ? "Uploading..."
                            : "Message..."}
                    disabled={disabled || uploading}
                    className="flex-1 bg-transparent outline-none text-sm"
                    style={{
                        color: "var(--text-primary)",
                        fontFamily: "Outfit, sans-serif"
                    }}
                />

                {/* Send button */}
                <button onClick={handleSend}
                    disabled={(!message.trim() && !fileData) || disabled || uploading}
                    className="w-9 h-9 rounded-xl flex items-center justify-center
                               transition-all flex-shrink-0"
                    style={(message.trim() || fileData) && !disabled && !uploading ? {
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        boxShadow: "0 4px 15px rgba(99,102,241,0.4)"
                    } : {
                        background: "rgba(255,255,255,0.05)",
                        opacity: 0.4
                    }}>
                    <svg className="w-4 h-4 text-white rotate-90"
                        fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}