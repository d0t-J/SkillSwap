// src/App.jsx
import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import MatchForm from "./components/MatchForm";

export default function App() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                setUser(user);
                setIsLoading(false);
            } else {
                // User is signed out, sign them in anonymously
                signInAnonymously(auth)
                    .then(() => {
                        console.log("Anonymous sign-in successful");
                    })
                    .catch((error) => {
                        console.error("Anonymous sign-in failed:", error);
                        setIsLoading(false);
                    });
            }
        });

        return unsubscribe;
    }, []);

    // While checking auth state
    if (isLoading) {
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
