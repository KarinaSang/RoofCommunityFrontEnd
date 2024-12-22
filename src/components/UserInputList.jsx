import React, { useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, Surface } from "react-native-paper";
import MyTextInput from "./MyTextInput";

const UserInputList = ({ users, setUsers }) => {
    const inputRefs = useRef([]);

    useEffect(() => {
        // Adjust the refs array to match the number of users
        inputRefs.current = inputRefs.current.slice(0, users.length);
        if (users.length > 0) {
            // Automatically focus the first name of the last added user
            setTimeout(() => {
                inputRefs.current[(users.length - 1) * 2]?.focus();
            }, 100);
        }
    }, [users]);

    const handleRemoveField = (index) => {
        setUsers(users.filter((_, i) => i !== index));
    };

    const handleInputChange = (index, key, value) => {
        const updatedUsers = [...users];
        updatedUsers[index][key] = value;
        setUsers(updatedUsers);
    };

    const handleFocus = (index) => {
        // Update the ref on focus to ensure it's pointing to the correct element
        inputRefs.current[index] = inputRefs.current[index] || {};
    };

    return (
        <View style={{ marginBottom: 10 }}>
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
                            ref={(el) => (inputRefs.current[index * 2] = el)}
                            onChangeText={(value) =>
                                handleInputChange(index, "firstName", value)
                            }
                            value={user.firstName}
                            label={`First Name ${index + 1}`}
                            style={styles.input}
                            onFocus={() => handleFocus(index)}
                        />
                        <MyTextInput
                            ref={(el) =>
                                (inputRefs.current[index * 2 + 1] = el)
                            }
                            onChangeText={(value) =>
                                handleInputChange(index, "lastName", value)
                            }
                            value={user.lastName}
                            label={`Last Name ${index + 1}`}
                            style={styles.input}
                            onFocus={() => handleFocus(index)}
                        />
                    </Surface>
                </View>
            ))}
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
