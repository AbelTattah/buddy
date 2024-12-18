import {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { download } from '../Components/functions/download';

// Context for user
export const userContext = createContext({
  siv: false,
  name: '',
  isLoggedIn: false,
  pdf: '',
  url: '',
  theme: 'light',
  statusBar: false,
  downloads: [],
  setStatusBar: (value: boolean) => {},
  setTheme: (sid: string) => {},
  setUrl: (url: string) => {},
  setSiv: (sid: boolean) => {},
  setName: (name: string) => {},
  setAuthState: (auth: boolean) => {},
  setPdf: (pdf: string) => {},
  addDownload: (id: any, url: string, image: string, name:string) => {},
  removeDownload: (id: string) => {},
  restartDownload: (id: string) => {},
  downloadError: (data:{
    jobId:any,
    status:any
  }) => {},
  updateDownloadProgress: (id: string, progress: number) => {},
});

// Provider Component
function UserContextProvider({children}: any) {
  const [siv, setSIV] = useState(false);
  const [name, setNAME] = useState('');
  const [isLoggedIn, setAUTHSTATE] = useState(true);
  const [pdf, setPDF] = useState('');
  const [theme, setTHEME] = useState('light');
  const [statusBar, setStatusbar] = useState(false);
  const [url, setURL] = useState('');
  const [downloads, updateDownloads] = useState<any>([]);
  const [dummyState, setDummyState] = useState({})
  


  // Current Download url or storage URL
  function setUrl(url: string) {
    setURL(url);
  }

  // StatusBar
  async function setStatusBar(value: boolean) {
    setStatusbar(value);
    await AsyncStorage.setItem('status', `${value}`);
  }

  // Global App theme
  async function setTheme(theme: string) {
    setTHEME(theme);
    await AsyncStorage.setItem('theme', theme);
  }

  function setSiv(sid: boolean) {
    setSIV(sid);
  }

  // User's name
  function setName(name: string) {
    setNAME(name);
  }

  // User Authentication Status
  function setAuthState(state: boolean) {
    setAUTHSTATE(state);
  }

  // PDF url
  function setPdf(pdf: string) {
    setPDF(pdf);
  }

  //Get theme setting from local storage
  async function getTheme() {
    const data = await AsyncStorage.getItem('theme');
    if (data == null) {
      return;
    } else {
      setTHEME(data);
    }
  }

  // Get Status from local storage
  async function getStatus() {
    const data = await AsyncStorage.getItem('status');
    if (data == null) {
      return;
    } else {
      if (data == `true`) {
        setStatusbar(true);
      } else {
        setStatusBar(false);
      }
    }
  }

  // load downloads from local storage
  async function getDownloads() {
    const data = await AsyncStorage.getItem('downloads');
    if (data == null) {
      updateDownloads([]);
    } else {
      updateDownloads(JSON.parse(data));
    }
  }

  // Add download to local storage
  async function addDownload(id: any, url: string, image: string, name:string) {
    const data = await AsyncStorage.getItem('downloads');
    if (data == null) {
      updateDownloads(
        [
          {
            id: id,
            url: url,
            image: image,
            name:name,
            progress:0,
          }
        ]
      );
      await AsyncStorage.setItem(
        'downloads',
        JSON.stringify(
          {
            data: [
              {
                id: id,
                url: url,
                image: image,
                name:name,
                progress:0,
              }              
            ]
          }
        ),
      );
    } else {
      const currentDataObject: any = JSON.parse(data);
      let currentData:any = currentDataObject.data
      let updatedCurrentData:any = currentData.unshift({
          id: id,
          url: url,
          image: image,
          name:name,
          progress:0,
      })

      await AsyncStorage.setItem(
        'downloads',
        JSON.stringify({
          data: [
            updatedCurrentData
          ],
        }),
      );

      updateDownloads(
        updatedCurrentData
      );
    }
    console.log(downloads)
  }

  // Remove download from local storage
  async function removeDownload(id: string) {
    const data:any = await AsyncStorage.getItem('downloads');
    const currentData: any = JSON.parse(data);

    let updatedCurrentData: any = currentData.data;
    // Remove item with ID
    updatedCurrentData = updatedCurrentData.filter(
      (item: any) => item.id !== id,
    );

    updateDownloads({
      data: [...updatedCurrentData],
    });

    await AsyncStorage.setItem(
      'downloads',
      JSON.stringify({
        data: [...updatedCurrentData],
      }),
    );
  }

  // Update download progress
    async function updateDownloadProgress(id: string, progress: number) {
      // // Find the id and update the status
      // const localData:any = await AsyncStorage.getItem('downloads');

      // let downloadObject = JSON.parse(localData)
      // downloadObject = downloadObject.data.find((id:any)=>id==id)
      // downloadObject = downloadObject[0]
      // downloadObject = {
      //   ...downloadObject,
      //   progress:progress,
      // }

      // const filteredCurrentDownloadData = JSON.parse(localData).data.filter(
      //   (item: any) => item.id !== id,
      // );
       
      // const updatedCurrentDownloadData = filteredCurrentDownloadData.push({
      //   downloadObject
      // })
    
      // updateDownloads({
      //   data:updatedCurrentDownloadData
      // })

      // await AsyncStorage.setItem(
      //   'downloads',
      //   JSON.stringify({
      //     data:updatedCurrentDownloadData
      //   }),
      // );
    }

  async function restartDownload(id: string) {
    // Find the id and update the status
    const localData:any = await AsyncStorage.getItem('downloads');

    let downloadObject = JSON.parse(localData).data.find((id:any)=>id==id)
    downloadObject = downloadObject[0]

    download(
        setDummyState,
        setDummyState,
        setDummyState,
        downloadObject.url,
        downloadObject.name,
        downloadObject.image,
        downloadObject.id,
        2,
        1,
        setDummyState,
        setDummyState,
        setDummyState,
        downloadError,
    )
  }

  async function downloadError(data:{
    jobId:any,
    status:any
  }) {
      const id = data.jobId;
      const status = data.status;

      // Find the id and update the status
      const localData:any = await AsyncStorage.getItem('downloads');

      let downloadObject = JSON.parse(localData).data.find((id:any)=>id==id)
      downloadObject = downloadObject[0]
      downloadObject = {
        ...downloadObject,
        status:status,
      }

      const filteredCurrentDownloadData = JSON.parse(localData).data.filter(
        (item: any) => item.id !== data.jobId,
      );
       
      const updatedCurrentDownloadData = filteredCurrentDownloadData.push({
        downloadObject
      })
    
      updateDownloads({
        data:updatedCurrentDownloadData
      })
  }

  // Get theme and status on first render
  useEffect(() => {
    getTheme();
    getStatus();
  }, []);

  return (
    <userContext.Provider
      value={{
        url,
        setUrl,
        theme,
        statusBar,
        setStatusBar,
        setTheme,
        name,
        setName,
        siv,
        setSiv,
        isLoggedIn,
        setAuthState,
        pdf,
        setPdf,
        downloads,
        addDownload,
        removeDownload,
        restartDownload,
        downloadError,
        updateDownloadProgress
      }}>
      {children}
    </userContext.Provider>
  );
}

export default UserContextProvider;
