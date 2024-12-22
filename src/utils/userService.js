import { collection, addDoc, updateDoc, Timestamp } from "firebase/firestore";
import db from "../api/firebase";
import { generateMultipleQRCodes, sendEmailMulti } from "./emailService";

export const submitUsers = async (users, email) => {
    if (
        users.some((user) => !user.firstName.trim() ||
        !email.trim())
    ) {
        return { success: false, message: "All fields must be filled." };
    }

    try {
        const ticketCount = users.length;
        // Map user details and assign unique userId to each
        const userGroup = users.map((user, index) => ({
            ...user,
            email,
            userId: generateRandomId(),
            emailStatus: false,
            scannedStatus: false,
            ticketCount: ticketCount,
            ticketId: index + 1,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        }));

        const qrCodes = await generateMultipleQRCodes(userGroup);

        if (!qrCodes || qrCodes.length === 0) {
            console.error("Failed to generate all QR codes");
            return { success: false, message: "Failed to generate QR codes" };
        }

        // Add each user to Firestore with their respective QR code
        const firestorePromises = userGroup.map((user, index) => {
            const updatedUser = {
                ...user,
                qrCodeUrl: qrCodes[index] || null, // Include the generated QR code URL
            };
            return addDoc(collection(db, "users"), updatedUser);
        });

        const userRefs = await Promise.all(firestorePromises);

        const emailSuccess = await sendEmailMulti(userGroup, qrCodes);

        if (emailSuccess) {
            var i = 0;
            const updatePromises = userRefs.map((ref) =>
                updateDoc(ref, { emailStatus: true })
            );

            await Promise.all(updatePromises);
            return { success: true, message: "Users added successfully!" };
        } else {
            return { success: false, message: "Failed to send email." };
        }
    } catch (error) {
        console.error("Error adding users or sending email:", error);
        return {
            success: false,
            message: "Error adding users or sending email.",
        };
    }
};

const generateRandomId = () => {
    return (
        "id-" +
        Math.random().toString(36).substr(2, 9) +
        "-" +
        Date.now().toString(36)
    );
};
