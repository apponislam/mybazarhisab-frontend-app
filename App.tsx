import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import { useAppSelector } from './src/redux/hooks';
import { isLoggedIn, currentUserEmail } from './src/redux/features/auth/authSlice';
import { COLORS } from './src/constants/theme';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const loggedIn = useAppSelector(isLoggedIn);
  const userEmail = useAppSelector(currentUserEmail);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const renderScreen = () => {
    if (showSplash) {
      return <SplashScreen onFinish={handleSplashFinish} />;
    }
    
    if (loggedIn && userEmail) {
      return <HomeScreen />;
    }

    return <LoginScreen />;
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
    </View>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default App;
