import React, { useState, useRef } from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import SuccessModal from "../components/SuccessModal";
import ErrorModal from "../components/ErrorModal";
import { scanQR } from "../utils/qrHelper"; // Import the QR scanning logic
import { Button } from "react-native-paper";

export default function ScannerScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(true); // To differentiate between success and error modals
    const lastScannedTimestampRef = useRef(0);

    const handleBarCodeScanned = async ({ type, data }) => {
        const timestamp = Date.now();

        // Prevent scanning if loading or modal is visible
        if (
            loading ||
            modalVisible ||
            timestamp - lastScannedTimestampRef.current < 2000
        ) {
            return;
        }

        lastScannedTimestampRef.current = timestamp;
        console.log("NEW code scanned");

        setLoading(true);

        try {
            const message = await scanQR(JSON.parse(data)); // Assume data is JSON string
            console.log(message);
            setModalMessage(message);

            if (message === 'User not found') {
                setIsSuccess(false);
            } else {
                setIsSuccess(true);
            }
        } catch (error) {
            console.error("Scanning error:", error);
            setModalMessage("An error occurred during scanning");
            setIsSuccess(false); // Set as error message
        } finally {
            setLoading(false);
            setModalVisible(true); // Show modal after scan
        }
    };

    const closeModal = () => {
        setModalVisible(false);

        // Add a 2-second delay before allowing another scan
        lastScannedTimestampRef.current = Date.now() + 2000;
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
            {isSuccess ? (
                <SuccessModal
                    visible={modalVisible}
                    title="Scan Result"
                    message={modalMessage}
                    onClose={closeModal}
                />
            ) : (
                <ErrorModal
                    visible={modalVisible}
                    title="Scan Error"
                    message={modalMessage}
                    onClose={closeModal}
                />
            )}
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
