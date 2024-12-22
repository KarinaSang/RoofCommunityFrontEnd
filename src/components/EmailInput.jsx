import React, { useRef } from "react";
import MyTextInput from "./MyTextInput";

const EmailInput = ({ email, setEmail }) => {
    // Optional: useRef could be used if you need to manage focus or other direct input operations
    const inputRef = useRef(null);

    return (
        <MyTextInput
            onChangeText={setEmail}
            value={email}
            label="Email (Shared for All)"  // Assuming your MyTextInput component is designed to display a label
            ref={inputRef}  // Pass ref to manage focus if necessary in the future
            style={{ marginBottom: 20 }}
        />
    );
};

export default EmailInput;
