import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { auth } from "./firebase";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import Homepage from "./components/Homepage";
import MatchForm from "./components/MatchForm";
import ChatRoom from "./components/ChatRoom";

export default function App() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setIsLoading(false);
            } else {
                signInAnonymously(auth)
                    .then((result) => {
                        console.log("Anonymous sign-in successful");
                        setUser(result.user);
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        console.error("Anonymous sign-in failed:", error);
                        setIsLoading(false);
                    });
            }
        });

        return unsubscribe;
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading SkillSwap...</p>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <header className="bg-white shadow-sm border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex items-center">
                            <div className="text-3xl mr-3">🤝</div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                                    SkillSwap
                                </h1>
                                <p className="text-sm text-slate-600">
                                    Learn together, grow together
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 py-8">
                    <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/match" element={<MatchForm />} />
                        <Route path="/chat/:matchId" element={<ChatRoom />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
