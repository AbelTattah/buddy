import {Alert, StyleSheet, Text, View, ToastAndroid} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import RNFS from 'react-native-fs';
import PrimaryButton from '../buttonPrimary';
import {SetStateAction} from 'react';
import {addToHistory} from '../../Screens/downloads';
import notifee from '@notifee/react-native';
import {useNavigation} from '@react-navigation/native';
import { userContext } from '../../store/user';

export async function download(
  setDownloadInProgress: any,
  setState: any,
  setItem: any,
  url: string,
  name: string,
  image: string,
  id: any,
  max: any,
  current: any,
  setMax: any,
  setCurrent: any,
  setJobId: any,
  setError:any,
  addDownload:any ="none",
  updateDownloadProgress:any = "none"
) {

  // Document destination
  const dest = `${RNFS.DocumentDirectoryPath}/${name}`;
  
  let jobId:any = ""

  setDownloadInProgress(true);
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
        max: max,
        current: current,
      },
      channelId,
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

      setJobId(res.jobId);

      jobId = res.jobId

      updateDownloadProgress(res.jobId,res.bytesWritten / res.contentLength)

      setState(res.bytesWritten / res.contentLength);

      setCurrent(res.bytesWritten);

      setMax(res.contentLength);

      // Create download notification and update the progress
      await notifee.displayNotification({
        id: id,
        title: 'Downloading',
        // Download progress in mb
        body:
          name +
          `${res.bytesWritten.toFixed(2) / 1000000} /  ${res.contentLength.toFixed(2) / 1000000} MB`,
        android: {
          progress: {
            max: res.contentLength,
            current: res.bytesWritten,
          },
          channelId,
          ongoing: true,
          onlyAlertOnce: true,
        },
      });
    },
  };

  if (addDownload!=="none") {
    addDownload(
      jobId,
      url,
      image,
      name
    )
  }

  // Start Download
  await RNFS.downloadFile(options)
    .promise.then(async res => {
      // Update State in parent component to indicate a successful download operation
      setState(1);

      // Update Item in parent component
      setItem({name: name, endpoint: dest});
      
      // Update download progress on downloads screen
      updateDownloadProgress(jobId,1)

      // Cancel the previous download notification
      await notifee.cancelNotification(id);

      setDownloadInProgress(false);
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
      setDownloadInProgress(false);
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

      setError({
        jobId:jobId,
        status:"e"
      })

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
async function cancel(jobId: number) {
  RNFS.stopDownload(jobId);
}

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
  const [current, setCurrent] = useState<any>(0);
  const [error, setError] = useState<any>()
  const [downloadInProgress, setDownloadInProgress] = useState<boolean>(false);
  const [jobId, setJobId] = useState<number>(0);
  // Navigation
  const navigation = useNavigation();

  const {addDownload,removeDownload,updateDownloadProgress} = useContext(userContext)

    // Document destination
    const dest = `${RNFS.DocumentDirectoryPath}/${name}`;


  // Execute download function
  async function downloadLocal() {
    await download(
      setDownloadInProgress,
      setState,
      setItem,
      url,
      name,
      image,
      id,
      max,
      current,
      setMax,
      setCurrent,
      setJobId,
      setError,
      addDownload,
      updateDownloadProgress
    )
    removeDownload
  }

  // Cancel download function
  async function cancelLocal() {
    await cancel(jobId);
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

  return (
    <>
      {downloadInProgress ? (
        <PrimaryButton
          title="Cancel"
          size=""
          radius={10}
          pressHandler={cancelLocal}
        />
      ) : (
        <PrimaryButton
          title="Get"
          size=""
          radius={10}
          pressHandler={downloadLocal}
        />
      )}
    </>
  );
}
