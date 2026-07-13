import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function BillsScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Bills</ThemedText>
        </View>

        <View style={styles.placeholder}>
          <ThemedText style={styles.emoji}>🧾</ThemedText>
          <ThemedText style={styles.placeholderTitle}>Coming Soon</ThemedText>
          <ThemedText
            style={styles.placeholderSubtitle}
            themeColor="textSecondary"
          >
            Your bills and expenses will appear here
          </ThemedText>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Spacing.six,
  },
  emoji: {
    fontSize: 48,
    marginBottom: Spacing.three,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.two,
  },
  placeholderSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
});
