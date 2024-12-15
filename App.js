import React, { useState, useEffect } from "react";
import { PaperProvider, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";

const { LightTheme } = adaptNavigationTheme({ reactNavigationLight: DefaultTheme });

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Assume a function that checks token or auth state
    useEffect(() => {
        // Check for authentication token or logic here
        // setIsLoggedIn(true) if token is valid
    }, []);

    return (
        <PaperProvider theme={MD3LightTheme}>
            <NavigationContainer theme={LightTheme}>
                <AppNavigator
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                />
            </NavigationContainer>
        </PaperProvider>
    );
}
