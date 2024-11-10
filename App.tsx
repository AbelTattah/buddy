import "./gesturehandler"
import * as React from 'react'; // Importing components from react
import {NavigationContainer} from '@react-navigation/native'; // Importing the NavigationContainer from @react-navigation/native
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  Button,
  View,
  Text,
  Image,
  StatusBar,
  Alert,
  Appearance,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'; // Importing components from react-native
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'; // Importing the createBottomTabNavigator from @react-navigation/bottom-tabs

// Importing the styles from the styles file
import Settings from './Screens/settings';
// Rest of the import statements
//import Login from "./Screens/login";
// Importing the store from the redux store
//import Register from "./Screens/register";
//import { StatusBar } from "expo-status-bar";
import {useContext} from 'react';
import {userContext} from './store/user';
import UserContextProvider from './store/user';
import DocumentNav from './Documents/Document';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import Login from './Screens/login';
import Register from './Screens/register';
import Home from './Screens/Home';
import Icon from 'react-native-vector-icons/Ionicons';
import History from './Screens/history';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from './Components/constants/Colors';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Create a stack navigator
const Stack = createNativeStackNavigator();

// The constant below allows the usage of the tab navigator
const Tab = createBottomTabNavigator();

// Drawer Navigator
const Drawer = createDrawerNavigator();

// Main Application
function App1({navigation}: any) {
  const {isLoggedIn,setTheme, siv,setSiv, theme} = useContext(userContext);

  async function getColorScheme() {
    const colorScheme:any = await Appearance.getColorScheme()
    console.log("Theme: ",colorScheme)

    if (colorScheme=="dark") {
      setTheme("dark")
    }
    else {
      setTheme("light")
    }
  }

  async function getStatusBar() {
    const status = await AsyncStorage.getItem("status")

    if (status == "true") {
      setSiv(true)
    }
    else {
      setSiv(false)
    }
  }

  React.useEffect(()=>{
    getStatusBar()
    if(isLoggedIn==false){
      navigation.navigate("Login")
    }
  })

  if (isLoggedIn==false) {
    return (
      <View style={{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
      }}>
      <ActivityIndicator size="large" color={Colors.primary100} />
      </View>
    )
  }
  return (
    <>
      <StatusBar
        backgroundColor={theme == 'light' ? 'white' : 'black'}
        barStyle={theme == 'light' ? 'dark-content' : 'light-content'}
        hidden={siv}
      />
      {isLoggedIn ? (
        <NavigationContainer independent>
          <Drawer.Navigator screenOptions={{
            drawerActiveTintColor:Colors.primary300,
            drawerInactiveTintColor: 'white',
            drawerStyle: {
              paddingTop: 20,
              backgroundColor:Colors.primary300,
            },
            drawerActiveBackgroundColor:"white",
            drawerLabelStyle: {
              fontSize: 15,
            },
          }}>
            <Drawer.Screen
              component={Home}
              name="Home"
              options={{
                drawerIcon : ({focused,color}) => (
                  <Icon name="home-outline" size={25} color ={color} />
                ),
                drawerLabelStyle: {
                  fontSize: 15,
                  fontFamily: 'FredokaBold',
                },
                headerShadowVisible: false,
                headerTintColor: 'black',
                headerShown:false

              }}      
            />
            <Drawer.Screen
              component={History}
              name="Downloads"
              options={{
                drawerIcon: ({color}) => (
                  <Icon name="download" size={25} color={color} />
                ),
                drawerLabelStyle: {
                  fontSize: 15,
                  fontFamily: 'FredokaBold',
                },
                headerTitle:"Downloads",
                headerShadowVisible: false,
                headerTintColor: '#fff',
              }}
            />
            <Drawer.Screen
              name="Settings"
              component={Settings}
              options={{
                drawerIcon: ({color}) => (
                  <Icon name="settings-outline" size={25} color={color} />
                ),
                drawerLabelStyle: {
                  fontSize: 15,
                  fontFamily: 'FredokaBold',
                },
                headerShadowVisible: false,
              }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>You are not Logged in!</Text>
          <Button
            title="Login Screen"
            color={'#ccc'}
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      )}
    </>
  );
}

export default function App() {
  React.useEffect(() => {
    async function checkWrite() {
      check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
            Alert.alert(
              'Storage permissions',
              'You have to allow write storage permissions to use this app',
              [{text: 'Ok'}],
            );
            break;
          case RESULTS.DENIED:
            request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            break;
        }
      });
    }

    async function checkRead() {
      check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
            Alert.alert(
              'Storage permissions',
              'You have to allow read storage permissions to use this app',
              [{text: 'Ok'}],
            );
            break;
          case RESULTS.DENIED:
            request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            break;
        }
      });
    }

    checkRead();
    checkWrite();
  }, []);
  return (
    <UserContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown:false
            }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{title: '', headerShown: false}}
          />
          <Stack.Screen
            name="App1"
            component={App1}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContextProvider>
  );
}

/*
      TODO :
      1. Bottom Navigation     :Done
      2. Add swiping features that will enable user to navigate to other options.
*/
