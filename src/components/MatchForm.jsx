import React, { useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function MatchForm() {
    const [offer, setOffer] = useState("");
    const [request, setRequest] = useState("");
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Submitting…");
        try {
            await addDoc(collection(db, "matches"), {
                userId: auth.currentUser.uid,
                offer,
                request,
                status: "pending",
                timestamp: serverTimestamp(),
            });
            setStatus("Match request submitted!");
            setOffer("");
            setRequest("");
        } catch (err) {
            console.error("Error adding match:", err);
            setStatus("Submission failed. Try again.");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Find Your Match</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">
                        Skill You Offer
                    </label>
                    <input
                        type="text"
                        value={offer}
                        onChange={(e) => setOffer(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">
                        Skill You Want
                    </label>
                    <input
                        type="text"
                        value={request}
                        onChange={(e) => setRequest(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Find Match
                </button>
            </form>
            {status && <p className="mt-4 text-center">{status}</p>}
        </div>
    );
}
