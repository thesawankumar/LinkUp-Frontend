import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Login() {
    const [mode, setMode] = useState("login");
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleRegister = async () => {
        setLoading(true);
        try {
            const res = await api.post("/api/auth/register", form);
            login({ userId: res.data.userId, name: res.data.name, email: res.data.email }, res.data.token);
            toast.success(`Welcome, ${res.data.name}! 🎉`);
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Register failed!");
        }
        setLoading(false);
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await api.post("/api/auth/login", form);
            login({ userId: res.data.userId, name: res.data.name, email: res.data.email }, res.data.token);
            toast.success(`Welcome back, ${res.data.name}! 👋`);
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed!");
        }
        setLoading(false);
    };

    const handleOtpSend = async () => {
        setLoading(true);
        try {
            await api.post("/api/auth/otp/send", { email: form.email });
            setOtpSent(true);
            toast.success("OTP bhej diya! Email check karo 📧");
        } catch (err) {
            toast.error(err.response?.data?.message || "OTP send failed!");
        }
        setLoading(false);
    };

    const handleOtpVerify = async () => {
        setLoading(true);
        try {
            const res = await api.post("/api/auth/otp/verify", { email: form.email, otp });
            login({ userId: res.data.userId, name: res.data.name, email: res.data.email }, res.data.token);
            toast.success("Login successful! 🚀");
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "OTP verify failed!");
        }
        setLoading(false);
    };

    const tabs = [
        { id: "login", label: "Sign In", icon: "👋" },
        { id: "register", label: "Sign Up", icon: "✨" },
        { id: "otp", label: "OTP", icon: "📱" },
    ];

    const inputClass = "w-full px-4 py-3.5 rounded-2xl text-sm outline-none transition-all";
    const inputStyle = {
        background: "rgba(255,255,255,0.04)",
        border: "1px solid var(--border)",
        color: "var(--text-primary)",
        fontFamily: "Outfit, sans-serif"
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-8"
            style={{ background: "var(--bg-primary)" }}>

            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-15%] left-[-10%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />
                <div className="absolute bottom-[-15%] right-[-10%] w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)" }} />
                {/* Grid */}
                <div className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
                        backgroundSize: "50px 50px"
                    }} />
            </div>

            {/* Floating badges — desktop only */}
            <div className="hidden lg:flex absolute top-8 left-8 items-center gap-2 px-4 py-2 rounded-2xl"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                    Real-time messaging
                </span>
            </div>
            <div className="hidden lg:flex absolute bottom-8 right-8 items-center gap-2 px-4 py-2 rounded-2xl"
                style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                    🔒 End-to-end secure
                </span>
            </div>

            {/* Main Layout — split on large screens */}
            <div className="relative w-full max-w-5xl flex items-center gap-16">

                {/* Left side — desktop only */}
                <div className="hidden lg:flex flex-col flex-1 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                                <span className="text-xl">🔗</span>
                            </div>
                            <h1 className="text-3xl font-bold"
                                style={{
                                    background: "linear-gradient(135deg, #e2e8f0, #818cf8)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent"
                                }}>
                                LinkUp
                            </h1>
                        </div>
                        <h2 className="text-4xl font-bold leading-tight mb-4"
                            style={{ color: "var(--text-primary)" }}>
                            Connect with your<br />
                            <span style={{
                                background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                            }}>
                                team instantly
                            </span>
                        </h2>
                        <p className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
                            Real-time messaging, channels, and direct messages —
                            all in one beautiful workspace.
                        </p>
                    </div>

                    {/* Feature pills */}
                    <div className="flex flex-col gap-3">
                        {[
                            { icon: "⚡", text: "Real-time WebSocket messaging" },
                            { icon: "🔐", text: "Google OAuth + OTP login" },
                            { icon: "💬", text: "Channels & Direct Messages" },
                            { icon: "✏️", text: "Edit & delete messages" },
                        ].map((f) => (
                            <div key={f.text} className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                                style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid var(--border)"
                                }}>
                                <span className="text-lg">{f.icon}</span>
                                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                                    {f.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right side — Card */}
                <div className="w-full lg:w-[420px] flex-shrink-0 animate-fade-up">

                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
                            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                            <span className="text-2xl">🔗</span>
                        </div>
                        <h1 className="text-2xl font-bold"
                            style={{
                                background: "linear-gradient(135deg, #e2e8f0, #818cf8)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                            }}>
                            LinkUp
                        </h1>
                        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                            Connect. Chat. Collaborate.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="rounded-3xl p-6 sm:p-8"
                        style={{
                            background: "rgba(15,15,26,0.8)",
                            border: "1px solid rgba(99,102,241,0.2)",
                            backdropFilter: "blur(20px)",
                            boxShadow: "0 25px 60px rgba(0,0,0,0.4), 0 0 40px rgba(99,102,241,0.08)"
                        }}>

                        {/* Card Header */}
                        <div className="mb-6">
                            <h3 className="text-xl font-bold mb-1"
                                style={{ color: "var(--text-primary)" }}>
                                {mode === "login" ? "Welcome back 👋" :
                                    mode === "register" ? "Create account ✨" :
                                        "OTP Login 📱"}
                            </h3>
                            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                                {mode === "login" ? "Sign in to your LinkUp account" :
                                    mode === "register" ? "Join the conversation today" :
                                        "Login with your email OTP"}
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="flex rounded-2xl p-1 mb-6"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid var(--border)"
                            }}>
                            {tabs.map((tab) => (
                                <button key={tab.id}
                                    onClick={() => { setMode(tab.id); setOtpSent(false); }}
                                    className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm
                                               font-medium transition-all duration-300
                                               flex items-center justify-center gap-1.5"
                                    style={mode === tab.id ? {
                                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                        color: "#fff",
                                        boxShadow: "0 4px 15px rgba(99,102,241,0.4)"
                                    } : { color: "var(--text-muted)" }}>
                                    <span className="hidden sm:inline">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Register */}
                        {mode === "register" && (
                            <div className="space-y-3 animate-fade-in">
                                {[
                                    { name: "name", placeholder: "Full Name", type: "text", icon: "👤" },
                                    { name: "email", placeholder: "Email Address", type: "email", icon: "📧" },
                                    { name: "password", placeholder: "Password (min 6 chars)", type: "password", icon: "🔐" },
                                ].map((field) => (
                                    <div key={field.name} className="relative">
                                        <input
                                            name={field.name}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            value={form[field.name]}
                                            onChange={handleChange}
                                            className={inputClass}
                                            style={inputStyle}
                                            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                                            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                                            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                                        />
                                    </div>
                                ))}
                                <button onClick={handleRegister} disabled={loading}
                                    className="w-full py-3.5 rounded-2xl font-semibold text-white
                                               transition-all duration-300 mt-2 text-sm"
                                    style={{
                                        background: loading
                                            ? "rgba(99,102,241,0.5)"
                                            : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                        boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.4)"
                                    }}>
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30
                                                             border-t-white rounded-full animate-spin" />
                                            Creating account...
                                        </span>
                                    ) : "Create Account →"}
                                </button>
                            </div>
                        )}

                        {/* Login */}
                        {mode === "login" && (
                            <div className="space-y-3 animate-fade-in">
                                {[
                                    { name: "email", placeholder: "Email Address", type: "email" },
                                    { name: "password", placeholder: "Password", type: "password" },
                                ].map((field) => (
                                    <input key={field.name}
                                        name={field.name}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        value={form[field.name]}
                                        onChange={handleChange}
                                        className={inputClass}
                                        style={inputStyle}
                                        onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                                        onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                    />
                                ))}
                                <button onClick={handleLogin} disabled={loading}
                                    className="w-full py-3.5 rounded-2xl font-semibold text-white
                                               transition-all duration-300 text-sm"
                                    style={{
                                        background: loading
                                            ? "rgba(99,102,241,0.5)"
                                            : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                        boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.4)"
                                    }}>
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30
                                                             border-t-white rounded-full animate-spin" />
                                            Signing in...
                                        </span>
                                    ) : "Sign In →"}
                                </button>

                                {/* Divider */}
                                <div className="flex items-center gap-3 my-1">
                                    <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                                    <span className="text-xs px-2" style={{ color: "var(--text-muted)" }}>
                                        or continue with
                                    </span>
                                    <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                                </div>

                                <a href="http://localhost:8080/oauth2/authorization/google"
                                    className="w-full flex items-center justify-center gap-3 py-3.5
                                               rounded-2xl text-sm font-medium transition-all"
                                    style={{
                                        background: "rgba(255,255,255,0.04)",
                                        border: "1px solid var(--border)",
                                        color: "var(--text-primary)"
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)";
                                        e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.borderColor = "var(--border)";
                                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                                    }}>
                                    <img src="https://www.google.com/favicon.ico" alt="G" className="w-4 h-4" />
                                    Continue with Google
                                </a>
                            </div>
                        )}

                        {/* OTP */}
                        {mode === "otp" && (
                            <div className="space-y-3 animate-fade-in">
                                <input name="email" type="email"
                                    placeholder="Email Address"
                                    value={form.email} onChange={handleChange}
                                    className={inputClass}
                                    style={inputStyle}
                                    onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                                />

                                {!otpSent ? (
                                    <button onClick={handleOtpSend} disabled={loading}
                                        className="w-full py-3.5 rounded-2xl font-semibold
                                                   text-white transition-all text-sm"
                                        style={{
                                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                            boxShadow: "0 4px 20px rgba(99,102,241,0.4)"
                                        }}>
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="w-4 h-4 border-2 border-white/30
                                                                 border-t-white rounded-full animate-spin" />
                                                Sending...
                                            </span>
                                        ) : "Send OTP 📧"}
                                    </button>
                                ) : (
                                    <>
                                        <div className="text-center py-3 rounded-2xl text-sm"
                                            style={{
                                                background: "rgba(99,102,241,0.08)",
                                                color: "var(--accent-light)",
                                                border: "1px solid rgba(99,102,241,0.2)"
                                            }}>
                                            ✅ OTP sent to <strong>{form.email}</strong>
                                        </div>

                                        <input
                                            placeholder="• • • • • •"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            maxLength={6}
                                            className="w-full px-4 py-4 rounded-2xl text-center
                                                       outline-none tracking-[0.5em] text-2xl
                                                       font-bold transition-all"
                                            style={{
                                                background: "rgba(255,255,255,0.04)",
                                                border: "1px solid rgba(99,102,241,0.3)",
                                                color: "var(--accent-light)",
                                                fontFamily: "JetBrains Mono, monospace"
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
                                            onBlur={(e) => e.target.style.borderColor = "rgba(99,102,241,0.3)"}
                                            onKeyDown={(e) => e.key === "Enter" && handleOtpVerify()}
                                        />

                                        <button onClick={handleOtpVerify} disabled={loading}
                                            className="w-full py-3.5 rounded-2xl font-semibold
                                                       text-white transition-all text-sm"
                                            style={{
                                                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                                boxShadow: "0 4px 20px rgba(99,102,241,0.4)"
                                            }}>
                                            {loading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <span className="w-4 h-4 border-2 border-white/30
                                                                     border-t-white rounded-full animate-spin" />
                                                    Verifying...
                                                </span>
                                            ) : "Verify & Login →"}
                                        </button>

                                        <button onClick={() => setOtpSent(false)}
                                            className="w-full text-xs py-2 transition-all rounded-xl"
                                            style={{ color: "var(--text-muted)" }}
                                            onMouseOver={(e) => e.currentTarget.style.color = "var(--accent-light)"}
                                            onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}>
                                            ↩ Resend OTP
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>
                        Built with ❤️ by Sawan Kumar
                    </p>
                </div>
            </div>
        </div>
    );
}
