import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    updateDoc,
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

        const matchesRef = collection(db, "matches");
        const userMatchQuery = query(
            matchesRef,
            where("participants", "array-contains", auth.currentUser.uid),
            where("status", "==", "active")
        );

        const unsubscribe = onSnapshot(userMatchQuery, (snapshot) => {
            if (!snapshot.empty) {
                const matchData = snapshot.docs[0].data();
                setCurrentMatch({
                    id: snapshot.docs[0].id,
                    ...matchData,
                });
                setIsSearching(false);
            }
        });

        return unsubscribe;
    }, []);

    const findMatch = async (offerSkill, requestSkill) => {
        setIsSearching(true);

        try {
            // Look for someone who offers what we want and wants what we offer
            const matchesRef = collection(db, "match-requests");
            const potentialMatches = query(
                matchesRef,
                where("offer", "==", requestSkill),
                where("request", "==", offerSkill),
                where("status", "==", "pending")
            );

            const snapshot = await getDocs(potentialMatches);

            if (!snapshot.empty) {
                // Found a match!
                const partnerDoc = snapshot.docs[0];
                const partnerData = partnerDoc.data();

                // Create active match session
                const matchRef = await addDoc(collection(db, "matches"), {
                    participants: [auth.currentUser.uid, partnerData.userId],
                    skills: {
                        [auth.currentUser.uid]: {
                            offer: offerSkill,
                            request: requestSkill,
                        },
                        [partnerData.userId]: {
                            offer: partnerData.offer,
                            request: partnerData.request,
                        },
                    },
                    status: "active",
                    createdAt: serverTimestamp(),
                });

                // Remove both match requests
                await updateDoc(partnerDoc.ref, { status: "matched" });

                return matchRef.id;
            } else {
                // No match found, add to pending requests
                await addDoc(collection(db, "match-requests"), {
                    userId: auth.currentUser.uid,
                    offer: offerSkill,
                    request: requestSkill,
                    status: "pending",
                    createdAt: serverTimestamp(),
                });

                return null; // Still searching
            }
        } catch (error) {
            console.error("Error finding match:", error);
            setIsSearching(false);
            throw error;
        }
    };

    return { currentMatch, isSearching, findMatch };
}
