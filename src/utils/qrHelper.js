import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    limit,
} from "firebase/firestore";
import db from "../api/firebase";
import axios from "axios";

export function getDateTime() {
    const now = new Date();
    return now.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

export async function scanQR(user) {
    console.log(user);
    const q = query(
        collection(db, "users"),
        where("userId", "==", user.id),
        limit(1)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return "User not found";
    }

    let message = "An error occurred";
    try {
        const promises = querySnapshot.docs.map(async (doc) => {
            const userData = doc.data();

            if (userData.scannedStatus) {
                message = "You have already scanned at " + userData.scannedTime;
            } else {
                message = `Scan succeeded. Welcome ${userData.firstName} ${userData.lastName}`;
                await updateDoc(doc.ref, {
                    scannedStatus: true,
                    scannedTime: getDateTime(),
                });
            }
        });

        await Promise.all(promises); // Ensure all updates are completed
    } catch (error) {
        console.error(error);
        return "An error occurred during scanning";
    }

    return message;
}

export const uploadImageToImgBB = async (base64Image) => {
    const apiKey = '9a981eca3f280e1599d1d56f9593fa42';
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, ""); // Remove prefix
    const formData = new FormData();
    formData.append('image', cleanBase64);

    try {
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);
        return response.data.data.url;
    } catch (error) {
        console.error('Error uploading image to ImgBB:', error);
        return null;
    }
};

