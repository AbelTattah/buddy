import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext, useEffect} from 'react';
import {userContext} from '../store/user';
import Colors from './constants/Colors';

/**
 *  PrimaryInfoCard Component
 *
 * @param {string} name Name of the book
 * @param {string} date Date for the post
 * @param {string} image Image uri for the post
 * @returns {ReactNode} A React Native element that renders a Card
 */

interface PrimaryInfoCard {
  name: string;
  date: string;
  image: string;
  buttons: any;
  text: string;
  type: string;
  list: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}

// PrimaryInfoCard Component
function SecondaryInfoCard({
  name,
  date,
  image,
  text,
  buttons,
  type,
  list,
  onPress,
  onLongPress,
}: PrimaryInfoCard) {
  const {theme} = useContext(userContext);

  if (list) {
    return (
      <View
        style={[
          styles.container,
          {
            width: 200,
            backgroundColor:
              theme == 'light' ? Colors.primary200 : Colors.primary100,
          },
        ]}>
        <TouchableOpacity onLongPress={onLongPress} onPress={onPress}>
          <View style={[styles.middle, {height: image == '' ? '0%' : '75%'}]}>
            {image == '' || image == undefined || image == 'none' ? (
              <Text
                style={{
                  backgroundColor:
                    theme == 'light' ? Colors.primary100 : Colors.primary200,
                }}>
                No Preview available
              </Text>
            ) : (
              <Image style={styles.image} source={{uri: image}} />
            )}
          </View>
          <View style={styles.bottom}>
            <Text
              style={{
                fontSize: 15,
                width: '100%',
                height:"auto",
                color: theme == 'light' ? Colors.primary100 : Colors.primary200,
                fontFamily: 'Roboto',
                fontWeight: 'bold',
                marginBottom: 10,
              }}>
              {text}
            </Text>
            {buttons}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
      ]}>
      <TouchableOpacity onLongPress={onLongPress} onPress={onPress}>
        <View style={[styles.middle, {height: image == '' ? '0%' : '75%'}]}>
          {image == '' || image == undefined || image == 'none' ? (
            <Text>No Preview available</Text>
          ) : (
            <Image style={styles.image} source={{uri: image}} />
          )}
        </View>
        <View style={styles.bottom}>
          <Text
            style={{
              height: 40,
              fontSize: 15,
              width: '100%',
              color: theme == 'light' ? Colors.primary100 : Colors.primary200,
              fontFamily: 'Roboto',
              fontWeight: 'bold',
              marginBottom: 10,
              paddingBottom:20,
            }}>
            {text}
          </Text>
          {buttons}
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default SecondaryInfoCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    elevation:1,
    marginTop: 15,
    marginRight: 15,
    padding: 10,
    marginBottom: 20,
    minHeight: 300,
    paddingBottom:10,
    maxHeight:400,
    borderRadius:3
  },
  listView: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    borderStyle: 'solid',
    borderColor: 'gray',
    gap: 10,
    borderBottomWidth: 0.3,
  },
  listContainer: {
    width: '90%',
    marginTop: 15,
    height: 300,
  },
  top: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderStyle: 'solid',
    borderColor: 'gray',
    borderBottomWidth: 0.4,
    padding: 15,
    alignItems: 'center',
  },
  listTop: {
    height: 50,
    width: '100%',
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderStyle: 'solid',
    borderColor: 'gray',
    borderBottomWidth: 0.4,
    padding: 15,
    alignItems: 'center',
  },
  side: {
    width: '50%',
    justifyContent: 'flex-start',
    gap: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  listImage: {
    width: '80%',
    height: '70%',
    borderRadius: 10,
  },
  middle: {
    width: '100%',
    height: '70%',
    borderStyle: 'solid',
    alignItems: 'center',
    borderBottomWidth: 0.5,
  },
  listMiddle: {
    width: '50%',
    height: '100%',
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'gray',
    borderBottomWidth: 0.5,
  },
  bottom: {
    height: '30%',
    paddingBottom: 20,
    overflow: 'hidden',
    padding: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    
  },
});
