import { TextInput } from "react-native-paper";

const MyTextInput = ({ label, text, onChangeText }) => {
    return (
        <TextInput
            label={label}
            value={text}
            onChangeText={onChangeText}
            style = {{marginBottom: 20,}}
        />
    );
};

export default MyTextInput;
