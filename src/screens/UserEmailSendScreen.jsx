import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { useTheme } from "react-native-paper";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import db from "../api/firebase";
import UserEmailStatusCard from "../components/UserEmailStatusCard";
import SuccessModal from "../components/SuccessModal";
import ErrorModal from "../components/ErrorModal";
import SearchAndFilter from "../components/SearchAndFilter";  // Make sure this path is correct

function UserEmailSendScreen() {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const theme = useTheme();
    const styles = makeStyles(theme);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("success"); // 'success' or 'error'

    useEffect(() => {
        const usersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"), orderBy("ticketId"));
        const unsubscribe = onSnapshot(usersQuery, (querySnapshot) => {
            const usersArray = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUsers(usersArray);
        });
        return () => unsubscribe();
    }, []);

    const handleSuccess = (message) => {
        setModalMessage(message);
        setModalType("success");
        setModalVisible(true);
    };

    const handleError = (message) => {
        setModalMessage(message);
        setModalType("error");
        setModalVisible(true);
    };

    const filteredUsers = users.filter(user => {
        const matchesFilter =
            (filter === "emailSent" && user.emailStatus) ||
            (filter === "emailNotSent" && !user.emailStatus) ||
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
                    <UserEmailStatusCard 
                        user={item} 
                        handleSuccess={handleSuccess} 
                        handleError={handleError} 
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

export default UserEmailSendScreen;
