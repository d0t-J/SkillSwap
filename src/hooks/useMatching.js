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
    updateDoc,
    doc,
    deleteDoc,
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
            // First, check if user already has a pending request
            const existingRequestQuery = query(
                collection(db, "match-requests"),
                where("userId", "==", auth.currentUser.uid),
                where("status", "==", "pending")
            );
            const existingRequests = await getDocs(existingRequestQuery);

            // Delete any existing pending requests
            for (const doc of existingRequests.docs) {
                await deleteDoc(doc.ref);
            }

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
                // Found a match! Update both requests to "matched"
                const partnerDoc = snapshot.docs[0];
                const partnerData = partnerDoc.data();

                // Update partner's request to matched
                await updateDoc(partnerDoc.ref, {
                    status: "matched",
                    matchedWith: auth.currentUser.uid,
                    partnerOffer: offerSkill,
                    partnerRequest: requestSkill,
                });

                // Create our matched request
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
                // No match found, create a pending request
                await addDoc(collection(db, "match-requests"), {
                    userId: auth.currentUser.uid,
                    offer: offerSkill,
                    request: requestSkill,
                    status: "pending",
                    createdAt: serverTimestamp(),
                });

                // Set up a listener for potential matches
                const waitForMatch = onSnapshot(
                    query(
                        collection(db, "match-requests"),
                        where("userId", "==", auth.currentUser.uid),
                        where("status", "==", "matched")
                    ),
                    (snapshot) => {
                        if (!snapshot.empty) {
                            // Match found! Stop searching
                            setIsSearching(false);
                            waitForMatch(); // Unsubscribe
                        }
                    }
                );

                // Keep searching for 30 seconds, then timeout
                setTimeout(() => {
                    setIsSearching(false);
                    waitForMatch(); // Unsubscribe
                }, 30000);
            }
        } catch (error) {
            console.error("Error finding match:", error);
            throw error;
        } finally {
            // Only set to false if we found an immediate match
            if (!snapshot || snapshot.empty) {
                // Keep searching...
            } else {
                setIsSearching(false);
            }
        }
    };

    const cancelSearch = async () => {
        try {
            const pendingRequestQuery = query(
                collection(db, "match-requests"),
                where("userId", "==", auth.currentUser.uid),
                where("status", "==", "pending")
            );
            const pendingRequests = await getDocs(pendingRequestQuery);

            for (const doc of pendingRequests.docs) {
                await deleteDoc(doc.ref);
            }

            setIsSearching(false);
        } catch (error) {
            console.error("Error canceling search:", error);
        }
    };

    const clearAllMatches = async () => {
        try {
            if (!auth.currentUser) return;

            // Clear all matched requests for current user
            const matchedRequestQuery = query(
                collection(db, "match-requests"),
                where("userId", "==", auth.currentUser.uid),
                where("status", "==", "matched")
            );
            const matchedRequests = await getDocs(matchedRequestQuery);

            for (const docRef of matchedRequests.docs) {
                await deleteDoc(docRef.ref);
            }

            // Clear all pending requests for current user
            const pendingRequestQuery = query(
                collection(db, "match-requests"),
                where("userId", "==", auth.currentUser.uid),
                where("status", "==", "pending")
            );
            const pendingRequests = await getDocs(pendingRequestQuery);

            for (const docRef of pendingRequests.docs) {
                await deleteDoc(docRef.ref);
            }

            // Reset local state
            setCurrentMatch(null);
            setIsSearching(false);
        } catch (error) {
            console.error("Error clearing matches:", error);
        }
    };

    return {
        currentMatch,
        isSearching,
        findMatch,
        cancelSearch,
        clearAllMatches,
    };
}
