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
    doc,
    getDoc,
} from "firebase/firestore";

export default function ChatRoom() {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isAIThinking, setIsAIThinking] = useState(false);
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef();

    // Load match data
    useEffect(() => {
        if (!matchId) return;

        const loadMatch = async () => {
            try {
                const matchDoc = await getDoc(
                    doc(db, "match-requests", matchId)
                );
                if (matchDoc.exists()) {
                    setMatchData(matchDoc.data());
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.error("Error loading match:", error);
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        loadMatch();
    }, [matchId, navigate]);

    // Scroll down on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Listen for messages
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
            // Trigger AI response after user message
            setTimeout(() => generateAIResponse(text), 1000);
        }
    };

    const generateAIResponse = async (userText) => {
        if (!matchData) return;

        setIsAIThinking(true);

        // Simple AI responses based on context
        const responses = [
            `Great question about ${matchData.request}! Here's a helpful tip: Start with the basics and practice regularly.`,
            `For ${matchData.request}, I'd recommend breaking it down into smaller, manageable steps.`,
            `That's a common challenge when learning ${matchData.request}. Have you tried practicing with simple examples first?`,
            `Remember, ${matchData.offer} and ${matchData.request} both require patience and consistent practice!`,
            `Here's an idea: Try explaining ${matchData.request} concepts to someone else - it really helps solidify your understanding.`,
        ];

        const randomResponse =
            responses[Math.floor(Math.random() * responses.length)];

        setTimeout(() => {
            sendMessage(`🤖 ${randomResponse}`, "ai_tutor");
            setIsAIThinking(false);
        }, 1500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(newMessage);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">
                        Loading your session...
                    </p>
                </div>
            </div>
        );
    }

    if (!matchId || !matchData) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-slate-200 max-w-md">
                    <div className="text-6xl mb-4">🔍</div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">
                        No Active Match
                    </h2>
                    <p className="text-slate-600 mb-6">
                        You need to find a learning partner first.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-sm"
                    >
                        Find a Partner
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 p-6 shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 mb-1">
                            Learning Session
                        </h2>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <span className="flex items-center">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                                <span className="text-slate-600">
                                    Teaching:
                                </span>
                                <span className="font-semibold text-emerald-700 ml-1">
                                    {matchData.offer}
                                </span>
                            </span>
                            <span className="flex items-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                <span className="text-slate-600">
                                    Learning:
                                </span>
                                <span className="font-semibold text-blue-700 ml-1">
                                    {matchData.request}
                                </span>
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate("/")}
                        className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200 font-medium"
                    >
                        End Session
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 max-w-md mx-auto">
                            <div className="text-4xl mb-4">👨‍🏫</div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                Welcome to your learning session!
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Start by asking questions about{" "}
                                <span className="font-semibold text-blue-700">
                                    {matchData.request}
                                </span>{" "}
                                or sharing tips about{" "}
                                <span className="font-semibold text-emerald-700">
                                    {matchData.offer}
                                </span>
                            </p>
                        </div>
                    </div>
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
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                                msg.sender === "user"
                                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                                    : msg.sender === "ai_tutor"
                                    ? "bg-gradient-to-r from-violet-50 to-purple-50 text-violet-900 border border-violet-200"
                                    : "bg-white text-slate-900 border border-slate-200 shadow-sm"
                            }`}
                        >
                            {msg.sender === "ai_tutor" && (
                                <div className="flex items-center text-xs text-violet-700 mb-2 font-medium">
                                    <span className="w-2 h-2 bg-violet-500 rounded-full mr-2"></span>
                                    AI Tutor
                                </div>
                            )}
                            <p className="whitespace-pre-wrap leading-relaxed">
                                {msg.text}
                            </p>
                            <div
                                className={`text-xs mt-2 ${
                                    msg.sender === "user"
                                        ? "text-blue-100"
                                        : "text-slate-500"
                                }`}
                            >
                                {msg.timestamp
                                    ?.toDate?.()
                                    .toLocaleTimeString() || ""}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
                {isAIThinking && (
                    <div className="flex justify-start">
                        <div className="bg-gradient-to-r from-violet-50 to-purple-50 text-violet-900 border border-violet-200 px-4 py-3 rounded-2xl shadow-sm">
                            <div className="flex items-center">
                                <div className="flex space-x-1 mr-3">
                                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                                    <div
                                        className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.1s" }}
                                    ></div>
                                    <div
                                        className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.2s" }}
                                    ></div>
                                </div>
                                <p className="italic text-sm">
                                    AI Tutor is thinking...
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <form
                onSubmit={handleSubmit}
                className="p-6 bg-white border-t border-slate-200 shadow-lg"
            >
                <div className="flex gap-3">
                    <input
                        className="flex-1 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Ask a question or share a tip..."
                        disabled={isAIThinking}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || isAIThinking}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm"
                    >
                        {isAIThinking ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Send"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
