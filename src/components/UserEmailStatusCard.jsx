import React from "react";
import { Card, Text } from "react-native-paper";
import CustomDialog from "./CustomDialog";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import db from "../api/firebase";
import { generateAndFetchQRCode, sendEmail } from "../utils/emailService";

const UserEmailStatusCard = ({ user, handleSuccess, handleError }) => {
    const [dialogVisible, setDialogVisible] = React.useState(false);
    const [emailSending, setEmailSending] = React.useState(false);

    const handleSendEmail = async () => {
        setEmailSending(true);
        try {
            const qrCode = await generateAndFetchQRCode(user);
            const success = await sendEmail(user, qrCode);
            if (success) {
                const userDocRef = doc(db, "users", user.id);
                await updateDoc(userDocRef, { emailStatus: true });
                handleSuccess("Email successfully sent!");
            } else {
                handleError("Failed to send email.");
            }
        } catch (error) {
            handleError("An error occurred while sending email.");
        } finally {
            setEmailSending(false);
            setDialogVisible(false);
        }
    };

    const handleRemoveUser = async () => {
        try {
            const userDocRef = doc(db, "users", user.id);
            await deleteDoc(userDocRef);
            handleSuccess("User removed successfully!");
        } catch (error) {
            handleError("An error occurred while removing the user.");
        } finally {
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
            disabled: user.emailStatus || emailSending,
        },
        {
            label: "Remove User",
            onPress: handleRemoveUser,
            mode: "contained",
        },
        {
            label: "Cancel",
            onPress: hideDialog,
            mode: "text",
        },
    ];

    return (
        <>
            <Card style={{ marginBottom: "3%" }} onPress={showDialog}>
                <Card.Content>
                    <Text variant="titleLarge">
                        {user.firstName} {user.lastName}
                    </Text>
                    <Text variant="bodyMedium">Email: {user.email}</Text>
                    <Text variant="bodyMedium">
                        Status:{" "}
                        {user.emailStatus
                            ? "Email Sent ✅"
                            : "Email Not Sent ⛔"}
                    </Text>
                    {user.ticketId === 1 && (
                        <Text variant="bodyMedium">
                            Party Size: {user.ticketCount}
                        </Text>
                    )}
                </Card.Content>
            </Card>
            <CustomDialog
                visible={dialogVisible}
                title="Options"
                message={`What would you like to do for ${user.firstName} ${user.lastName}?`}
                onClose={hideDialog}
                buttons={dialogButtons}
            />
        </>
    );
};

export default UserEmailStatusCard;
