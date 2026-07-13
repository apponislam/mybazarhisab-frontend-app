import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from './src/constants/theme';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

type ScreenType = 'splash' | 'login' | 'home';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [userEmail, setUserEmail] = useState('');

  const handleSplashFinish = () => {
    setCurrentScreen('login');
  };

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setUserEmail('');
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={handleSplashFinish} />;
      case 'login':
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
      case 'home':
        return <HomeScreen userEmail={userEmail} onLogout={handleLogout} />;
      default:
        return <SplashScreen onFinish={handleSplashFinish} />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {renderScreen()}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default App;
