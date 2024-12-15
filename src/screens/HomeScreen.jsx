import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { Button, Text } from "react-native-paper";

const HomeScreen = ({ navigation }) => {
    const [input, setInput] = useState("");
    const theme = useTheme();
    const styles = makeStyles(theme);

    const handleLogin = () => {
        if (input === "roof") {
            // Assuming `navigation` prop is passed down to this component correctly
            navigation.navigate("MainTabs");
        } else {
            alert("Incorrect Password");
        }
    };

    return (
        <View style={styles.container}>
          <Text variant="titleLarge" style={styles.title}>Welcome, Roof Community Admin</Text>
            <TextInput
                style={styles.input}
                onChangeText={setInput}
                value={input}
                placeholder="Enter password"
                secureTextEntry // Mask the input for password entry
            />
            <Button mode="contained" onPress={handleLogin}>LOGIN</Button>
        </View>
    );
};

const makeStyles = ({ theme }) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
        },
        input: {
            height: 60,
            width: "100%",
            marginVertical: 12,
            marginBottom: 30,
            borderWidth: 1,
            padding: 10,
            fontSize: 20,
        },
        title: {
          marginBottom: 50
        }
    });

export default HomeScreen;
