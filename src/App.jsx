import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { auth } from "./firebase";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
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
            <div className="min-h-screen bg-gray-100">
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <h1 className="text-2xl font-bold text-blue-600">
                            SkillSwap
                        </h1>
                    </div>
                </header>

                <main className="flex-1 flex flex-col p-4">
                    <Routes>
                        <Route path="/" element={<MatchForm />} />
                        <Route
                            path="/chat/:matchId"
                            element={
                                <div className="flex-1 flex flex-col">
                                    <ChatRoom />
                                </div>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
