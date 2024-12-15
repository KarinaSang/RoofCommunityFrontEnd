import React from "react";
import MyTextInput from "./MyTextInput";

const EmailInput = ({ email, setEmail }) => {
    return (
        <MyTextInput
            onChangeText={setEmail}
            text={email}
            label="Email (Shared for All)"
            style={{ marginBottom: 20 }}
        />
    );
};

export default EmailInput;
