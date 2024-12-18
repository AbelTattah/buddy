import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native'; // Importing components from react-native
import {useEffect, useState, useLayoutEffect} from 'react'; // Importing the useEffect and useState component from react
// import {db} from '../firebase'; // Importing the db from the firebase
// import {doc, getDoc, setDoc} from 'firebase/firestore'; // Importing the doc and getDoc from firebase/firestore
import {userContext} from '../store/user';
import {useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../Components/constants/Colors';
import PrimaryButton from '../Components/buttonPrimary';
import PrimaryTextInput from '../Components/textinput';
import {
  statusCodes,
  isErrorWithCode,
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/MaterialIcons';

GoogleSignin.configure();

export async function SaveInStorage(data: any, name: any) {
  try {
    await AsyncStorage.setItem(
      'Data',
      JSON.stringify({data: data, name: name}),
    );
  } catch (error) {
    console.log(error);
  }
}

// Login component
export default function Login({navigation}: any) {
  const [emaill, setEmaill] = useState<string>(''); // Email state
  const [pass, setPass] = useState<string>(''); // Password state
  const [suds, setSuds] = useState<any>({}); // User data state
  const [checking, setChecking] = useState(true);
  const context = useContext(userContext);
  const [regg, setRegg] = useState<
    '' | 'succ' | 'inp' | 'prob' | 'rnd' | 'prob1' | 'prob2'
  >('rnd'); // Registration state

  const [visible, setVisible] = useState<boolean>(false);

  // Sign in function
  async function signIn() {
    if (emaill !== '' && pass !== '') {
      setRegg('inp');
      await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
        "AIzaSyAtLBQsvvf6aUichyVdwoKg0Gqs6bx55jU",
        {
          method: 'POST',
          headers: {
            'content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emaill,
            password: pass,
            returnSecureToken: true,
          }),
        },
      )
        .then(response => response.json())
        .then(data => {
          if (data.error == undefined) {
            SaveInStorage(data, suds['SNAME']);
            context.setAuthState(true);
            context.setName(suds['SNAME']);
            setRegg('succ');
            navigation.navigate('App1');
            setPass("")
            setEmaill("")
          } else {
            setRegg('rnd');
            Alert.alert('Error', `${data.error.message}`, [
              {
                text: 'Ok',
              },
            ]);
          }
        })
        .catch(error => {
          setRegg('rnd');
          Alert.alert('Error', error.message, [
            {
              text: 'Ok',
            },
          ]);
        });
    } else {
      Alert.alert('Form', 'Form is not complete', [
        {
          text: 'OK',
        },
      ]);
    }
  }

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // Attempt to sign in
      try {
        SaveInStorage(userInfo, userInfo.user.name);
        context.setAuthState(true);
        context.setName(userInfo.user.name);
        setRegg('succ');
        navigation.replace('App1');
      } catch (error) {}
    } catch (error) {
      Alert.alert('Error', error.message, [
        {
          text: 'Ok',
        },
      ]);
    }
  };

  // function to read user data from firestore
  // async function DataRead() {
  //   // Get user data from firestore
  //   const docRef = doc(db, `users/user/buddy/${emaill}`);
  //   const docSnap = await getDoc(docRef);
  //   // Check if user data exists and set user data state
  //   if (docSnap.exists()) {
  //     setSuds(docSnap.data());
  //     console.log(suds);
  //   } else {
  //     // docSnap.data() will be undefined in this case
  //     console.log('No such document!');
  //   }
  // }

  useEffect(() => {
    // Get user data from firestore
    // DataRead();
  }, [emaill]);

  useEffect(() => {
    async function autoLogin() {
      try {
        //Check whether key is available in storage
        const response = await AsyncStorage.getItem('Data');
        console.log('Data', response);
        if (response == null) {
          console.log(response);
        } else {
          navigation.replace('App1');
          let name = JSON.parse(response).name;
          context.setName(name);
          context.setAuthState(true);
        }
      } catch (error) {
        //Do nothing
      }
      setTimeout(() => {
        setChecking(false);
      }, 2000);
    }
    autoLogin();
  });

  if (checking) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <ActivityIndicator size={53} color={Colors.secondary200} />
      </View>
    );
  }

  // Render the page
  return (
    <View style={styles.container}>
      <>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        {regg === 'inp' ? (
          <>
            <ActivityIndicator color="#2407f2" />
          </>
        ) : regg === 'prob' ? (
          <>
            <Text style={{color: 'black'}}>Wrong email or password!</Text>
          </>
        ) : regg === 'succ' ? (
          <>
            <Text style={{color: 'black'}}>Log In Succesful</Text>
          </>
        ) : (
          <>
            <Text style={{color: 'black'}}>Buddy v.1.0</Text>
          </>
        )}
        <PrimaryTextInput
          value={emaill}
          onSubmitEditing={signIn}
          secure={false}
          email={false}
          inputMode="text"
          placeholder="   Enter your Email"
          setter={async e => setEmaill(e.replace(/\s+/g, ''))}
        />
        <View style={styles.password}>
          <PrimaryTextInput
            value={pass}
            onSubmitEditing={signIn}
            secure={!visible}
            email={false}
            inputMode="text"
            placeholder="Enter your password"
            setter={async e => setPass(e.replace(/\s+/g, ''))}
          />
          <Text
            style={{
              marginRight: 10,
            }}>
            {visible ? (
              <Icon
                onPress={() => setVisible(false)}
                name="visibility"
                size={22}
                color="#999"
              />
            ) : (
              <Icon
                onPress={() => setVisible(true)}
                name="visibility-off"
                size={22}
                color="#999"
              />
            )}
          </Text>
        </View>

        <PrimaryButton
          radius={10}
          title="Login"
          size="big"
          pressHandler={async () => {
            signIn();
          }}
        />
        <TouchableOpacity onPress={googleSignIn} style={styles.google}>
          <Image
            source={require('../assets/google.png')}
            style={{width: 25, height: 25}}
          />
        </TouchableOpacity> 
      </>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text
          style={[
            styles.signup,
            {
              color: Colors.primary100,
            },
          ]}>
          Not a member? <Text style={styles.link}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"white",
    alignItems: 'center',
  },
  google: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary200,
    padding: 5,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
  },
  signup: {
    marginTop: '10%',
  },
  link: {
    fontWeight: 'bold',
    color: Colors.primary100,
  },
  logo: {
    width: '100%',
    height: '40%',
    marginBottom: 30,
  },
  password: {
    width: '90%',
    height: 60,
    margin: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});
