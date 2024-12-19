import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, TextInput } from "react-native";
import { ToggleButton, useTheme } from "react-native-paper";
import {
    collection,
    onSnapshot,
} from "firebase/firestore";
import db from "../api/firebase";
import UserEmailStatusCard from "../components/UserEmailStatusCard";
import MyModal from "../components/MyModal";

function UserEmailSendScreen() {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("all"); // Filter state
    const [searchQuery, setSearchQuery] = useState(""); // Search state
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

        return () => unsubscribe();
    }, []);

    // Filter users based on filter criteria and search query
    const filteredUsers = users.filter((user) => {
        const matchesFilter =
            (filter === "emailSent" && user.emailStatus === true) ||
            (filter === "emailNotSent" && user.emailStatus === false) ||
            filter === "all";

        const matchesSearch =
            user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <TextInput
                style={styles.searchBar}
                placeholder="Search by name or email"
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
            />

            {/* Filter Toggle */}
            <View style={styles.filterContainer}>
                <ToggleButton.Row
                    onValueChange={(value) => setFilter(value)}
                    value={filter}
                >
                    <ToggleButton icon="account-group" value="all" />
                    <ToggleButton icon="check" value="emailSent" />
                    <ToggleButton icon="close" value="emailNotSent" />
                </ToggleButton.Row>
            </View>

            {/* User List */}
            <FlatList
                data={filteredUsers}
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

const makeStyles = (theme) => {
    const primaryColor = theme?.colors?.primary || "#6200ee"; // Default fallback color
    return StyleSheet.create({
        container: {
            flex: 1,
            marginTop: "20%",
            padding: 20,
        },
        searchBar: {
            borderColor: primaryColor, // Use the primary color from theme or fallback
            borderWidth: 1,
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
        },
        filterContainer: {
            flexDirection: "row",
            justifyContent: "space-around",
            marginBottom: 20,
        },
    });
};



export default UserEmailSendScreen;
