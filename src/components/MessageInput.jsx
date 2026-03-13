import { useState, useRef } from "react";

export default function MessageInput({ onSend, onTyping, disabled }) {
    const [message, setMessage] = useState("");
    const typingTimer = useRef(null);

    const handleChange = (e) => {
        setMessage(e.target.value);
        onTyping(true);
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => onTyping(false), 2000);
    };

    const handleSend = () => {
        if (!message.trim() || disabled) return;
        onSend(message.trim());
        setMessage("");
        onTyping(false);
        clearTimeout(typingTimer.current);
    };

    return (
        <div className="px-3 md:px-6 py-3 md:py-4 flex-shrink-0"
            style={{
                background: "var(--bg-secondary)",
                borderTop: "1px solid var(--border)"
            }}>
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
                style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)"
                }}
                onFocusCapture={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                onBlurCapture={(e) => e.currentTarget.style.borderColor = "var(--border)"}>

                <input type="text" value={message} onChange={handleChange}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    placeholder={disabled ? "Select a channel first..." : "Message..."}
                    disabled={disabled}
                    className="flex-1 bg-transparent outline-none text-sm"
                    style={{
                        color: "var(--text-primary)",
                        fontFamily: "Outfit, sans-serif"
                    }}
                />

                <button onClick={handleSend}
                    disabled={!message.trim() || disabled}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                    style={message.trim() && !disabled ? {
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        boxShadow: "0 4px 15px rgba(99,102,241,0.4)"
                    } : {
                        background: "rgba(255,255,255,0.05)",
                        opacity: 0.4
                    }}>
                    <svg className="w-4 h-4 text-white rotate-90" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}