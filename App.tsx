
import { NativeBaseProvider } from 'native-base'
import { Text, View, StatusBar } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import { THEME } from './src/theme';

import { AuthContext } from '@contexts/AuthContext';


import { Loading } from '@components/Loading';
import { Routes } from '@routes/index';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  })

  return (

    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent
      />
      <AuthContext.Provider value={{
        user: {
          id: '1',
          name: 'Arley',
          email: 'arley@teste.com',
          avatar: 'arley.png'
        }
      }}>
        {
          fontsLoaded ? <Routes /> : <Loading />
        }
      </AuthContext.Provider>
    </NativeBaseProvider>
  );
}


