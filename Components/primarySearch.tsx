import {View, Text, StyleSheet, TextInput} from 'react-native';
import React, {useContext, useState} from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import {userContext} from '../store/user';
import {Colors} from 'react-native/Libraries/NewAppScreen';

/**
 *  Primary Search Bar
 *
 * @param {CallableFunction}  handleSearch A callback function to handle search
 * @param {TextInput} textInput A TextInput component from React Native
 * @returns {ReactNode} A React Native element that renders a header
 */

const PrimarySearch = ({
  textInput,
  handleSearch,
}: {
  textInput: any;
  handleSearch: () => void;
}) => {
  const {theme} = useContext(userContext);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme == 'light' ? Colors.primary200 : Colors.primary100,
          borderColor: theme == 'light' ? Colors.primary100 : Colors.primary200,
        },
      ]}>
      <Icon
        style={styles.searchIcon}
        name="magnifying-glass"
        onPress={() => handleSearch()}
        size={30}
      />
      {textInput}
    </View>
  );
};

export default PrimarySearch;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:10,
    borderWidth: 0.3,
    width: '90%',
    marginBottom: 20,
    height: 50,
    borderRadius: 6,
    color: '#000',
    marginHorizontal: '9%',
  },
  searchIcon: {
    color: '#999',
    marginLeft: 5,
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: 30,
    color: '#000',
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  clear: {
    width: 50,
    height: 50,
  },
});
