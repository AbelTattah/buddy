import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';
import {userContext} from '../store/user';
import Colors from './constants/Colors';

/**
 * This is a button for displaying Genres
 *
 * @param {string} genre The genre of books
 * @param {CallableFunction} search  Search function
 * @param {number} Icon The icon on the button
 * @returns {ReactNode} A React Native element that renders a button
 */

interface GenreButton {
  genre: string;
  search: () => any;
  Icon: any;
}

// GenreButton Component
const GenreButton = ({genre, search, Icon}: GenreButton) => {
  const {theme} = useContext(userContext);

  return (
    <TouchableOpacity onPress={search}>
      <View
        style={[
          styles.genreMain,
          {
            borderColor:
              theme == 'light' ? Colors.primary100 : Colors.primary200,
            backgroundColor:
              theme == 'light' ? Colors.primary200 : Colors.primary100,
          },
        ]}>
        <Text
          style={[
            styles.text,
            {
              color: theme == 'light' ? Colors.primary100 : Colors.primary200,
            },
          ]}>
          {genre}
        </Text>
        <>{Icon}</>
      </View>
    </TouchableOpacity>
  );
};

export default GenreButton;

const styles = StyleSheet.create({
  genreMain: {
    height: 40,
    justifyContent: 'center',
    marginRight: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 0.2,
    elevation: 2,
    width: 150,
    padding: 4,
    borderRadius: 20,
  },
  text: {
    fontWeight: '700',
    fontSize: 15,
    width: '50%',
    marginRight: 20,
  },
});
