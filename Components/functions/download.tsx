import {Alert, StyleSheet, Text, View, ToastAndroid} from 'react-native';
import React, { useEffect, useState } from 'react';
import RNFS from 'react-native-fs';
import PrimaryButton from '../buttonPrimary';
import {SetStateAction} from 'react';
import {addToHistory} from '../../Screens/history';
import notifee from '@notifee/react-native';



// Download Component
export default function Download({
  url,
  name,
  setState,
  setItem,
  image
}: {
  url: string;
  name: string;
  image: string;
  setState: SetStateAction<any>;
  setItem: SetStateAction<any>;
}) {
   let channelId:any = null
  const [id, setId]  = useState<any>(0);
 
  
  // Document destination
  const dest = `${RNFS.DocumentDirectoryPath}/${name}`;

  // Download Options
  const options = {
    fromUrl: url,
    toFile: dest,
    progress:async function (res: any) {
      // Create download notification and update the progress
      await notifee.requestPermission();
      await notifee.displayNotification({
        id: '123',
        title: 'Downloading',
        // Download progress in mb
        body: `${name} ${((res.bytesWritten / res.contentLength) * 100).toFixed(
          2,
        )}%`,
        android: {
          channelId,
        },
      });
      setState(res.bytesWritten / res.contentLength);
    },
  };

  // Download function
  async function download() {
    // Update State from parent component
    setState(0.01);

    // Show Toast
    ToastAndroid.show('Download Started', ToastAndroid.SHORT);

    // Start Download
    await RNFS.downloadFile(options)
      .promise.then(async(res) => {
        // Update State in parent component to indicate a successful download operation
        setState(1);

        // Update Item in parent component
        setItem({name: name, endpoint: dest});

        // Clear the download notification
        await notifee.cancelNotification(name);


        // Create a success notification
        await notifee.displayNotification({
          title: 'Download Complete',
          body: name+' Downloaded Successfully',
          android: {
           channelId,
          },
        });

        // Save file url and name in local storage
        addToHistory({name: name, endpoint: dest, image: image});
      })
      .catch(async(err) => {
        // Inform the user about the error
        Alert.alert(
          'Error',
          err.message + '. Click on the Get Button to Try again',
          [
            {
              text: 'Ok',
            },
          ],
        );
        // Create a failure notification
        await notifee.displayNotification({
          title: 'Download Failed',
          body: 'Click on the Get Button to Try again',
          android: {
            channelId,
          },
        });
      });
  }

  async function requestPermission() {
    // random string ID
    channelId = await notifee.createChannel({
      id:name,
      name: 'Default Channel',
     });
    await notifee.requestPermission();
  }
  useEffect(() => {
    requestPermission();
  },[]);

  return (
    <PrimaryButton title="Get" size="" radius={10} pressHandler={download} />
  );
}
