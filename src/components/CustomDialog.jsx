import React from "react";
import { Portal, Dialog, Button } from "react-native-paper";
import { StyleSheet, Text } from "react-native";

const CustomDialog = ({ visible, title, message, onClose, buttons = [] }) => {
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onClose}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Content>
                    <Text style={styles.messageText}>{message}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    {/* Render multiple buttons */}
                    {buttons.map((button, index) => (
                        <Button
                            key={index}
                            onPress={button.onPress}
                            style={styles.button}
                            mode={button.mode || "text"}
                            disabled={button.disabled}
                        >
                            {button.label}
                        </Button>
                    ))}
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    messageText: {
        fontSize: 16,
    },
    button: {
        marginHorizontal: 5,
    },
});

export default CustomDialog;
