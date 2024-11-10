import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useContext} from 'react';
import Colors from './constants/Colors';
import {userContext} from '../store/user';

/**
 *  Header Component
 *
 * @param {string} title title for the page header
 * @returns {ReactNode} A React Native element that renders a header
 */

interface Header {
  title: string;
  sub: string;
  button: any;
  top?: any;
}

// Header Component
function Header({title, sub, button}: Header) {
  const {theme} = useContext(userContext);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme == 'light' ? Colors.primary300 : Colors.primary200,
          borderBottomWidth: 0.3,
          borderBottomColor:
            theme == 'light' ? Colors.primary100 : Colors.primary200,
        },
      ]}>
      <View
        style={[
          styles.headerTop,
          {
            backgroundColor:
              theme == 'light' ? Colors.primary300 : Colors.primary200,
          },
        ]}>
        <Text
          style={[
            styles.headerSub,
            {
              color: theme == 'light' ? Colors.primary200 : Colors.primary100,
            },
          ]}>
          {sub}
        </Text>
        {button}
      </View>
      <Text
        style={[
          styles.headerMain,
          {
            color: theme == 'light' ? Colors.primary200 : Colors.primary100,
          },
        ]}>
        {title}
      </Text>
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: Colors.primary100,
    height: 75,
  },
  headerTop: {
    marginTop: 10,
    backgroundColor: Colors.primary100,
    flexDirection: 'row',
    width: '100%',
    height: 30,
    justifyContent: 'space-between',
  },
  headerSub: {
    color: 'white',
    fontSize: 15,
  },
  headerMain: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
