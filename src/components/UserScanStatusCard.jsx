import React, { useState } from "react";
import { Card, Text } from "react-native-paper";
import { View } from "react-native";
import CustomDialog from "./CustomDialog"; // Import your CustomDialog component
import SuccessModal from "./SuccessModal"; // Success modal component
import ErrorModal from "./ErrorModal"; // Error modal component
import { doc, updateDoc } from "firebase/firestore";
import db from "../api/firebase";
import { getDateTime } from "../utils/qrHelper";

const UserEmailStatusCard = ({ user }) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [actionInProgress, setActionInProgress] = useState(false); // Disable buttons during updates
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const getQrCodeStatus = () => {
        if (!user.scannedStatus) {
            return "Absent ⛔";
        } else {
            return "Checked In ✅";
        }
    };

    const handleCheckIn = async () => {
        setActionInProgress(true);
        try {
            const userDocRef = doc(db, "users", user.id);
            await updateDoc(userDocRef, { scannedStatus: true, scannedTime: getDateTime()});
            user.scannedStatus = true; // Update local state to reflect the change
            setSuccessModalVisible(true); // Show success modal
        } catch (error) {
            console.error("Error checking in:", error);
            setErrorMessage("Failed to check in.");
            setErrorModalVisible(true); // Show error modal
        } finally {
            setActionInProgress(false);
            setDialogVisible(false);
        }
    };

    const handleUndo = async () => {
        setActionInProgress(true);
        try {
            const userDocRef = doc(db, "users", user.id);
            await updateDoc(userDocRef, { scannedStatus: false });
            user.scannedStatus = false; // Update local state to reflect the change
            setSuccessModalVisible(true); // Show success modal
        } catch (error) {
            console.error("Error undoing check-in:", error);
            setErrorMessage("Failed to undo check-in.");
            setErrorModalVisible(true); // Show error modal
        } finally {
            setActionInProgress(false);
            setDialogVisible(false);
        }
    };

    const showDialog = () => setDialogVisible(true);
    const hideDialog = () => setDialogVisible(false);

    const dialogButtons = [
        {
            label: "Check In",
            onPress: handleCheckIn,
            mode: "contained",
            disabled: user.scannedStatus || actionInProgress, // Disable if already checked in or action in progress
        },
        {
            label: "Undo",
            onPress: handleUndo,
            mode: "contained",
            disabled: !user.scannedStatus || actionInProgress, // Disable if not checked in or action in progress
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
                </Card.Content>
            </Card>

            {/* Custom Dialog */}
            <CustomDialog
                visible={dialogVisible}
                title="Options"
                message={`Manage check-in status for ${user.firstName} ${user.lastName}.`}
                onClose={hideDialog}
                buttons={dialogButtons}
            />

            {/* Success Modal */}
            <SuccessModal
                visible={successModalVisible}
                title="Success"
                message="Action completed successfully!"
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
