import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";

export function useWebSocket(
    token, roomId, onMessage, onTyping,
    onMessageEdited, onMessageDeleted   // ← NEW params
) {
    const clientRef = useRef(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!token || !roomId) return;

        const client = new Client({
            webSocketFactory: () => new window.SockJS("http://localhost:8080/ws"),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },

            onConnect: () => {
                setConnected(true);

                // Normal messages
                client.subscribe(`/topic/chatroom/${roomId}`, (msg) => {
                    onMessage(JSON.parse(msg.body));
                });

                // Typing
                client.subscribe(`/topic/chatroom/${roomId}/typing`, (msg) => {
                    onTyping(JSON.parse(msg.body));
                });

                // Edit — useEffect ke ANDAR onConnect mein
                client.subscribe(`/topic/room/${roomId}/edit`, (msg) => {
                    const edited = JSON.parse(msg.body);
                    if (onMessageEdited) onMessageEdited(edited);
                });

                // Delete — useEffect ke ANDAR onConnect mein
                client.subscribe(`/topic/room/${roomId}/delete`, (msg) => {
                    const { messageId } = JSON.parse(msg.body);
                    if (onMessageDeleted) onMessageDeleted(messageId);
                });
            },

            onDisconnect: () => setConnected(false),
            onStompError: (frame) => console.error("STOMP Error:", frame),
        });

        client.activate();
        clientRef.current = client;

        // Cleanup — deactivate on unmount/roomId change
        return () => client.deactivate();

    }, [token, roomId]); // ← sirf yahi 2 dependencies

    const sendMessage = (content) => {
        if (!clientRef.current?.connected) return;
        clientRef.current.publish({
            destination: `/app/chat.sendMessage/${roomId}`,
            body: JSON.stringify({ content }),
        });
    };

    const sendTyping = (typing) => {
        if (!clientRef.current?.connected) return;
        clientRef.current.publish({
            destination: `/app/chat.typing/${roomId}`,
            body: JSON.stringify({ typing }),
        });
    };

    return { connected, sendMessage, sendTyping };
}