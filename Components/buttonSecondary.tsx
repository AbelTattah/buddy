import {TouchableOpacity, Text} from 'react-native';

/**
 * This is a secondary Button for the App
 *
 * @param {string} title The text that appears on the button
 * @param {CallableFunction} pressHandler  The size of the button: "big", "small" or "medium"
 * @returns {ReactNode} A React Native element that renders a button
 */

interface SecondaryButton {
  pressHandler: () => {};
  title: string;
}

// Secondary Button for the App
export const SecondaryButton = ({pressHandler, title}: SecondaryButton) => {
  return (
    <TouchableOpacity onPress={pressHandler}>
      <Text style={{color: 'white', fontSize: 13}}>{title}</Text>
    </TouchableOpacity>
  );
};
