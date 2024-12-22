import React, { useState, useRef } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    ActivityIndicator,
    Text,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Button as PaperButton } from "react-native-paper";
import UserInputList from "../components/UserInputList";
import EmailInput from "../components/EmailInput";
import SuccessModal from "../components/SuccessModal";
import ErrorModal from "../components/ErrorModal";
import { submitUsers } from "../utils/userService";

const AddUserScreen = () => {
    const [users, setUsers] = useState([{ firstName: "", lastName: "" }]);
    const [email, setEmail] = useState("");
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleAddUser = () => {
        setUsers([...users, { firstName: "", lastName: "" }]);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const { success, message } = await submitUsers(users, email);
        setIsLoading(false);
        setModalMessage(message);

        if (success) {
            setSuccessModalVisible(true);
            setUsers([{ firstName: "", lastName: "" }]);
            setEmail("");
        } else {
            setErrorModalVisible(true);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.screenContainer}>
                <ScrollView contentContainerStyle={styles.container}>
                    <EmailInput email={email} setEmail={setEmail} />
                    <UserInputList users={users} setUsers={setUsers} />
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <PaperButton
                        mode="contained"
                        onPress={handleAddUser}
                        style={styles.addButton}
                    >
                        Add User
                    </PaperButton>
                    <PaperButton
                        mode="outlined"
                        onPress={handleSubmit}
                        style={styles.submitButton}
                    >
                        Submit
                    </PaperButton>
                </View>
                {isLoading && (
                    <View style={styles.overlay}>
                        <ActivityIndicator size="large" color="#6200EE" />
                        <Text style={styles.loadingText}>Processing...</Text>
                    </View>
                )}
                <SuccessModal
                    visible={successModalVisible}
                    title="Success"
                    message={modalMessage}
                    onClose={() => setSuccessModalVisible(false)}
                />
                <ErrorModal
                    visible={errorModalVisible}
                    title="Error"
                    message={modalMessage}
                    onClose={() => setErrorModalVisible(false)}
                />
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        marginTop: "10%",
        justifyContent: "space-between", // This ensures the footer stays at the bottom
    },
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: "flex-start",
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20, // Adds padding around the buttons for a better look
        borderTopWidth: 1, // Optional border for better visual separation
        borderColor: '#ccc', // Color for the border
    },
    addButton: {
        flex: 1,
        marginRight: 10,
    },
    submitButton: {
        flex: 1,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
    },
    loadingText: {
        color: "#FFF",
        fontSize: 16,
    },
});

export default AddUserScreen;
