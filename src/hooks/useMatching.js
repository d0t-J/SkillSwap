import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    getDocs,
    serverTimestamp,
} from "firebase/firestore";

export function useMatching() {
    const [currentMatch, setCurrentMatch] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    // Listen for matches involving current user
    useEffect(() => {
        if (!auth.currentUser) return;

        const matchRequestsRef = collection(db, "match-requests");
        const userMatchQuery = query(
            matchRequestsRef,
            where("userId", "==", auth.currentUser.uid),
            where("status", "==", "matched")
        );

        const unsubscribe = onSnapshot(userMatchQuery, (snapshot) => {
            if (!snapshot.empty) {
                const matchData = snapshot.docs[0].data();
                setCurrentMatch({
                    id: snapshot.docs[0].id,
                    ...matchData,
                });
            } else {
                setCurrentMatch(null);
            }
        });

        return unsubscribe;
    }, []);

    const findMatch = async (offerSkill, requestSkill) => {
        setIsSearching(true);

        try {
            // Look for someone who offers what we want and wants what we offer
            const matchRequestsRef = collection(db, "match-requests");
            const potentialMatches = query(
                matchRequestsRef,
                where("offer", "==", requestSkill),
                where("request", "==", offerSkill),
                where("status", "==", "pending")
            );

            const snapshot = await getDocs(potentialMatches);

            if (!snapshot.empty) {
                // Found a match! Create our matched request
                const partnerData = snapshot.docs[0].data();

                await addDoc(collection(db, "match-requests"), {
                    userId: auth.currentUser.uid,
                    offer: offerSkill,
                    request: requestSkill,
                    status: "matched",
                    matchedWith: partnerData.userId,
                    partnerOffer: partnerData.offer,
                    partnerRequest: partnerData.request,
                    createdAt: serverTimestamp(),
                });
            } else {
                // No match found, but for testing purposes, let's simulate a match
                await addDoc(collection(db, "match-requests"), {
                    userId: auth.currentUser.uid,
                    offer: offerSkill,
                    request: requestSkill,
                    status: "matched",
                    matchedWith: "demo-partner-id",
                    partnerOffer: requestSkill, // What you wanted to learn
                    partnerRequest: offerSkill, // What you offered
                    createdAt: serverTimestamp(),
                });
            }
        } catch (error) {
            console.error("Error finding match:", error);
            throw error;
        } finally {
            setIsSearching(false);
        }
    };

    return { currentMatch, isSearching, findMatch };
}
