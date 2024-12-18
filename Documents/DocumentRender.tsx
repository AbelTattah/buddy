import React, { useEffect } from 'react'; // Importing components from react
import { useContext } from 'react';
import { DocumentView, RNPdftron } from '@pdftron/react-native-pdf';
import { userContext } from '../store/user';
import { Alert, Image } from 'react-native';

RNPdftron.initialize('Insert commercial license key here after purchase');
RNPdftron.enableJavaScript(true);


// Component to the pdf
const DocumentRenderer = ({ navigation, route }: any) => {
  // Render the pdf component
  const context = useContext(userContext);
  useEffect(() => {
    console.log(context.url);
    navigation.setOptions({
      header: () => null,
    })
  }, []);

  return (
    <DocumentView
      onLeadingNavButtonPressed={() => navigation.navigate('Main')}
      document={`${context.url}`}
      showLeadingNavButton={true}
    />
  );
};

export default DocumentRenderer;
