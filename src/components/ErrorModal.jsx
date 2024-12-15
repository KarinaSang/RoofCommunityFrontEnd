import React from "react";
import { Portal, Dialog, Button } from "react-native-paper";
import { Text, StyleSheet } from "react-native";

const ErrorModal = ({ visible, title, message, onClose }) => {
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onClose}>
                <Dialog.Title style={styles.errorTitle}>{title}</Dialog.Title>
                <Dialog.Content>
                    <Text style={styles.messageText}>{message}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onClose}>OK</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    errorTitle: {
        color: "red", // Red color for error
        fontWeight: "bold",
    },
    messageText: {
        fontSize: 16,
    },
});

export default ErrorModal;
