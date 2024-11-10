import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native'; // Importing components from react-native
import React, {useState, useContext, useEffect, useRef} from 'react'; // Importing the useState hook from react
import axios from 'axios'; // Importing axios

import {createNativeStackNavigator} from '@react-navigation/native-stack'; // Importing the createNativeStackNavigator from @react-navigation/stack
import {NavigationContainer} from '@react-navigation/native'; // Importing the NavigationContainer from @react-navigation/native
import {userContext} from '../store/user';
import {useWindowDimensions} from 'react-native';
import DocumentRender from './DocumentRender';
import PrimarySearch from '../Components/primarySearch';
import Detail from '../Screens/home/detail';
import Colors from '../Components/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/Ionicons"

/*
TODO: 

3. Previous Searches
*/

const Stack = createNativeStackNavigator();

var titlesCache: string[] = [];
var endpoints: string[] = [];
var images: string[] = [];

const addtoSearchHistory = async (name:string) => {
// Get initial search history from Async storage
  const getSearchHistory = async () => {
    try {
      const data: any = await AsyncStorage.getItem('searchHistory');
      if (data == null) {
        await AsyncStorage.setItem('searchHistory', JSON.stringify([]));
        return [];
      }
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  };

    try {
      const previous: any = await getSearchHistory();
      const history = previous;
      // Check whether the search history already contains the search term
      if (history.includes(name)) {
        return;
      }
      history.unshift(name);
      await AsyncStorage.setItem('searchHistory', JSON.stringify(history));
    } catch (error) {
      return;
    }

}

// Get search history from async storage
const getSearchHistory = async () => {
  try {
    const data: any = await AsyncStorage.getItem('searchHistory');
    if (data == null) {
      await AsyncStorage.setItem('searchHistory', JSON.stringify([]));
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Clear search history

const clearSearchHistory = async () => {
  try {
    await AsyncStorage.removeItem('searchHistory')
  } catch (error) {
    console.log(error)
  }
}

// Load fonts
const DocumentSearch = ({navigation}: any) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [titles, setTitles] = useState<any[]>([]);
  const [currentPdf, setCurrentPdf] = useState<string>('');
  const [userComms, setComms] = useState<string>('');
  const [searching, setSearching] = useState(false);
  const [noReslts, setNoResults] = useState(false);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const {theme, url, setUrl} = useContext(userContext);

  const [placeholder, setPlaceholder] = useState('Enter book name');
  const [placeholderColor, setPlaceholderColor] = useState('grey');

  const [error, setError] = useState(false);

  //Pdf regex http://207.211.176.165/buddy
  const test = /pdf/;

  const {width, height} = useWindowDimensions();

  // Get endpoints for getting pdfs from api
  async function getEndpoints(bookCode: string) {
    setNoResults(false);
    setSearching(true)
    setError(false);
    try {
      const response = await axios.post(
        'https://octopus-app-3-6xu4s.ondigitalocean.app/geturl',
        {
          keywords: bookCode,
        },
      );
      if (!response.data['titles'][0]) {
        setNoResults(true);
        setLoading(false);
        return;
      }
      // Filter pdf endpoints
      for (var v = 0; v < response.data.links.length; v++) {
        if (test.test(response.data.links[v])) {
          endpoints.push(response.data.links[v]);
          titlesCache.push(response.data.titles[v]);
          images.push(response.data.images[v]);
        }
      }
      setTitles(titlesCache);
      setLoading(false);
      setSearching(false);
    } catch (error) {
      setLoading(false);
      setError(true);
      setSearching(false);
    }
    setLoading(false);
  }

  // Search for past questions
  const searchHandler = (code:string) => {
    setSearching(true);
    addtoSearchHistory(code)
    setPlaceholder('Enter book name');
    setPlaceholderColor('grey');
    if (code == '') {
      setPlaceholder('Please enter a book name');
      setPlaceholderColor('red');
      return;
    } else {
      setLoading(true);
      setComms('');
      this.textInput.clear();
      setCode('');
      setTitles([]);
      titlesCache = [];
      endpoints = [];
      images = [];
      getEndpoints(code);
    }
  };

  // Navigate to pdf view
  const navigationHandler = () => {
    setTimeout(() => {
      if (titles[0] == 'Not found' || titles[0] == 'An error occured') {
        return;
      } else {
        navigation.navigate('DocumentView', {
          book: currentPdf,
        });
      }
    }, 1000);
  };

  useEffect(()=>{
    getSearchHistory().then(data=>{
      setSearchHistory(data)
    })
  })

  useEffect(()=>{
    getSearchHistory().then(data=>{
      setSearchHistory(data)
    })
  },[])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:
          theme == 'dark' ? Colors.primary100 : Colors.primary200,
      }}>

      <PrimarySearch
        handleSearch={()=>searchHandler(code)}
        textInput={
          <TextInput
            ref={input => {
              this.textInput = input;
            }}
            onSubmitEditing={() => {
              searchHandler(code);
            }}
            style={{
              height: '80%',
              width: '80%',

              padding: 10,
              color: theme == 'light' ? Colors.primary100 : Colors.primary200,
              backgroundColor:
                theme == 'light' ? Colors.primary200 : Colors.primary100,
            }}
            placeholderTextColor={placeholderColor}
            placeholder={placeholder}
            onChangeText={text => {
              setSearching(true)
              setCode(text);
            }}></TextInput>
        }
      />
      {
        // Previous searches
        searchHistory.length > 0 && searching==false && titles.length == 0 ? (
          <View
            style={{
              width: '90%',
              height: 'auto',
              maxHeight: 100,
              backgroundColor:
                theme == 'light' ? Colors.primary200 : Colors.primary100,
                marginBottom:10,
              borderColor:"#eee",
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              marginTop: 10,
            }}>
              <View style={{
                width:"100%",
                flexDirection:"row",
                justifyContent:"space-between"
              }}>
                            <Text
              style={{
                color:"black",
              }}>
              Previous Searches
            </Text>
            <TouchableOpacity onPress={async()=>{
              await clearSearchHistory()
            }}>
             <Icon name="close" size={30} color={"black"} />
            </TouchableOpacity>
                </View>

            <ScrollView
              horizontal
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: 50,
              }}>
              {
                searchHistory.length==0 && <Text>
                  No recent searches
                </Text>
              }
              {searchHistory.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={{
                    backgroundColor:"shite",
                    borderColor:"#eee",
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 5,
                    margin: 5,
                  }}
                  onPress={() => {
                    console.log(item)
                    setCode(item);
                    
                    searchHandler(item);
                  }}>
                  <Text
                    style={{
                      color:"black",
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : null
      }
      {

      }
      {
        noReslts==false &&       <Text
        style={[
          styles.resultsCount,
          {
            backgroundColor:
              theme == 'light' ? Colors.primary200 : Colors.primary100,
            color: theme == 'light' ? Colors.primary100 : Colors.primary200,
          },
        ]}>
        Results:
        {noReslts ? 'No results found' : titles.length}
      </Text>
      }

      <View
        style={{
          height: '80%',
          width: width < 320 ? 200 : width < 400 ? 300 : 350,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <>
          {noReslts ? (
            <Text
              style={{
                color: theme == 'light' ? Colors.primary100 : Colors.primary200,
                marginTop: 100,
              }}>
              No results found... Enter a different Search Keyword.
            </Text>
          ) : null}
        </>
        <>
          {error && <Text style={{color: 'red'}}>An error occured</Text>}
          {loading ? (
            <View
              style={{
                flex: 1,
                backgroundColor:
                  theme == 'light' ? Colors.primary200 : Colors.primary100,
                borderRadius: 20,
                padding: 10,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" />
              <Text>Searching for book...</Text>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                backgroundColor:
                  theme == 'light' ? Colors.primary200 : Colors.primary100,
                borderRadius: 20,
                flexDirection: 'column',
                gap: 20,
              }}>
              <ScrollView>
                {titles.map((title, i) => (
                  <TouchableOpacity
                    key={i}
                    style={{
                      width: width < 320 ? 160 : width < 400 ? 250 : 310,
                      height: 'auto',
                      maxHeight: 500,
                      backgroundColor:
                        theme == 'light'
                          ? Colors.primary200
                          : Colors.primary100,
                      borderColor:
                        theme == 'light'
                          ? Colors.primary100
                          : Colors.primary200,
                      elevation: 3,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflow: 'hidden',
                      margin: 10,
                      marginRight: 10,
                    }}
                    onPress={() => {
                      setUrl(endpoints[i]);
                      navigation.navigate('Detail', {
                        name: title,
                        image: images[i],
                        url: endpoints[i],
                      });
                    }}>
                    <Image
                      source={{uri: images[i]}}
                      style={{
                        width: width < 320 ? 160 : width < 400 ? 250 : 310,
                        height: '75%',
                        borderRadius: 10,
                        borderBottomRightRadius: 0,
                        borderBottomLeftRadius: 0,
                        marginBottom: 50,
                        marginTop: -5,
                      }}
                    />
                    <Text
                      style={{
                        textAlign: 'center',
                        width: '90%',
                        color:
                          theme == 'light'
                            ? Colors.primary100
                            : Colors.primary200,
                      }}>
                      {title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </>
      </View>
    </View>
  );
};

const DocumentNav = ({navigation}) => {
  const {theme} = useContext(userContext);
  return (
    <NavigationContainer independent>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor:
                theme == 'light' ? Colors.primary200 : Colors.primary100,
            },
            headerTintColor:
              theme == 'light' ? Colors.primary100 : Colors.primary200,
          }}
          component={DocumentSearch}
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
          component={DocumentRender}
        />
        <Stack.Screen
          name="Detail"
          options={({route}) => {
            const title = route.params.book;
            return {
              title: title,
              headerShown: false,
            };
          }}
          component={Detail}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default DocumentNav;

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    width: 300,
    height: 125,
    marginBottom: 20,
    position: 'absolute',
    top: -50,
    marginTop: -2,
    borderBottomWidth: 1,
  },
  searchButton: {
    marginTop: 80,
  },
  resultsCount: {
    marginLeft: 200,
  },
});
