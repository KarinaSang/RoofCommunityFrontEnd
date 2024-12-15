import React, { useState, useRef } from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import CustomDialog from "../components/CustomDialog"; // Import the new dialog component
import { scanQR } from "../utils/qrHelper"; // Import the QR scanning logic

export default function ScannerScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const lastScannedTimestampRef = useRef(0);

    const handleBarCodeScanned = async ({ type, data }) => {
        const timestamp = Date.now();

        // Prevent scanning if loading or dialog is visible
        if (loading || dialogVisible || timestamp - lastScannedTimestampRef.current < 2000) {
            return;
        }

        lastScannedTimestampRef.current = timestamp;
        console.log("NEW code scanned");

        setLoading(true);
        const user = JSON.parse(data);

        try {
            const message = await scanQR(user); // Call the helper function
            console.log(message);
            setDialogMessage(message);
        } catch (error) {
            setDialogMessage("An error occurred during scanning");
            console.error(error);
        } finally {
            setLoading(false);
            setDialogVisible(true); // Show dialog after scan
        }
    };

    const closeDialog = () => {
        setDialogVisible(false);

        // Add a 2-second delay before allowing another scan
        lastScannedTimestampRef.current = Date.now() + 2000; // Delay scanning by 2 seconds
    };

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text>We need your permission to show the camera</Text>
                <Button onPress={requestPermission}>Grant Permission</Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                autofocus="on"
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={handleBarCodeScanned}
            />
            {loading && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )}
            {/* Reusable Dialog */}
            <CustomDialog
                visible={dialogVisible}
                title="Scan Result"
                message={dialogMessage}
                onClose={closeDialog}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    camera: {
        width: "100%",
        height: "80%",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
});
