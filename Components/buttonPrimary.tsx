import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Colors from './constants/Colors';

/**
 * This is a primary Button for the App
 *
 * @param {string} title The text that appears on the button
 * @param {string} size  The size of the button: "big", "small" or "medium"
 * @param {number} raduis The border Radius of the button
 * @returns {ReactNode} A React Native element that renders a button
 */

interface PrimaryButton {
  title: string;
  size: 'big' | 'small' | '';
  radius: number;
  pressHandler: () => {};
}

// Primary button Component for the App
const PrimaryButton = ({title, size, radius, pressHandler}: PrimaryButton) => {
  return (
    <TouchableOpacity
      style={{
        width: size == 'big' ? '90%' : size == 'small' ? '70%' : 90,
        height: size == 'big' ? 50 : size == 'small' ? 40 : 35,
        backgroundColor: Colors.primary300,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10 || radius,
        margin: 20,
      }}
      onPress={pressHandler}>
      <Text
        style={{
          color: 'white',
          fontSize: 20,
          fontWeight: 'bold',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
