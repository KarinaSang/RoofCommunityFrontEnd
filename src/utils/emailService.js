import axios from "axios";
import emailjs from "@emailjs/browser";
import { uploadImageToImgBB } from "./qrHelper"; // Assuming qrHelper contains the ImgBB upload function

export const generateAndFetchQRCode = async (user) => {
    try {
        const response = await axios
            .post("https://roofcommunitybackend.onrender.com/api/generate", {
                firstName: user.firstName,
                lastName: user.lastName,
                id: user.userId,
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.data;
                }
            });

        const base64QRCode = response?.data?.qrCodeUrl;

        if (base64QRCode?.startsWith("data:image/png;base64,")) {
            //const uploadedUrl = await uploadImageToImgBB(base64QRCode);
            //console.log("upload url " + uploadedUrl);
            return base64QRCode;
        }

        console.error("QR code generation failed or invalid format.");
        return null;
    } catch (error) {
        console.error("Error generating QR code:", error);
        return null;
    }
};

export const generateMultipleQRCodes = async (userGroup) => {
    const qrCodes = Array(10).fill(false);
    for (let i = 0; i < userGroup.length; i++) {
        const qrCodeUrl = await generateAndFetchQRCode(userGroup[i]);
        qrCodes[i] = qrCodeUrl;
    }
    return qrCodes;
};

export const sendEmail = async (user, qrCode) => {
    if (typeof global.location === "undefined") {
        global.location = { href: "https://karinasang.github.io/" };
    }

    if (qrCode === null) {
        console.error("Failed to generate QR code");
        return false;
    }

    const templateParams = {
        to_name: user.firstName + " " + user.lastName,
        to_email: user.email,
        ticket_count: 1,
        qr_code1: qrCode
    };

    try {
        const response = await emailjs.send(
            "service_48jph9s",
            "template_laqn78w",
            templateParams,
            {
                publicKey: "d0frZQtRg__lupUwd",
            }
        );
        console.log("Email successfully sent!", response);
        return true; // Email sent successfully
    } catch (error) {
        console.error("Failed to send email:", error);
        return false; // Email sending failed
    }
};

export const sendEmailMulti = async (userGroup, qrCodes) => {
    if (typeof global.location === "undefined") {
        global.location = { href: "https://karinasang.github.io/" };
    }

    if (qrCodes.length === 0) {
        console.error("Failed to generate any QR codes");
        return false;
    }

    const mainUser = userGroup[0];

    const templateParams = {
        to_name: mainUser.firstName + " " + mainUser.lastName,
        to_email: mainUser.email,
        ticket_count: mainUser.ticketCount,
        ...qrCodes.reduce(
            (acc, code, index) => ({ ...acc, [`qr_code${index + 1}`]: code }),
            {}
        ),
    };

    try {
        const response = await emailjs.send(
            "service_48jph9s",
            "template_laqn78w",
            templateParams,
            {
                publicKey: "d0frZQtRg__lupUwd",
            }
        );
        console.log("Email successfully sent!", response);
        return true; // Email sent successfully
    } catch (error) {
        console.error("Failed to send email:", error);
        return false; // Email sending failed
    }
};
