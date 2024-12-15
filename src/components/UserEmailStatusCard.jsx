import React, { useState } from "react";
import { Card, Text } from "react-native-paper";
import { View } from "react-native";
import CustomDialog from "./CustomDialog"; // Custom dialog component
import SuccessModal from "./SuccessModal"; // Success modal component
import ErrorModal from "./ErrorModal"; // Error modal component
import { sendEmail, generateAndFetchQRCode } from "../utils/emailService";
import { doc, updateDoc } from "firebase/firestore";
import db from "../api/firebase";

const UserEmailStatusCard = ({ user }) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [emailSending, setEmailSending] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const getQrCodeStatus = () => {
        if (!user.emailStatus) {
            return "Email Not Sent ⛔";
        } else {
            return "Email Sent ✅";
        }
    };

    const handleSendEmail = async () => {
        setEmailSending(true);
        try {
            const qrCode = await generateAndFetchQRCode(user);
            const success = await sendEmail(user, qrCode); // Call the email sending function

            if (success) {
                // Update Firestore with the new emailStatus
                const userDocRef = doc(db, "users", user.id); // Use the user's Firestore document ID
                await updateDoc(userDocRef, { emailStatus: true });

                // Show success modal
                setSuccessModalVisible(true);
            } else {
                // Show error modal
                setErrorMessage("Failed to send email.");
                setErrorModalVisible(true);
            }
        } catch (error) {
            console.error(error);
            // Show error modal with details
            setErrorMessage("An error occurred while sending email.");
            setErrorModalVisible(true);
        } finally {
            setEmailSending(false);
            setDialogVisible(false);
        }
    };

    const showDialog = () => setDialogVisible(true);
    const hideDialog = () => setDialogVisible(false);

    const dialogButtons = [
        {
            label: "Send Email",
            onPress: handleSendEmail,
            mode: "contained",
            disabled: user.emailStatus || emailSending, // Disable if email already sent or in progress
        },
        {
            label: "Cancel",
            onPress: hideDialog,
            mode: "text",
        },
    ];

    return (
        <>
            {/* Clickable Card */}
            <Card style={{ marginBottom: "3%" }} onPress={showDialog}>
                <Card.Content>
                    <Text variant="titleLarge">
                        {user.firstName} {user.lastName}
                    </Text>
                    <Text variant="bodyMedium">Email: {user.email}</Text>
                    <Text variant="bodyMedium">Status: {getQrCodeStatus()}</Text>
                    {user.ticketId === 1 ? (
                        <Text variant="bodyMedium">
                            Party Size: {user.ticketCount}
                        </Text>
                    ) : (
                        <View />
                    )}
                </Card.Content>
            </Card>

            {/* Custom Dialog */}
            <CustomDialog
                visible={dialogVisible}
                title="Options"
                message={`What would you like to do for ${user.firstName} ${user.lastName}?`}
                onClose={hideDialog}
                buttons={dialogButtons}
            />

            {/* Success Modal */}
            <SuccessModal
                visible={successModalVisible}
                title="Success"
                message="Email sent successfully!"
                onClose={() => setSuccessModalVisible(false)}
            />

            {/* Error Modal */}
            <ErrorModal
                visible={errorModalVisible}
                title="Error"
                message={errorMessage}
                onClose={() => setErrorModalVisible(false)}
            />
        </>
    );
};

export default UserEmailStatusCard;
