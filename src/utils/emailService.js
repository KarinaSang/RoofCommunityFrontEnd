import axios from "axios";
import emailjs from "@emailjs/browser";

// Helper to clean base64 QR code
const cleanBase64 = (code) => {
    if (!code || typeof code !== 'string') return '';
    let cleaned = code.replace(/=3D/g, '=');
    cleaned = cleaned.replace(/\r?\n|\r/g, '');
    cleaned = cleaned.replace(/\s+/g, '');
    if (cleaned.startsWith('data:image/png;base64,')) {
        cleaned = cleaned.replace('data:image/png;base64,', '');
    }
    return cleaned;
};

export const generateAndFetchQRCode = async (user) => {
    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/generate`,
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


export const sendEmail = async (userOrGroup, qrCodesOrSingle) => {
    if (typeof global.location === "undefined") {
        global.location = { href: "https://karinasang.github.io/" };
    }

    // Normalize input
    let users = Array.isArray(userOrGroup) ? userOrGroup : [userOrGroup];
    let qrCodes = Array.isArray(qrCodesOrSingle) ? qrCodesOrSingle : [qrCodesOrSingle];

    // Only keep valid QR codes
    const validQRCodes = qrCodes.filter(code => typeof code === 'string' && code && code !== false);
    if (validQRCodes.length === 0) {
        console.error("Failed to generate any valid QR codes");
        return false;
    }

    const mainUser = users[0];

    // Prepare attachments and HTML referencing cids
    const attachments = validQRCodes.map((code, idx) => ({
        filename: `qrcode${idx + 1}.png`,
        content: cleanBase64(code),
        encoding: 'base64',
        contentType: 'image/png',
        cid: `qrcode${idx + 1}`
    }));

    const qrImagesHtml = attachments
        .map((att, idx) => `<img src='cid:qrcode${idx + 1}' alt='QR Code ${idx + 1}' style='margin:5px;' />`)
        .join("");

    const htmlContent = `
        <p>Hi ${mainUser.firstName} ${mainUser.lastName},</p>
        <p>Your ticket QR code${attachments.length > 1 ? 's are' : ' is'} below:</p>
        ${qrImagesHtml}
        <p>Have fun!</p>
    `;

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/send-email`,
            {
                to_name: mainUser.firstName + " " + mainUser.lastName,
                to_email: mainUser.email,
                attachments,
                html_content: htmlContent
            }
        );
        if (response.data.success) {
            console.log("Email successfully sent!", response.data);
            return true;
        } else {
            console.error("Failed to send email:", response.data.error);
            return false;
        }
    } catch (error) {
        console.error("Failed to send email:", error);
        return false; // Email sending failed
    }
};
