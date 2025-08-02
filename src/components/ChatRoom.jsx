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
    const [matchData, setMatchData] = useState(null);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Listen for messages in this match
    useEffect(() => {
        if (!matchId) return;

        const messagesRef = collection(db, "matches", matchId, "messages");
        const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messageList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(messageList);
        });

        return unsubscribe;
    }, [matchId]);

    // Send message function
    const sendMessage = async (text, sender = "user") => {
        if (!text.trim() || !matchId) return;

        try {
            const messagesRef = collection(db, "matches", matchId, "messages");
            await addDoc(messagesRef, {
                text: text.trim(),
                sender: sender, // 'user', 'partner', 'ai_tutor'
                userId: auth.currentUser?.uid,
                timestamp: serverTimestamp(),
            });

            if (sender === "user") {
                setNewMessage("");
                // Trigger AI response after user message
                setTimeout(() => generateAIResponse(text), 1000);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // AI Response Generator (placeholder for now)
    const generateAIResponse = async (userMessage) => {
        setIsAIThinking(true);

        // Simulate AI processing delay
        setTimeout(() => {
            const aiResponses = [
                "That's a great point! Here's a tip that might help...",
                "I noticed you mentioned that. Have you tried this approach?",
                "Excellent question! Let me break that down for you...",
                "That's exactly right! Building on that concept...",
                "Good progress! Here's something that might enhance your understanding...",
            ];

            const randomResponse =
                aiResponses[Math.floor(Math.random() * aiResponses.length)];
            sendMessage(`🤖 ${randomResponse}`, "ai_tutor");
            setIsAIThinking(false);
        }, 2000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(newMessage);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(newMessage);
        }
    };

    if (!matchId) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">No active match found</p>
                    <button
                        onClick={() => navigate("/")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Find a Match
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Skill Exchange Session 🎯
                        </h2>
                        <p className="text-sm text-gray-600">
                            Learning together with AI assistance
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/")}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                        End Session
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">
                            Start your skill exchange! The AI tutor will join to
                            help both of you learn.
                        </p>
                        <div className="text-sm text-gray-500">
                            💡 Try saying "Hi! I'm ready to learn [skill]"
                        </div>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${
                            message.sender === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.sender === "user"
                                    ? "bg-blue-600 text-white"
                                    : message.sender === "ai_tutor"
                                    ? "bg-purple-100 text-purple-900 border border-purple-200"
                                    : "bg-white text-gray-900 border border-gray-200"
                            }`}
                        >
                            {message.sender === "ai_tutor" && (
                                <div className="text-xs font-medium mb-1 opacity-75">
                                    AI Tutor
                                </div>
                            )}
                            <p className="text-sm">{message.text}</p>
                            <div className="text-xs opacity-75 mt-1">
                                {message.timestamp
                                    ?.toDate?.()
                                    ?.toLocaleTimeString() || "Just now"}
                            </div>
                        </div>
                    </div>
                ))}

                {isAIThinking && (
                    <div className="flex justify-start">
                        <div className="bg-purple-100 border border-purple-200 rounded-lg px-4 py-2 max-w-xs">
                            <div className="text-xs font-medium text-purple-900 mb-1">
                                AI Tutor
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                    <div
                                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.1s" }}
                                    ></div>
                                    <div
                                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.2s" }}
                                    ></div>
                                </div>
                                <span className="text-xs text-purple-700">
                                    thinking...
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message... (Press Enter to send)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Send
                    </button>
                </form>
                <div className="text-xs text-gray-500 mt-2">
                    🤖 AI Tutor will automatically join the conversation to help
                    you learn
                </div>
            </div>
        </div>
    );
}
