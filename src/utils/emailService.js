import axios from "axios";
import emailjs from "@emailjs/browser";

export const generateAndFetchQRCode = async (user) => {
    try {
        const response = await axios.post(
            "https://roofcommunitybackend.onrender.com/api/generate",
            {
                firstName: user.firstName,
                lastName: user.lastName,
                id: user.userId,
            }
        ).catch(function (error) {
            if (error.response) {
                return error.response.data;
            }
        });

        const base64QRCode = response?.data?.qrCodeUrl;

        if (base64QRCode?.startsWith("data:image/png;base64,")) {
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

    // Embed QR code in HTML
    const htmlContent = `
        <p>Hello ${user.firstName} ${user.lastName},</p>
        <p>Your ticket QR code is below:</p>
        <img src='${qrCode}' alt='QR Code' />
        <p>Thank you for signing up!</p>
    `;

    const templateParams = {
        to_name: user.firstName + " " + user.lastName,
        to_email: user.email,
        ticket_count: 1,
        message_html: htmlContent
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

    // Embed multiple QR codes in HTML
    const qrImagesHtml = qrCodes
        .map((code, idx) => `<img src='${code}' alt='QR Code ${idx + 1}' style='margin:5px;' />`)
        .join("");

    const htmlContent = `
        <p>Hello ${mainUser.firstName} ${mainUser.lastName},</p>
        <p>Your ticket QR codes are below:</p>
        ${qrImagesHtml}
        <p>Thank you for signing up!</p>
    `;

    const templateParams = {
        to_name: mainUser.firstName + " " + mainUser.lastName,
        to_email: mainUser.email,
        ticket_count: mainUser.ticketCount,
        message_html: htmlContent
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
