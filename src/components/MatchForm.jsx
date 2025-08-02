import React, { useState } from "react";
import { useMatching } from "../hooks/useMatching";
import { auth } from "../firebase";

export default function MatchForm() {
    const [offer, setOffer] = useState("");
    const [request, setRequest] = useState("");
    const { currentMatch, isSearching, findMatch } = useMatching();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await findMatch(offer, request);
        } catch (err) {
            console.error("Error finding match:", err);
        }
    };

    // If user has an active match, show match info instead of form
    if (currentMatch) {
        return (
            <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-green-600">
                    Match Found! 🎉
                </h2>
                <div className="space-y-3">
                    <p>
                        <strong>You're teaching:</strong> {currentMatch.offer}
                    </p>
                    <p>
                        <strong>You're learning:</strong> {currentMatch.request}
                    </p>
                    <p>
                        <strong>Partner offers:</strong>{" "}
                        {currentMatch.partnerOffer}
                    </p>
                    <p>
                        <strong>Partner wants:</strong>{" "}
                        {currentMatch.partnerRequest}
                    </p>
                    <button
                        className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                        onClick={() => {
                            /* We'll add chat navigation here */
                        }}
                    >
                        Start Learning Session
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">
                Find Your Skill Swap Partner
            </h2>

            {isSearching ? (
                <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        Looking for your perfect match...
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        This may take a moment
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Skill you intend to teach
                        </label>
                        <input
                            type="text"
                            value={offer}
                            onChange={(e) => setOffer(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., JavaScript basics, Guitar chords, Spanish conversation"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Skill you wish to learn
                        </label>
                        <input
                            type="text"
                            value={request}
                            onChange={(e) => setRequest(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Python basics, Cooking tips, Photography"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
                    >
                        Find My Partner
                    </button>
                </form>
            )}
        </div>
    );
}
