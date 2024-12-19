import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Button, IconButton, Surface } from "react-native-paper";
import MyTextInput from "./MyTextInput";

const UserInputList = ({ users, setUsers, scrollViewRef }) => {
    const screenWidth = Dimensions.get("window").width;

    const handleAddField = () => {
        if (users.length < 9) {
            setUsers([...users, { firstName: "", lastName: "" }]);
            setTimeout(() => {
                scrollViewRef.current.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    const handleRemoveField = (index) => {
        setUsers(users.filter((_, i) => i !== index));
    };

    const handleInputChange = (index, key, value) => {
        const updatedUsers = [...users];
        updatedUsers[index][key] = value;
        setUsers(updatedUsers);
    };

    return (
        <View>
            {users.map((user, index) => (
                <View key={index}>
                    {index > 0 && (
                        <IconButton
                            icon="minus-circle"
                            onPress={() => handleRemoveField(index)}
                            size={20}
                        />
                    )}
                    <Surface style={styles.surface} elevation={4}>
                        <MyTextInput
                            onChangeText={(value) =>
                                handleInputChange(index, "firstName", value)
                            }
                            text={user.firstName}
                            label={`First Name ${index + 1}`}
                            style={[
                                styles.input,
                                { width: screenWidth * 0.45 },
                            ]}
                        />
                        <MyTextInput
                            onChangeText={(value) =>
                                handleInputChange(index, "lastName", value)
                            }
                            text={user.lastName}
                            label={`Last Name ${index + 1}`}
                            style={[
                                styles.input,
                                { width: screenWidth * 0.45 },
                            ]}
                        />
                    </Surface>
                </View>
            ))}
            {users.length < 9 && (
                <Button
                    mode="outlined"
                    onPress={handleAddField}
                    style={styles.addButton}
                >
                    Add User
                </Button>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    userRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    input: {
        flex: 1, // Allows inputs to take equal space
    },
    addButton: {
        marginVertical: 10,
        width: "50%",
    },
});

export default UserInputList;
