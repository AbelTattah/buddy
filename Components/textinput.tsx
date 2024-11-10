import {TextInput, StyleSheet} from 'react-native';
import Colors from './constants/Colors';
import {useContext} from 'react';
import {userContext} from '../store/user';

/**
 *  Text Input Component
 *
 * @param {string} placeholder Text that is displayed before user enters a value
 * @returns {ReactNode} A React Native element that renders a Text Input Component
 */

interface PrimaryTextInput {
  placeholder: string;
  value:any;
  setter: (e: any) => {};
  onSubmitEditing?: () => any;
  email: boolean;
  inputMode: string;
  secure: boolean;
}


// PrimaryTextInput Component
export default function PrimaryTextInput({
  value,
  placeholder,
  setter,
  onSubmitEditing,
  secure,
  inputMode,
}: PrimaryTextInput) {
  const {theme} = useContext(userContext);

  return (
    <TextInput
      spellCheck={false}
      value={value}
      onChangeText={setter}
      onSubmitEditing={onSubmitEditing}
      secureTextEntry={secure}
      placeholderTextColor="black"
      placeholder={placeholder}
      style={[
        styles.main,
        {
          backgroundColor:
            theme == 'light' ? Colors.primary200 : Colors.primary100,
          color: theme == 'light' ? Colors.primary100 : Colors.primary200,
          borderBottomColor:
            theme == 'light' ? Colors.primary200 : Colors.primary100,
        },
      ]}></TextInput>
  );
}

const styles = StyleSheet.create({
  main: {
    width: '90%',
    height: 60,
    margin: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});
