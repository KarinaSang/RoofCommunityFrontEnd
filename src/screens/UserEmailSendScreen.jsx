import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    onSnapshot,
} from "firebase/firestore";
import db from "../api/firebase";
import { sendEmail } from "../utils/emailService";
import { useTheme } from "react-native-paper";
import UserEmailStatusCard from "../components/UserEmailStatusCard";
import MyModal from "../components/MyModal";

function UserEmailSendScreen() {
    const [users, setUsers] = useState([]);
    const theme = useTheme();
    const styles = makeStyles(theme);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "users"),
            (querySnapshot) => {
                const usersArray = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(usersArray);
            }
        );

        return () => unsubscribe(); // Detach listener when the component unmounts
    }, []);


    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <UserEmailStatusCard user={item} />}
            />
            <MyModal
                visible={modalVisible}
                message={modalMessage}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
}

const makeStyles = ({ theme }) =>
    StyleSheet.create({
        container: {
            flex: 1,
            marginTop: "20%",
            padding: 20,
        },
        button: {
            width: "50%",
            marginBottom: 20,
        },
    });

export default UserEmailSendScreen;
