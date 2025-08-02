import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";

export default function UserBrowser({ userSkill, wantedSkill }) {
    const navigate = useNavigate();
    const [availableUsers, setAvailableUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(null);

    useEffect(() => {
        const fetchAvailableUsers = async () => {
            try {
                if (!userSkill || !wantedSkill) return;

                // Find users who offer what we want to learn and want to learn what we offer
                const matchRequestsRef = collection(db, "match-requests");
                const potentialMatches = query(
                    matchRequestsRef,
                    where("offer", "==", wantedSkill),
                    where("request", "==", userSkill),
                    where("status", "==", "pending")
                );

                const snapshot = await getDocs(potentialMatches);
                const users = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    // Generate mock additional data for demo
                    experience: Math.floor(Math.random() * 5) + 1,
                    rating: (4 + Math.random()).toFixed(1),
                    responseTime: Math.floor(Math.random() * 30) + 5,
                    timezone: ["EST", "PST", "GMT", "CET"][
                        Math.floor(Math.random() * 4)
                    ],
                    bio: generateBio(doc.data().offer, doc.data().request),
                }));

                setAvailableUsers(users);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableUsers();
    }, [userSkill, wantedSkill]);

    const generateBio = (offer, request) => {
        const bios = [
            `Passionate about ${offer.toLowerCase()}! I've been teaching for ${
                Math.floor(Math.random() * 3) + 2
            } years and love helping others learn. Looking to expand my skills in ${request.toLowerCase()}.`,
            `${offer} enthusiast here! I believe in learning through practice and collaboration. Excited to exchange knowledge about ${request.toLowerCase()} too!`,
            `Experienced in ${offer.toLowerCase()} with a friendly teaching style. Always eager to learn new things, especially ${request.toLowerCase()}. Let's grow together!`,
            `I enjoy sharing my ${offer.toLowerCase()} knowledge and making learning fun! Currently exploring ${request.toLowerCase()} and would love a learning buddy.`,
        ];
        return bios[Math.floor(Math.random() * bios.length)];
    };

    const connectWithUser = async (selectedUser) => {
        setConnecting(selectedUser.id);
        try {
            // Create a match between current user and selected user
            const matchDoc = await addDoc(collection(db, "match-requests"), {
                userId: auth.currentUser.uid,
                offer: userSkill,
                request: wantedSkill,
                status: "matched",
                matchedWith: selectedUser.userId,
                partnerOffer: selectedUser.offer,
                partnerRequest: selectedUser.request,
                createdAt: serverTimestamp(),
            });

            // Navigate to chat with the new match
            navigate(`/chat/${matchDoc.id}`);
        } catch (error) {
            console.error("Error connecting with user:", error);
            setConnecting(null);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                        Finding Available Partners
                    </h3>
                    <p className="text-slate-600">
                        Searching for people who teach{" "}
                        <span className="font-semibold text-blue-700">
                            {wantedSkill}
                        </span>{" "}
                        and want to learn{" "}
                        <span className="font-semibold text-emerald-700">
                            {userSkill}
                        </span>
                    </p>
                </div>
            </div>
        );
    }

    if (availableUsers.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-slate-200">
                    <div className="text-6xl mb-6">🔍</div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">
                        No Matches Found Yet
                    </h3>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        No one is currently offering{" "}
                        <span className="font-semibold text-blue-700">
                            {wantedSkill}
                        </span>{" "}
                        while wanting to learn{" "}
                        <span className="font-semibold text-emerald-700">
                            {userSkill}
                        </span>
                        .
                    </p>
                    <div className="space-y-3">
                        <p className="text-sm text-slate-500">You can:</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => navigate("/match")}
                                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                Try Different Skills
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors"
                            >
                                Refresh Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                    Choose Your Learning Partner
                </h2>
                <p className="text-slate-600">
                    Found{" "}
                    <span className="font-semibold text-blue-700">
                        {availableUsers.length}
                    </span>{" "}
                    people who can teach you{" "}
                    <span className="font-semibold text-blue-700">
                        {wantedSkill}
                    </span>
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableUsers.map((user) => (
                    <div
                        key={user.id}
                        className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-200 group"
                    >
                        {/* User Avatar */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                                👤
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-1">
                                Learning Partner #{user.id.slice(-4)}
                            </h3>
                            <div className="flex items-center justify-center text-white text-sm">
                                <span className="mr-1">⭐</span>
                                <span>{user.rating}</span>
                                <span className="mx-2">•</span>
                                <span>{user.timezone}</span>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="p-6">
                            <div className="space-y-4">
                                {/* Skills Exchange */}
                                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-xl">
                                    <div className="flex items-center justify-between text-sm">
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                                                <span className="text-slate-600">
                                                    Teaching:
                                                </span>
                                            </div>
                                            <p className="font-semibold text-emerald-700">
                                                {user.offer}
                                            </p>
                                        </div>
                                        <div className="text-xl">↔️</div>
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                                <span className="text-slate-600">
                                                    Learning:
                                                </span>
                                            </div>
                                            <p className="font-semibold text-blue-700">
                                                {user.request}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="bg-slate-50 rounded-lg p-3">
                                        <div className="text-lg font-bold text-slate-800">
                                            {user.experience}
                                        </div>
                                        <div className="text-xs text-slate-600">
                                            Years Experience
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3">
                                        <div className="text-lg font-bold text-slate-800">
                                            {user.responseTime}m
                                        </div>
                                        <div className="text-xs text-slate-600">
                                            Response Time
                                        </div>
                                    </div>
                                </div>

                                {/* Bio */}
                                <div>
                                    <h4 className="font-semibold text-slate-800 mb-2">
                                        About
                                    </h4>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {user.bio}
                                    </p>
                                </div>

                                {/* Connect Button */}
                                <button
                                    onClick={() => connectWithUser(user)}
                                    disabled={connecting === user.id}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold group-hover:scale-105"
                                >
                                    {connecting === user.id ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Connecting...
                                        </div>
                                    ) : (
                                        "Start Learning Together →"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Back Button */}
            <div className="mt-8 text-center">
                <button
                    onClick={() => navigate("/match")}
                    className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-medium"
                >
                    ← Back to Skill Search
                </button>
            </div>
        </div>
    );
}
