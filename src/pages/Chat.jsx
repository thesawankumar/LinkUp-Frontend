import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useWebSocket } from "../hooks/useWebSocket";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import CreateRoomModal from "../components/CreateRoomModal";
import MembersPanel from "../components/MembersPanel";
import ProfileModal from "../components/ProfileModal";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Chat() {
    const { user, token } = useAuth();
    const [groupRooms, setGroupRooms] = useState([]);
    const [directRooms, setDirectRooms] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [typingUser, setTypingUser] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [profileUser, setProfileUser] = useState(null);
    const [showMembers, setShowMembers] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    const handleMessage = useCallback((msg) => {
        setMessages((prev) => [...prev, msg]);
    }, []);

    const handleMessageEdited = (editedMsg) => {
        setMessages(prev => prev.map(m => m.id === editedMsg.id ? editedMsg : m));
    };

    const handleMessageDeleted = (messageId) => {
        setMessages(prev => prev.filter(m => m.id !== messageId));
    };

    const handleEditMessage = async (messageId, newContent) => {
        try {
            await api.put(`/api/messages/${messageId}`, { content: newContent });
        } catch (err) {
            toast.error("Edit nahi hua!");
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            await api.delete(`/api/messages/${messageId}`);
        } catch (err) {
            toast.error("Delete nahi hua!");
        }
    };

    const handleProfileClick = async (userOrMsg) => {
        try {
            const userId = userOrMsg.senderId || userOrMsg.id;
            const res = await api.get(`/api/users/${userId}`);
            setProfileUser(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleTyping = useCallback((data) => {
        if (data.name === user?.name) return;
        if (data.typing) setTypingUser(data.name);
        else setTypingUser(null);
    }, [user]);

    const { sendMessage, sendTyping } = useWebSocket(
        token, selectedRoom?.id, handleMessage, handleTyping,
        handleMessageEdited, handleMessageDeleted
    );

    useEffect(() => {
        loadRooms();
        loadUsers();
    }, []);

    const loadRooms = async () => {
        try {
            const [groupRes, directRes] = await Promise.all([
                api.get("/api/rooms/group"),
                api.get("/api/rooms/direct"),
            ]);
            setGroupRooms(groupRes.data);
            setDirectRooms(directRes.data);
        } catch (err) { console.error(err); }
    };

    const loadUsers = async () => {
        try {
            const res = await api.get("/api/users/all");
            setAllUsers(res.data);
        } catch (err) { console.error(err); }
    };

    const handleSelectRoom = async (room) => {
        setSelectedRoom(room);
        setMessages([]);
        setTypingUser(null);
        setShowSidebar(false);
        setShowMembers(false);
        try {
            if (room.roomType === "GROUP") {
                await api.post(`/api/rooms/${room.id}/join`);
            }
            const res = await api.get(`/api/messages/${room.id}`);
            setMessages(res.data);
        } catch (err) { console.error(err); }
    };

    const handleOpenDM = async (targetUser) => {
        try {
            const res = await api.post(`/api/rooms/direct/${targetUser.id}`);
            const room = res.data;
            setDirectRooms((prev) => {
                const exists = prev.find((r) => r.id === room.id);
                return exists ? prev : [...prev, room];
            });
            handleSelectRoom(room);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateRoom = async (name, description) => {
        try {
            const res = await api.post("/api/rooms", { name, description });
            setGroupRooms((prev) => [...prev, res.data]);
            setShowCreateModal(false);
            handleSelectRoom(res.data);
            toast.success(`#${name} channel ban gaya! 🎉`);
        } catch (err) {
            toast.error("Room banana fail ho gaya!");
        }
    };

    const handleSend = (content, fileData) => sendMessage(content, fileData);

    return (
        // ← 100dvh — mobile browser bar ke saath sahi height
        <div className="flex overflow-hidden relative"
            style={{
                height: "100dvh",
                background: "var(--bg-primary)"
            }}>

            {/* Mobile Overlay */}
            {showSidebar && (
                <div
                    className="fixed inset-0 z-20 md:hidden"
                    style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
                    onClick={() => setShowSidebar(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:relative z-30 md:z-auto
                transition-transform duration-300 ease-in-out
                ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `} style={{ height: "100dvh" }}>
                <Sidebar
                    groupRooms={groupRooms}
                    directRooms={directRooms}
                    allUsers={allUsers}
                    selectedRoom={selectedRoom}
                    onSelectRoom={handleSelectRoom}
                    onOpenDM={handleOpenDM}
                    onCreateRoom={() => setShowCreateModal(true)}
                    currentUser={user}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Mobile Header */}
                <div className="md:hidden flex items-center gap-3 px-4 flex-shrink-0"
                    style={{
                        height: "56px",
                        background: "var(--bg-secondary)",
                        borderBottom: "1px solid var(--border)"
                    }}>
                    <button
                        onClick={() => setShowSidebar(true)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div className="flex flex-col gap-1.5">
                            <div className="w-4 h-0.5 rounded-full"
                                style={{ background: "var(--text-primary)" }} />
                            <div className="w-4 h-0.5 rounded-full"
                                style={{ background: "var(--text-primary)" }} />
                            <div className="w-3 h-0.5 rounded-full"
                                style={{ background: "var(--text-primary)" }} />
                        </div>
                    </button>

                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                            <span className="text-sm">
                                {selectedRoom?.roomType === "DIRECT" ? "💬" : "🔗"}
                            </span>
                        </div>
                        <span className="font-semibold text-sm truncate"
                            style={{ color: "var(--text-primary)" }}>
                            {selectedRoom
                                ? (selectedRoom.roomType === "DIRECT"
                                    ? selectedRoom.name
                                        ?.replace(user?.name + " & ", "")
                                        .replace(" & " + user?.name, "")
                                    : `#${selectedRoom.name}`)
                                : "LinkUp"}
                        </span>
                    </div>

                    {selectedRoom?.roomType === "GROUP" && (
                        <button
                            onClick={() => setShowMembers(!showMembers)}
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                                background: showMembers
                                    ? "rgba(99,102,241,0.2)"
                                    : "rgba(255,255,255,0.06)"
                            }}>
                            👥
                        </button>
                    )}
                </div>

                {/* Chat + Members — flex-1 fills remaining height */}
                <div className="flex-1 flex overflow-hidden min-h-0">
                    <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                        <ChatWindow
                            messages={messages}
                            typingUser={typingUser}
                            room={selectedRoom}
                            currentUser={user}
                            onToggleMembers={() => setShowMembers(!showMembers)}
                            showMembers={showMembers}
                            onProfileClick={handleProfileClick}
                            onEditMessage={handleEditMessage}
                            onDeleteMessage={handleDeleteMessage}
                        />
                        <MessageInput
                            onSend={handleSend}
                            onTyping={sendTyping}
                            disabled={!selectedRoom}
                        />
                    </div>

                    {showMembers && selectedRoom?.roomType === "GROUP" && (
                        <div className="fixed md:relative inset-y-0 right-0 z-30 md:z-auto h-full">
                            <MembersPanel
                                room={selectedRoom}
                                allUsers={allUsers}
                                onClose={() => setShowMembers(false)}
                                onProfileClick={handleProfileClick}
                            />
                        </div>
                    )}
                </div>
            </div>

            <CreateRoomModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreate={handleCreateRoom}
            />

            <ProfileModal
                user={profileUser}
                onClose={() => setProfileUser(null)}
                onOpenDM={handleOpenDM}
            />
        </div>
    );
}