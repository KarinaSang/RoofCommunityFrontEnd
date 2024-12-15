// src/MainTabNavigator.js
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import UserCheckInScreen from "../screens/UserCheckInScreen";
import UserEmailSendScreen from "../screens/UserEmailSendScreen";
import ScannerScreen from "../screens/ScannerScreen";
import AddUserScreen from "../screens/AddUserScreen";

const Tab = createMaterialTopTabNavigator();

function MainTabNavigator() {
    return (
        <Tab.Navigator
            tabBarPosition="bottom"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "UserCheckInScreen") {
                        iconName = focused
                            ? "people"
                            : "people-outline";
                    } else if (route.name === "UserEmailSendScreen") {
                        iconName = focused ? "person-add" : "person-add-outline";
                    } else if (route.name === "AddUser") {
                        iconName = focused ? "person-add" : "person-add-outline";
                    } else if (route.name === "Scanner") {
                      iconName = focused ? "scan-circle" : "scan-circle-outline";
                    }

                    // You can return any component that you like here!
                    return (
                        <Ionicons name={iconName} size={size} color={color} />
                    );
                },
                tabBarActiveTintColor: "purple",
                tabBarInactiveTintColor: "gray",
            })}
        >
            <Tab.Screen
                name="UserCheckInScreen"
                component={UserCheckInScreen}
                options={{ title: "Check In" }}
            />
            <Tab.Screen
                name="UserEmailSendScreen"
                component={UserEmailSendScreen}
                options={{ title: "Send Ticket" }}
            />
            <Tab.Screen
                name="AddUser"
                component={AddUserScreen}
                options={{ title: "Add User" }}
            />
            <Tab.Screen
                name="Scanner"
                component={ScannerScreen}
                options={{ title: "Scanner" }}
            />
        </Tab.Navigator>
    );
}

export default MainTabNavigator;
