import React, { useState } from "react";
import { useMatching } from "../hooks/useMatching";
import ChatRoom from "./ChatRoom";
import UserBrowser from "./UserBrowser";
export default function MatchForm() {
    const [offer, setOffer] = useState("");
    const [request, setRequest] = useState("");
    const { findMatch, match, clearAllMatches } = useMatching();
    const [showBrowser, setShowBrowser] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (offer.trim() && request.trim()) {
            await findMatch(offer, request);
        }
    };
    const handleClearMatches = () => {
        clearAllMatches();
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white p-4">
            {" "}
            <div className="max-w-2xl mx-auto">
                {" "}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    {" "}
                    {match ? (
                        <div className="p-8">
                            {" "}
                            <div className="text-center mb-6">
                                {" "}
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full mb-4">
                                    {" "}
                                    <span className="text-2xl">🎯</span>{" "}
                                </div>{" "}
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                                    Perfect Match Found!
                                </h2>{" "}
                                <p className="text-slate-600">
                                    Your learning journey begins now
                                </p>{" "}
                            </div>{" "}
                            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 mb-6 border border-emerald-200">
                                {" "}
                                <div className="grid md:grid-cols-2 gap-4">
                                    {" "}
                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                        {" "}
                                        <div className="flex items-center mb-2">
                                            {" "}
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>{" "}
                                            <span className="text-sm font-semibold text-slate-700">
                                                You're Teaching
                                            </span>{" "}
                                        </div>{" "}
                                        <p className="text-emerald-700 font-medium">
                                            {match.offer}
                                        </p>{" "}
                                    </div>{" "}
                                    <div className="bg-white rounded-lg p-4 shadow-sm">
                                        {" "}
                                        <div className="flex items-center mb-2">
                                            {" "}
                                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>{" "}
                                            <span className="text-sm font-semibold text-slate-700">
                                                You're Learning
                                            </span>{" "}
                                        </div>{" "}
                                        <p className="text-blue-700 font-medium">
                                            {match.request}
                                        </p>{" "}
                                    </div>{" "}
                                </div>{" "}
                            </div>{" "}
                            <div className="flex gap-3 mb-6">
                                {" "}
                                <button
                                    onClick={handleClearMatches}
                                    className="flex-1 py-3 px-6 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 font-semibold transition-all duration-200 shadow-lg"
                                >
                                    {" "}
                                    New Match 🔄{" "}
                                </button>{" "}
                            </div>{" "}
                            <ChatRoom matchId={match.id} />{" "}
                        </div>
                    ) : (
                        <div className="p-8">
                            {" "}
                            <div className="text-center mb-8">
                                {" "}
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                                    {" "}
                                    Find Your Perfect{" "}
                                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ml-2">
                                        {" "}
                                        Learning Partner{" "}
                                    </span>{" "}
                                </h1>{" "}
                                <p className="text-slate-600">
                                    Share your skills and discover new ones
                                    together
                                </p>{" "}
                            </div>{" "}
                            <div className="mb-6">
                                {" "}
                                <div className="flex bg-slate-100 rounded-xl p-1">
                                    {" "}
                                    <button
                                        onClick={() => setShowBrowser(false)}
                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            !showBrowser
                                                ? "bg-white text-blue-600 shadow-sm"
                                                : "text-slate-600 hover:text-slate-800"
                                        }`}
                                    >
                                        {" "}
                                        🔍 Auto Match{" "}
                                    </button>{" "}
                                    <button
                                        onClick={() => setShowBrowser(true)}
                                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            showBrowser
                                                ? "bg-white text-blue-600 shadow-sm"
                                                : "text-slate-600 hover:text-slate-800"
                                        }`}
                                    >
                                        {" "}
                                        👥 Browse Users{" "}
                                    </button>{" "}
                                </div>{" "}
                            </div>{" "}
                            {showBrowser ? (
                                <UserBrowser />
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {" "}
                                    <div>
                                        {" "}
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                                            {" "}
                                            <div className="flex items-center">
                                                {" "}
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>{" "}
                                                What skill can you teach?{" "}
                                            </div>{" "}
                                        </label>{" "}
                                        <input
                                            type="text"
                                            value={offer}
                                            onChange={(e) =>
                                                setOffer(e.target.value)
                                            }
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                                            placeholder="e.g., JavaScript, Guitar playing, Spanish"
                                            required
                                        />{" "}
                                    </div>{" "}
                                    <div>
                                        {" "}
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                                            {" "}
                                            <div className="flex items-center">
                                                {" "}
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>{" "}
                                                What skill do you want to learn?{" "}
                                            </div>{" "}
                                        </label>{" "}
                                        <input
                                            type="text"
                                            value={request}
                                            onChange={(e) =>
                                                setRequest(e.target.value)
                                            }
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                                            placeholder="e.g., Python basics, Cooking tips, Photography"
                                            required
                                        />{" "}
                                    </div>{" "}
                                    <div className="pt-2">
                                        {" "}
                                        <button
                                            type="submit"
                                            disabled={
                                                !offer.trim() || !request.trim()
                                            }
                                            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 font-semibold transition-all duration-200 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed shadow-lg"
                                        >
                                            {" "}
                                            Find My Perfect Match 🔍{" "}
                                        </button>{" "}
                                    </div>{" "}
                                </form>
                            )}{" "}
                        </div>
                    )}{" "}
                </div>{" "}
            </div>{" "}
        </div>
    );
}
