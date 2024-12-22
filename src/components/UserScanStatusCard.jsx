import React, { useState } from "react";
import { Card, Text } from "react-native-paper";
import CustomDialog from "./CustomDialog";
import { doc, updateDoc } from "firebase/firestore";
import db from "../api/firebase";
import { getDateTime } from "../utils/qrHelper";

const UserScanStatusCard = ({ user, handleSuccess, handleError }) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [actionInProgress, setActionInProgress] = useState(false);

    const getQrCodeStatus = () => {
        return user.scannedStatus ? "Checked In ✅" : "Absent ⛔";
    };

    const handleCheckIn = async () => {
        setActionInProgress(true);
        try {
            const userDocRef = doc(db, "users", user.id);
            await updateDoc(userDocRef, {
                scannedStatus: true,
                scannedTime: getDateTime(),
            });
            handleSuccess("Checked in successfully!");
        } catch (error) {
            handleError("Failed to check in.");
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
            handleSuccess("Check-in undone successfully!");
        } catch (error) {
            handleError("Failed to undo check-in.");
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
            disabled: user.scannedStatus || actionInProgress,
        },
        {
            label: "Undo",
            onPress: handleUndo,
            mode: "contained",
            disabled: !user.scannedStatus || actionInProgress,
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
                        Status: {getQrCodeStatus()}
                    </Text>
                </Card.Content>
            </Card>
            <CustomDialog
                visible={dialogVisible}
                title="Options"
                message={`Manage check-in status for ${user.firstName} ${user.lastName}.`}
                onClose={hideDialog}
                buttons={dialogButtons}
            />
        </>
    );
};

export default UserScanStatusCard;
