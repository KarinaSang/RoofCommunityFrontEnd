import React, { useState, useRef } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    ActivityIndicator,
    Text,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { Button } from "react-native-paper";
import UserInputList from "../components/UserInputList";
import EmailInput from "../components/EmailInput";
import MyModal from "../components/MyModal";
import { submitUsers } from "../utils/userService";

const AddUserScreen = () => {
    const [users, setUsers] = useState([{ firstName: "", lastName: "" }]);
    const [email, setEmail] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const scrollViewRef = useRef(null);

    const handleSubmit = async () => {
        setIsLoading(true); // Show spinner overlay
        const { success, message } = await submitUsers(users, email);
        setModalMessage(message);
        setModalVisible(true);
        setIsLoading(false); // Hide spinner overlay

        if (success) {
            setUsers([{ firstName: "", lastName: "" }]);
            setEmail("");
        }
    };

    return (
        <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
        <View style={styles.screenContainer}>
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.container}
            >
                <EmailInput email={email} setEmail={setEmail} />
                <UserInputList users={users} setUsers={setUsers} scrollViewRef={scrollViewRef}/>
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.submitButton}
                >
                    Submit
                </Button>
            </ScrollView>

            {/* Overlay Spinner */}
            {isLoading && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#6200EE" />
                    <Text style={styles.loadingText}>Processing...</Text>
                </View>
            )}

            <MyModal
                visible={modalVisible}
                message={modalMessage}
                onClose={() => setModalVisible(false)}
            />
        </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        marginTop: 50,
        padding: 20,
        justifyContent: "flex-start",
    },
    submitButton: {
        marginTop: 20,
        width: "50%",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
        zIndex: 1000, // Ensure it's on top of other components
    },
    loadingText: {
        marginTop: 10,
        color: "#FFF",
        fontSize: 16,
    },
});

export default AddUserScreen;
