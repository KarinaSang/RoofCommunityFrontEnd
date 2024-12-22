import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { ToggleButton, useTheme, Surface } from 'react-native-paper';

const SearchAndFilter = ({ searchQuery, setSearchQuery, filter, setFilter, itemCount }) => {
    const theme = useTheme();
    const styles = makeStyles(theme);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search by name or email"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <Surface style={styles.filterHeader}>
                <Text style={styles.countText}>{itemCount} users</Text>
                <ToggleButton.Row
                    onValueChange={setFilter}
                    value={filter}
                    style={styles.toggleButtonRow}
                >
                    <ToggleButton icon="account-group" value="all" />
                    <ToggleButton icon="check" value="checkedIn" />
                    <ToggleButton icon="close" value="notCheckedIn" />
                </ToggleButton.Row>
            </Surface>
        </View>
    );
};

const makeStyles = (theme) => ({
    container: {
        marginBottom: 20,
        marginTop: "10%",
    },
    searchBar: {
        borderColor: theme?.colors?.primary || "#6200ee",
        borderWidth: 1,
        padding: 12,
        borderRadius: 5,
        marginBottom: 10,
        fontSize: 16
    },
    filterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 2,
        elevation: 2,  // Adds a slight shadow for better visual separation
        backgroundColor: theme.colors.surface,  // Matches the theme's surface color
        borderRadius: 5,  // Consistent rounded corners with the search bar
    },
    countText: {
        fontSize: 16,
        color: theme.colors.primary,
        paddingLeft: "3%"
    },
    toggleButtonRow: {
        flexShrink: 1,  // Keeping the toggle buttons tightly together
    },
});

export default SearchAndFilter;
