import React from "react";
import { Modal, Portal, Text } from "react-native-paper";

export default function MyModal({ visible, message, onClose }) {
    const containerStyle = {backgroundColor: 'white', padding: 20, margin: 20};

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onClose} contentContainerStyle={containerStyle}>
                    <Text variant="titleLarge">{message}</Text>
            </Modal>
        </Portal>
    );
}
