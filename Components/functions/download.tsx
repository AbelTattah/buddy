import {Alert, StyleSheet, Text, View, ToastAndroid} from 'react-native';
import React, {useEffect, useState} from 'react';
import RNFS from 'react-native-fs';
import PrimaryButton from '../buttonPrimary';
import {SetStateAction} from 'react';
import {addToHistory} from '../../Screens/history';
import notifee from '@notifee/react-native';
import {useNavigation} from '@react-navigation/native';

// Download Component
export default function Download({
  url,
  name,
  setState,
  setItem,
  image,
}: {
  url: string;
  name: string;
  image: string;
  setState: SetStateAction<any>;
  setItem: SetStateAction<any>;
}) {
  const [id, setId] = useState<any>(0);
  const [max, setMax] = useState<any>(0);
  const [current, setCurrent] = useState<any>(0)
  const [downloadInProgress, setDownloadInProgress] = useState<boolean>(false)
  const [jobId, setJobId] = useState<number>(0)
  // Navigation
  const navigation = useNavigation();

  // Document destination
  const dest = `${RNFS.DocumentDirectoryPath}/${name}`;

  // Download function
  async function download() {

    setDownloadInProgress(true)
    // Update State from parent component
    setState(0.01);
    let channelId: any = await notifee.createChannel({
      id: id,
      name: 'Default Channel',
    });
    
    await notifee.requestPermission();
    await notifee.displayNotification({
      id: id,
      title: 'Downloading',
      // Download progress in mb
      body: name,
      android: {
        progress: {
          max:  max,
          current:current,
        },
        channelId
      },
    });

    // Show Toast
    ToastAndroid.show('Download Started', ToastAndroid.SHORT);


    // Download Options
    const options = {
      fromUrl: url,
      toFile: dest,
      progress: async function (res: any) {
        // Set State

        setJobId(res.jobId)
  
        setState(res.bytesWritten / res.contentLength);

        setCurrent(res.bytesWritten)

        setMax(res.contentLength)

        // Create download notification and update the progress
        await notifee.displayNotification({
          id: id,
          title: 'Downloading',
          // Download progress in mb
          body: name,
          android: {
            progress: {
              max: res.contentLength,
              current:res.bytesWritten,
            },
            channelId,
            ongoing:true,
            onlyAlertOnce: true,
          },
        });
      },
    };

    // Start Download
    await RNFS.downloadFile(options)
      .promise.then(async res => {
        // Update State in parent component to indicate a successful download operation
        setState(1);

        // Update Item in parent component
        setItem({name: name, endpoint: dest});

        // Cancel the previous download notification
        await notifee.cancelNotification(id);

        setDownloadInProgress(false)
        // Create a success notification
        await notifee.displayNotification({
          title: 'Download Complete',
          id: id,
          body: name + ' Downloaded Successfully',
          android: {
            channelId,
          },  
        });

        // Save file url and name in local storage
        addToHistory({name: name, endpoint: dest, image: image});
      })
      .catch(async err => {
        setDownloadInProgress(false)
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
        let channelId: any = await notifee.createChannel({
          id: name,
          name: 'Default Channel',
        });

        // Create a failure notification
        await notifee.displayNotification({
          title: 'Download Failed',
          id: id,
          body: 'Click on the Get Button to Try again',
          android: {
            channelId,
          },
        });

      });

  }

  async function cancel() {
    await RNFS.stopDownload(jobId)
  }

  async function requestPermission() {
    // random string ID
    const newID = Math.random().toString(36).substring(7);
    console.log(newID);
    setId(newID);

    await notifee.requestPermission();
  }
  useEffect(() => {
    requestPermission();
  }, []);

  return (<>
     {
      downloadInProgress?     <PrimaryButton title="Cancel" size="" radius={10} pressHandler={cancel} /> :   <PrimaryButton title="Get" size="" radius={10} pressHandler={download} />
     }
  </>
  
  );
}
