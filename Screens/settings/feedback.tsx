import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useContext} from 'react';
import {TouchableOpacity} from 'react-native';
// import {doc} from 'firebase/firestore';
// import {setDoc} from 'firebase/firestore';
// import {db} from '../../firebase';
import {userContext} from '../../store/user';
import Colors from '../../Components/constants/Colors';

// Component for collecting user feedback
const Feedback = () => {
  const [emotion, setEmotion] = useState<string>('');
  const [suggestion, setSuggestion] = useState<string>();
  const [opacites, setOpacities] = useState<any[]>([1, 1, 1, 1]);
  
  const {theme, name} = useContext(userContext);
  const [sending, setSending] = useState(false);
  
  // Set emoji opacities
  function setOpacity(indexx: number) {
    setOpacities(previous =>
      previous.map((item, index) => {
        if (indexx !== index) {
          return 0.2;
        } else {
          return 1;
        }
      }),
    );
  }

  // Send user fendback to backend(firebase)
  async function sendFeedback() {
    setSending(true);
    try {
      // const docRef = await setDoc(
      //   doc(db, 'users', `user/data/feedback/messages/${name}`),
      //   {
      //     emotion: emotion,
      //     suggestion: suggestion,
      //   },
      // );
      Alert.alert('Thank you', 'Your response matters', [
        {
          text: 'Ok',
        },
      ]);
      setSending(false);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'An error occured. Try again', [
        {
          text: 'Ok',
        },
      ]);
      setSending(false);
    }
  }

  if (sending) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={Colors.primary100} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme == 'light' ? Colors.primary200 : Colors.primary100,
        },
      ]}>
      <Text
        style={[
          styles.heading,
          {color: theme == 'light' ? Colors.primary100 : Colors.primary200},
        ]}>
        User Feedback
      </Text>
      <View style={[styles.emojisMain]}>
        <Text
          style={{
            color: theme == 'light' ? Colors.primary100 : Colors.primary200,
          }}>
          What was your experience?
        </Text>
        <View style={styles.emojis}>
          <TouchableOpacity
            onPress={() => {
              setEmotion('sad');
              setOpacity(0);
            }}>
            <Image
              source={require('../../assets/sad.png')}
              style={{
                width: 50,
                height: 50,
                marginTop: 14,
                opacity: opacites[0],
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setEmotion('dissapointed');
              setOpacity(1);
            }}>
            <Image
              source={require('../../assets/dissapointment.png')}
              style={{
                width: 50,
                height: 50,
                marginTop: 14,
                opacity: opacites[1],
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setEmotion('happy');
              setOpacity(2);
            }}>
            <Image
              source={require('../../assets/happy.png')}
              style={{
                width: 50,
                height: 50,
                marginTop: 14,
                opacity: opacites[2],
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setEmotion('love');
              setOpacity(3);
            }}>
            <Image
              source={require('../../assets/love.png')}
              style={{
                width: 50,
                height: 50,
                marginTop: 14,
                opacity: opacites[3],
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.emojisMain}>
        <Text
          style={[
            styles.suggestionsHeader,
            {color: theme == 'light' ? Colors.primary100 : Colors.primary200},
          ]}>
          Any Suggestions?
        </Text>
        <TextInput
          onSubmitEditing={() => sendFeedback()}
          onChangeText={e => setSuggestion(e)}
          style={[
            styles.suggestion,
            {
              color: Colors.primary100,
            },
          ]}></TextInput>
        <TouchableOpacity onPress={() => sendFeedback()} style={styles.send}>
          <Text
            style={[
              styles.heading,
              {
                color: theme == 'light' ? Colors.primary100 : Colors.primary200,
              },
            ]}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  emojisMain: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojis: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '30%',
    gap: 17,
  },
  suggestionsHeader: {
    color: '#444',
    marginTop: 16,
  },
  suggestion: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    marginTop: 20,
    marginBottom: 30,
    height: 120,
    width: 270,
  },
  send: {
    width: 270,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#00f',
    elevation: 3,
    borderWidth: 0.3,
    borderRadius: 30,
    justifyContent: 'center',
    margin: 10,
    marginRight: 10,
  },
});
