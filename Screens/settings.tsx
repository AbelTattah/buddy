import React, {useEffect, useState} from 'react'; // Importing components from react
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native'; // Importing components from react-native
import {userContext} from '../store/user';
import {useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import Preferences from './settings/preferences';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import About from './settings/about';
import Feedback from './settings/feedback';
import Icon from 'react-native-vector-icons/Ionicons';
import {getHistory} from './downloads';
import Header from '../Components/header';
import Colors from '../Components/constants/Colors';

const stack = createNativeStackNavigator();

// Settings page
export function Main({navigation}: any) {
  const context = useContext(userContext);
  const [clearing, setClearing] = useState(false);
  const {theme, setTheme} = useContext(userContext);

  async function activateDarkMode() {
    if (theme == 'dark') {
      setTheme('light');
      return;
    }
    setTheme('dark');
  }

  // Logout function
  function Logout() {
    context.setAuthState(false);
    AsyncStorage.removeItem('token');
  }

  // Render the page
  return (
    <View
      style={{
        backgroundColor:
          theme == 'light' ? Colors.primary200 : Colors.primary100,
        flex: 1,
        alignItems: 'center',
        paddingTop: 25,
      }}>
      <View
        style={{
          width: '90%',
          gap:25
        }}>
        <Text
          style={{
            fontSize: 25,
            marginBottom:10,
            fontWeight: 'bold',
            color: theme == 'light' ? Colors.primary100 : Colors.primary200,
          }}>
          Settings
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Preferences')}
          style={styles.button}>
          <Icon
            name="settings-outline"
            size={22}
            color={theme == 'light' ? Colors.primary100 : Colors.primary200}
          />
          <Text
            style={[
              styles.option,
              {color: theme == 'light' ? Colors.primary100 : Colors.primary200, marginLeft:20},
            ]}>
            Preferences
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Feedback')}
          style={styles.button}>
          <Icon
            name="send-outline"
            size={22}
            color={theme == 'light' ? Colors.primary100 : Colors.primary200}
          />
          <Text
            style={[
              styles.option,
              {color: theme == 'light' ? Colors.primary100 : Colors.primary200, marginLeft:20},
            ]}>
            Feedback
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('About')}
          style={[styles.button,{justifyContent:'flex-start'}]}>
                      <Icon
            name="information-outline"
            size={22}
            color={theme == 'light' ? Colors.primary100 : Colors.primary200}
          />
          <Text
            style={[
              styles.option,
              {color: theme == 'light' ? Colors.primary100 : Colors.primary200,marginLeft:20},
            ]}>
            About
          </Text>

        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            context.setAuthState(false);
            await AsyncStorage.removeItem('Data');
          }}
          style={[styles.button,{justifyContent:'flex-start'}]}>
            <Icon
            name="exit-outline"
            size={22}
            color={theme == 'light' ? Colors.primary100 : Colors.primary200}
          />
          <Text
            style={[
              styles.option,
              {color: theme == 'light' ? Colors.primary100 : Colors.primary200, marginLeft:20},
            ]}>
            Logout
          </Text>

        </TouchableOpacity>
      </View>
      <Text
        style={{
          position: 'absolute',
          bottom: 50,
          color: theme == 'light' ? Colors.primary100 : Colors.primary200,
        }}>
        Buddy v1.0
      </Text>
    </View>
  );
}

export default function Settings({navigation}: any) {
  const {theme} = useContext(userContext);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{marginLeft: 20}}
          onPress={() => navigation.openDrawer()}>
          <Icon
            name="menu"
            size={30}
            color={"white"}
          />
        </TouchableOpacity>
      ),
      headerStyle:{
        backgroundColor:Colors.primary300,
      },
      headerTintColor:"white"
    });
  },[]);
  return (
    <NavigationContainer independent={true}>
      <stack.Navigator>
        <stack.Screen
          name="Main"
          component={Main}
          options={{
            headerShown:false
          }}
        />
        <stack.Screen
          name="Preferences"
          options={{
            headerShown:false,
            header: () => (
              <Header
                title="Preferences"
                sub="Customize your app"
                button={<></>}
              />
            ),
          }}
          component={Preferences}
        />
        <stack.Screen
          name="About"
          options={{
            headerShown:false,
            header: () => (
              <Header title="About" sub="Learn more about us" button={<></>} />
            ),
          }}
          component={About}
        />
        <stack.Screen
          options={{
            headerShown:false,
            header: () => (
              <Header
                title="Feedback"
                sub="Report a bug or suggest a feature"
                button={<></>}
              />
            ),
          }}
          name="Feedback"
          component={Feedback}
        />
      </stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    height:40,
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth:0.5,
    borderBottomColor: '#999',
  },
  option: {
    fontSize: 18,
    fontWeight: '400',
  },
});
