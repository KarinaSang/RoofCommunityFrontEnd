import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { useTheme } from "react-native-paper";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import db from "../api/firebase";
import UserScanStatusCard from "../components/UserScanStatusCard";
import SuccessModal from "../components/SuccessModal";
import ErrorModal from "../components/ErrorModal";
import SearchAndFilter from "../components/SearchAndFilter";

function UserCheckInScreen() {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const theme = useTheme();
    const styles = makeStyles(theme);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("success");

    useEffect(() => {
        const usersQuery = query(
            collection(db, "users"),
            orderBy("createdAt", "desc"),
            orderBy("ticketId")
        );
        const unsubscribe = onSnapshot(usersQuery, (querySnapshot) => {
            const usersArray = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUsers(usersArray);
        });

        return () => unsubscribe();
    }, []);

    const filteredUsers = users.filter((user) => {
        const matchesFilter =
            (filter === "checkedIn" && user.scannedStatus) ||
            (filter === "notCheckedIn" && !user.scannedStatus) ||
            filter === "all";
        const matchesSearch =
            user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <View style={styles.container}>
            <SearchAndFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filter={filter}
                setFilter={setFilter}
                itemCount={filteredUsers.length}
            />
            <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <UserScanStatusCard
                        user={item}
                        handleSuccess={() => {}}
                        handleError={() => {}}
                    />
                )}
            />
            {modalType === "success" ? (
                <SuccessModal
                    visible={modalVisible}
                    title="Success"
                    message={modalMessage}
                    onClose={() => setModalVisible(false)}
                />
            ) : (
                <ErrorModal
                    visible={modalVisible}
                    title="Error"
                    message={modalMessage}
                    onClose={() => setModalVisible(false)}
                />
            )}
        </View>
    );
}

const makeStyles = (theme) => ({
    container: {
        flex: 1,
        padding: 20,
    },
});

export default UserCheckInScreen;
