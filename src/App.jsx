// src/App.jsx
import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import MatchForm from "./components/MatchForm";

export default function App() {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        // 1. Start anonymous sign-in
        signInAnonymously(auth).catch((err) => {
            console.error("Anonymous sign-in failed:", err);
        });

        // 2. Listen for auth state
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });
        return unsubscribe;
    }, []);

    // While checking auth state
    if (user === undefined) {
        return <div className="p-8 text-center">Loading…</div>;
    }

    // Now we have a user (anonymous or otherwise), show the form
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="p-4 bg-white shadow">
                <h1 className="text-2xl">SkillSwap</h1>
            </header>
            <main className="p-8">
                <MatchForm />
            </main>
        </div>
    );
}
