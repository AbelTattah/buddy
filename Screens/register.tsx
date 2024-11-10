import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
} from 'react-native';
import {useState, useRef} from 'react'; // Importing the useState and useEffect component from react
// import {setDoc, doc} from 'firebase/firestore'; // Importing the setDoc and doc from firebase/firestore
// import {db} from '../firebase'; // Importing the db from the firebase
import {userContext} from '../store/user';
import {useContext} from 'react';
import {SaveInStorage} from './login';
import PrimaryButton from '../Components/buttonPrimary';
import PrimaryTextInput from '../Components/textinput';
import {NavigationProp} from '@react-navigation/native';
import Colors from '../Components/constants/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Register component
export default function Register({navigation}: any) {
  const [nameid, setNameid] = useState<string>(''); // Name state
  const [pass, setPass] = useState<string>(''); // Password state
  const [email, setEmail] = useState<string>(''); // Email state
  const [regg, setRegg] = useState<
    '' | 'succ' | 'inp' | 'prob' | 'rnd' | 'prob1' | 'prob2'
  >('rnd'); // Registration state

  const ref = useRef('textInput');
  const context = useContext(userContext);
  const [visible, setVisible] = useState<boolean>(false);

  // function to create user collection in firestore
  // async function createUserCollection() {
  //   try {
  //     // Add a new document in collection "users"
  //     const docRef = await setDoc(doc(db, 'users', `user/buddy/${email}`), {
  //       SNAME: nameid,
  //     });
  //     //console.log(docRef.response);
  //     console.log('Document written with ID: ', email);
  //   } catch (e) {
  //     console.error('Error adding document: ', e);
  //   }
  // }
  //  process.env.FIREBASE_KEY
  // function to sign up user
  async function signUp() {
    if (pass !== '' && email !== '') {
      setRegg('inp');
      await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
         "AIzaSyAtLBQsvvf6aUichyVdwoKg0Gqs6bx55jU",
        {
          method: 'POST',
          headers: {
            contentType: 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: pass,
            returnSecureToken: true,
          }),
        },
      )
        .then(response => response.json())
        .then(data => {
          if (data.error == undefined) {
          //  createUserCollection();
            setTimeout(() => {
              SaveInStorage(data, nameid);
              setRegg('succ');
              context.setAuthState(true);
              context.setName(nameid);
              this.textInput1.clear();
              setPass("")
              setEmail("")
              setNameid("")
            }, 3000);
            //Navigate to home screen
            setTimeout(() => {
              setEmail('');
              navigation.replace('App1');
            }, 4500);
          } else {
            Alert.alert('Error Signing Up', data.error.message, [
              {
                text: 'OK',
              },
            ]);
            setRegg('');
          }
        })
        .catch(error => {
          console.log(error.message);
          Alert.alert('Error Signing Up', error.message, [
            {
              text: 'OK',
            },
          ]);
          setRegg('');
        });
    } else {
      Alert.alert('Form', 'Form is incomplete', [
        {
          text: 'Ok',
        },
      ]);
    }
  }

  return (
    <View style={styles.container}>
      {regg === 'inp' ? (
        <>
          <Text style={{color: 'black'}}>
            <ActivityIndicator color="#2407f2" />
          </Text>
        </>
      ) : regg === 'prob' ? (
        <>
          <Text style={{color: 'black'}}>You have an account</Text>
        </>
      ) : regg === 'prob1' ? (
        <>
          <Text style={{color: 'black'}}>A Network error occured</Text>
        </>
      ) : regg === 'prob2' ? (
        <Text style={{color: 'black'}}>The form is not complete</Text>
      ) : regg === 'succ' ? (
        <>
          <Text style={{color: 'black'}}>Sign Up Succesful!</Text>
        </>
      ) : (
        <>
          <Text style={{color: 'black'}}></Text>
        </>
      )}

      <View style={styles.top}>
        <Text style={styles.bannerPrimary}>Sign Up for</Text>
      </View>
      <View style={styles.top}>
        <Text style={styles.bannerSecondary}>Free and Instant books</Text>
      </View>

      <KeyboardAvoidingView style={styles.main} behavior="padding">
        {/* Sign up inputs */}
        <PrimaryTextInput
          value={nameid}
          secure={false}
          email={false}
          inputMode="text"
          placeholder="    Full Legal Name"
          setter={async e => setNameid(e.replace(/\s+/g, ''))}
          onSubmitEditing={() => {
            signUp();
          }}
        />
        <PrimaryTextInput
          value={email}
          placeholder="    Email"
          secure={false}
          email={false}
          inputMode="text"
          setter={async e => setEmail(e.replace(/\s+/g, ''))}
          onSubmitEditing={() => {
            signUp();
          }}
        />
        <View style={styles.passWord}>
          <PrimaryTextInput
            value={pass}
            onSubmitEditing={signUp}
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
          size="big"
          pressHandler={() => signUp()}
          title="Sign Up"
        />
      </KeyboardAvoidingView>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text
          style={[
            styles.signup,
            {
              color: Colors.primary100,
            },
          ]}>
          Already a member? <Text style={styles.link}> Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor:"white",
    justifyContent: 'center',
    alignItems: 'center',
  },
  top: {
    width: '90%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  bannerPrimary: {
    borderRadius: 10,
    marginTop: 20,
    fontSize: 33,
    fontWeight: '800',
    color: 'black',
  },
  bannerSecondary: {
    marginBottom: 30,
    fontSize: 20,
    color: 'black',
  },
  signup: {
    marginTop: '20%',
  },
  link: {
    fontWeight: 'bold',
    color: Colors.primary100,
  },
  main: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  passWord: {
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
