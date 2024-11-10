import {View, Text, StyleSheet, TouchableOpacity, Switch} from 'react-native';
import React, {useState, useContext} from 'react';
import {userContext} from '../../store/user';
import Colors from '../../Components/constants/Colors';

// User Preferences
export default function Preferences() {
  const {siv, setSiv, theme, statusBar, setStatusBar, setTheme} =
    useContext(userContext);
  const [isOneEnabled, setIsOneEnabled] = useState(false);
  const [isTwoEnabled, setIsTwoEnabled] = useState(
    theme == 'dark' ? true : false,
  );
  
  // Dark mode
  function activateDarkMode() {
    if (theme == 'dark') {
      setTheme('light');
      setIsTwoEnabled(false);
    } else {
      setTheme('dark');
      setIsTwoEnabled(true);
    }
  }
  
  // Hide Status bar of application
  function hideStatusBar() {
    if (statusBar) {
      setStatusBar(false);
      setSiv(false);
    } else {
      setStatusBar(true);
      setSiv(true);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          theme == 'light' ? Colors.primary200 : Colors.primary100,
        alignItems: 'center',
      }}>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button}>
          <Text
            style={[
              styles.option,
              {color: theme == 'light' ? Colors.primary100 : Colors.primary200},
            ]}>
           Full Screen
          </Text>
          <Switch value={statusBar} onValueChange={hideStatusBar} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text
            style={[
              styles.option,
              {color: theme == 'light' ? Colors.primary100 : Colors.primary200},
            ]}>
            Dark Theme
          </Text>
          <Text style={{color:Colors.primary100}}>Coming soon</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 28,
  },
  buttons: {
    marginTop: 30,
    gap:25,
    width: '87%',
  },
  buttonInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 20,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#999',
  },
  option: {
    fontSize: 15,
  },
  optionInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
  },
  optionSwitch: {
    marginRight: 20,
  },
  optionSwitchInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionSwitchText: {
    fontSize: 20,
  },
  optionSwitchSwitch: {
    marginRight: 20,
  },
});
