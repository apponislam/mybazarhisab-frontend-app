import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { useAppSelector } from './src/store/hooks';
import { COLORS } from './src/constants/theme';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { isLoggedIn, userEmail } = useAppSelector((state) => state.auth);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const renderScreen = () => {
    if (showSplash) {
      return <SplashScreen onFinish={handleSplashFinish} />;
    }
    
    if (isLoggedIn && userEmail) {
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
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
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
