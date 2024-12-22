import React, { forwardRef } from 'react';
import { TextInput } from "react-native-paper";

const MyTextInput = forwardRef((props, ref) => (
    <TextInput
        ref={ref}
        onChangeText={props.onChangeText}
        value={props.value}
        placeholder={props.label}
        style={props.style}
    />
));

export default MyTextInput;
