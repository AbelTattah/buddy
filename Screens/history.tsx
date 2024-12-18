import {
  Alert,
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlatList} from 'react-native';
import DocumentRenderer from '../Documents/DocumentRender';
import Icon from 'react-native-vector-icons/Ionicons';
import {userContext} from '../store/user';
import Colors from '../Components/constants/Colors';
import Header from '../Components/header';
import {useIsFocused} from '@react-navigation/native';

// Get book history from local storage
export const getHistory = async () => {
  try {
    const data: any = await AsyncStorage.getItem('history');
    // console.log("Book History",data);
    if (data == null) {
      await AsyncStorage.setItem('history', JSON.stringify({}));
      return AsyncStorage.getItem('history');
    }
    return data;
  } catch (error) {
    return Alert.alert('Error', 'An error occured');
  }
};

// Store book reference in local storage
export const addToHistory = async (doc: {
  name: string;
  endpoint: string;
  image: string;
}) => {
  try {
    const previous: any = await getHistory();
    const history = JSON.parse(previous);
    history[doc.name] = {
      endpoint: doc.endpoint,
      image: doc.image,
    };
    await AsyncStorage.setItem('history', JSON.stringify(history));
  } catch (error) {
    return Alert.alert('Error', 'An error occured');
  }
};

// Search for a particular book in local storage
export const searchHistory = async (name: string) => {
  try {
    const history: any = await getHistory();
    const parsed = JSON.parse(history);
    if (parsed[name]) {
      return parsed[name];
    } else {
      return 'None';
    }
  } catch (error) {
    return Alert.alert('Error', 'An error occured');
  }
};

// Remove a book from local storage
export const removeHistory = async (name: string) => {
  try {
    const history: any = await getHistory();
    const parsed = JSON.parse(history);
    if (parsed[name]) {
      delete parsed[name];
      await AsyncStorage.setItem('history', JSON.stringify(parsed));
    } else {
      return null;
    }
  } catch (error) {
    return Alert.alert('Error', 'An error occured');
  }
};

const Stack = createNativeStackNavigator();

// Main History Component
const HistMain = ({navigation}) => {
  const [history, setHistory] = useState<{}>({});
  const {setUrl, theme, downloads} = useContext(userContext);
  const isFocused = useIsFocused();

  async function Load() {
    await getHistory().then(data => {
      setHistory(JSON.parse(data));
    });
  }

  useEffect(() => {
    if (isFocused) {
      Load();
    }
  });

  return (
    <View
      style={[
        style.container,
        {
          backgroundColor: 'white',
        },
      ]}>
      <View style={style.top}></View>
      <View style={style.subContainer}>
        {Object.keys(history).length == 0 && <Text>No recent Resources</Text>}
        {history ? (
          <>
            <View
              style={[
                style.historyView,
                {
                  borderBottomColor:
                    theme == 'light' ? Colors.primary100 : Colors.primary200,
                },
              ]}>
              <Text
                style={{
                  color:
                    theme == 'light' ? Colors.primary100 : Colors.primary200,
                }}>
                Recents
              </Text>
              <Text
                style={{
                  color:
                    theme == 'light' ? Colors.primary100 : Colors.primary200,
                }}>
                Files {`(`}
                {Object.keys(history).length}
                {`)`}
              </Text>
            </View>
            <FlatList
              style={{
                width: '86%',
                flex: 1,
                backgroundColor: 'white',
              }}
              showsVerticalScrollIndicator={false}
              data={Object.keys(history).reverse()}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onLongPress={() => {
                      removeHistory(item);
                    }}
                    onPress={() => {
                      const url: any = searchHistory(item);
                      console.log('URL: ', history[item].endpoint);
                      setUrl(history[item].endpoint);
                      navigation.navigate('View', {book: item});
                    }}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      borderBottomWidth: 1,
                      borderColor: '#ddd',
                    }}>
                    <Image
                      source={{uri: history[item].image}}
                      style={{
                        marginTop: 10,
                        width: '26%',
                        height: "80%",
                        borderWidth: 0.5,
                        borderColor: '#ddd',
                        borderRadius: 10,
                      }}
                    />
                    <View style={style.button1}>
                      <Text
                        style={{
                          color:
                            theme == 'light'
                              ? Colors.primary100
                              : Colors.primary200,
                          fontSize: 16,
                          fontWeight: '500',
                          width: '70%',
                          padding: 10,
                        }}>
                        {item}
                      </Text>
                    </View>
                    <Icon
                      name="remove"
                      size={20}
                      color={
                        theme == 'light' ? Colors.primary100 : Colors.primary200
                      }
                      style={{
                        position: 'absolute',
                        right: 10,
                        top: 10,
                      }}
                      onPress={() => {
                        removeHistory(item);
                        ToastAndroid.show('Item Deleted', ToastAndroid.SHORT);
                      }}
                    />
                  </TouchableOpacity>
                );
              }}
              keyExtractor={item => item}
            />
          </>
        ) : (
          <Text
            style={{
              color: theme == 'light' ? Colors.primary100 : Colors.primary200,
            }}>
            No recent resource
          </Text>
        )}
      </View>
    </View>
  );
};

const History = ({navigation}) => {
  const {setPdf, theme} = useContext(userContext);
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{marginLeft: 20}}
          onPress={() => {
            navigation.openDrawer();
          }}>
          <Icon
            name="menu"
            size={30}
            color={"white"}
          />
        </TouchableOpacity>
      ),
      headerTitle: 'Downloads',
      headerTintColor: 'white',  
      headerStyle:{
        backgroundColor: Colors.primary300
      }
    
    });
  }, []);
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={HistMain}
          options={({navigation, route}: any) => {
            return {
              headerShadowVisible: false,
              headerShown: false,
            };
          }}
        />
        <Stack.Screen
          name="View"
          options={({route}) => {
            const title = route.params.book;
            return {
              title: title,
              headerShown: false,
            };
          }}
          component={DocumentRenderer}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default History;

const style = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
  subContainer: {
    height: '97%',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 20,
    right: 30,
    zIndex: 3,
    elevation: 2,
  },
  button1: {
    width: '80%',
    minHeight: 120,
    height: 'auto',
    paddingBottom: 20,
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  heading: {
    marginTop: 35,
    fontSize: 20,
    color: 'black',
    fontWeight: '500',
  },
  top: {
    width: '100%',
    margin: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 30,
    color: '#000',
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  historyView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    borderBottomWidth: 0.3,
    paddingBottom: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
});
