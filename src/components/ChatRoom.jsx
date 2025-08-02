// src/components/ChatRoom.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";

export default function ChatRoom() {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isAIThinking, setIsAIThinking] = useState(false);
    const bottomRef = useRef();

    // Scroll down on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Listen for messages under match-requests/{matchId}/messages
    useEffect(() => {
        if (!matchId) return;
        const msgsRef = collection(db, "match-requests", matchId, "messages");
        const q = query(msgsRef, orderBy("timestamp", "asc"));
        const unsub = onSnapshot(q, (snap) => {
            setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });
        return unsub;
    }, [matchId]);

    const sendMessage = async (text, sender = "user") => {
        if (!text.trim() || !matchId) return;
        const msgsRef = collection(db, "match-requests", matchId, "messages");
        await addDoc(msgsRef, {
            text: text.trim(),
            sender,
            userId: auth.currentUser.uid,
            timestamp: serverTimestamp(),
        });
        if (sender === "user") {
            setNewMessage("");
            setTimeout(() => generateAIResponse(text), 1000);
        }
    };

    // Placeholder AI until we hook the real function
    const generateAIResponse = async (userText) => {
        setIsAIThinking(true);
        setTimeout(() => {
            sendMessage(
                "🤖 AI says: Great question! Here’s a tip…",
                "ai_tutor"
            );
            setIsAIThinking(false);
        }, 1500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(newMessage);
    };

    if (!matchId) {
        return (
            <div className="flex items-center justify-center h-64">
                <p>No active match. Please find a partner first.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen max-w-3xl mx-auto">
            {/* Header omitted for brevity */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 && (
                    <p className="text-center text-gray-500">Start chatting!</p>
                )}
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${
                            msg.sender === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`px-4 py-2 rounded-lg ${
                                msg.sender === "user"
                                    ? "bg-blue-600 text-white"
                                    : msg.sender === "ai_tutor"
                                    ? "bg-purple-100 text-purple-900"
                                    : "bg-white text-gray-900"
                            }`}
                        >
                            {msg.sender === "ai_tutor" && (
                                <div className="text-xs opacity-75">
                                    AI Tutor
                                </div>
                            )}
                            <p>{msg.text}</p>
                            <div className="text-xs opacity-50 mt-1">
                                {msg.timestamp
                                    ?.toDate?.()
                                    .toLocaleTimeString() || ""}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
                {isAIThinking && (
                    <p className="text-purple-700 italic">
                        AI Tutor is typing…
                    </p>
                )}
            </div>
            <form
                onSubmit={handleSubmit}
                className="flex p-4 bg-white border-t"
            >
                <input
                    className="flex-1 border rounded-l px-3 py-2"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message…"
                />
                <button
                    type="submit"
                    className="px-4 bg-blue-600 text-white rounded-r"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
