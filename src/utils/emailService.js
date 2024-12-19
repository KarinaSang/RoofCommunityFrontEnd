import axios from "axios";
import emailjs from "@emailjs/browser";
//import { uploadImageToImgBB } from "./qrHelper"; // Assuming qrHelper contains the ImgBB upload function

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
        
        return base64QRCode;
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
        console.error('Failed to generate QR code');
        return false;
    }

    const qrCodesPayload = {
        qr_code2: false,
        qr_code3: false,
        qr_code4: false,
        qr_code5: false,
        qr_code6: false,
        qr_code7: false,
        qr_code8: false,
        qr_code9: false,
        qr_code10: false,
    };

    const templateParams = {
        to_name: user.firstName + " " + user.lastName,
        to_email: user.email,
        ticket_count: user.ticketCount,
        qr_code1: qrCode,
        ...qrCodesPayload,
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
            "service_iezoxjs",
            "template_oallnpj",
            templateParams,
            {
                publicKey: "K457FRvU7kf6UNt5O",
            }
        );
        console.log("Email successfully sent!", response);
        return true; // Email sent successfully
    } catch (error) {
        console.error("Failed to send email:", error);
        return false; // Email sending failed
    }
};
