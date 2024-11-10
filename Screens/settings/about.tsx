import {View, Text, StyleSheet, Linking, Button} from 'react-native';
import React, {useContext} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {userContext} from '../../store/user';
import Colors from '../../Components/constants/Colors';

const info1 = `
Buddy v1.0

`;
const info2 = `
What does Buddy do?

Buddy Gives you free instant Access to Books. Just type the name of the book you want
to read and access it instantly
`;

const info3 = `

Can I contribute to Buddy?

Yes you can, click on the link below to access the github repository for this project

`;

const info4 = `

Are there any hidden costs?

No, there are no hidden costs. Buddy is completely free you can access it ant anytime 

`;

export default function About() {
  const {theme} = useContext(userContext);
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme == 'light' ? Colors.primary200 : Colors.primary100,
        },
      ]}>
      <View
        style={{
          width: 340,
          gap: 20,
          marginTop: 40,
          backgroundColor:
            theme == 'light' ? Colors.primary200 : Colors.primary100,
        }}>
        <Text
          style={{
            color: theme == 'light' ? Colors.primary100 : Colors.primary200,
          }}>
          {info1}
        </Text>
        <Text
          style={{
            color: theme == 'light' ? Colors.primary100 : Colors.primary200,
          }}>
          {info2}
        </Text>
        <Text
          style={{
            color: theme == 'light' ? Colors.primary100 : Colors.primary200,
          }}>
          {info3}
        </Text>
        <TouchableOpacity
          style={styles.link}
          onPress={() =>
            Linking.openURL('https://github.com/AbelTattah/Buddy')
          }>
          <Text
            style={{
              color: '#00f5',
            }}>
            Github Repository Link
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            color: theme == 'light' ? Colors.primary100 : Colors.primary200,
          }}>
          {info4}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  link: {},
});
