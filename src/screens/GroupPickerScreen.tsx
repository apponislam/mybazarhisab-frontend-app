import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';
import { User, Plus } from '../components/CustomIcon';

// Types from web App.tsx
export interface GroupStats {
  groupName: string;
  totalMembers: number;
  totalGroupBazarEntries: number;
  totalMyBazarEntries: number;
  totalProductsCreatedByMe: number;
  thisMonthBazarExpense: number;
  prevMonthBazarExpense: number;
  thisYearBazarExpense: number;
  prevYearBazarExpense: number;
  thisMonthBillExpense: number;
  prevMonthBillExpense: number;
  thisYearBillExpense: number;
  prevYearBillExpense: number;
  thisMonthTotalExpense: number;
  prevMonthTotalExpense: number;
  thisYearTotalExpense: number;
  prevYearTotalExpense: number;
}

function makeMockStats(groupName: string): GroupStats {
  return {
    groupName,
    totalMembers: 8,
    totalGroupBazarEntries: 134,
    totalMyBazarEntries: 47,
    totalProductsCreatedByMe: 23,
    thisMonthBazarExpense: 12840,
    prevMonthBazarExpense: 10950,
    thisYearBazarExpense: 98400,
    prevYearBazarExpense: 87200,
    thisMonthBillExpense: 4200,
    prevMonthBillExpense: 5100,
    thisYearBillExpense: 43600,
    prevYearBillExpense: 39800,
    thisMonthTotalExpense: 17040,
    prevMonthTotalExpense: 16050,
    thisYearTotalExpense: 142000,
    prevYearTotalExpense: 127000,
  };
}

interface GroupPickerProps {
  onGroupReady: (stats: GroupStats) => void;
}

export default function GroupPickerScreen({ onGroupReady }: GroupPickerProps) {
  const [joinCode, setJoinCode] = useState('');
  const [groupName, setGroupName] = useState('');
  
  const [jf, setJf] = useState(false);
  const [cf, setCf] = useState(false);
  const [jl, setJl] = useState(false);
  const [cl, setCl] = useState(false);

  const handleJoinGroup = () => {
    if (!joinCode.trim()) return;
    setJl(true);
    setTimeout(() => {
      setJl(false);
      onGroupReady(makeMockStats('Sabzi Mandi Group'));
    }, 1500);
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;
    setCl(true);
    setTimeout(() => {
      setCl(false);
      onGroupReady(makeMockStats(groupName.trim()));
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Bazar <Text style={{ color: COLORS.primary }}>Hisab</Text></Text>
          <Text style={styles.headerSubtitle}>Manage your market groups</Text>
        </View>
        <View style={styles.headerLogoCircle}>
          <User color={COLORS.primary} size={22} />
        </View>
      </View>
      <View style={styles.divider} />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Section 1: Join Group */}
        <View style={[styles.card, SHADOWS.lg]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: COLORS.primaryGlow }]}>
              <User color={COLORS.primary} size={18} />
            </View>
            <View>
              <Text style={styles.cardTitle}>Join a Group</Text>
              <Text style={styles.cardSubtitle}>Enter a code shared by your admin</Text>
            </View>
          </View>

          <View style={[styles.inputWrapper, jf && styles.inputWrapperFocused]}>
            <User color={COLORS.textSecondary} size={16} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={joinCode}
              onChangeText={(val) => setJoinCode(val.toUpperCase())}
              placeholder="e.g. BZR-4821"
              placeholderTextColor={COLORS.placeholder}
              onFocus={() => setJf(true)}
              onBlur={() => setJf(false)}
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleJoinGroup}
            disabled={jl || !joinCode.trim()}
            activeOpacity={0.8}
          >
            {jl ? (
              <ActivityIndicator color={COLORS.textOnPrimary} size="small" />
            ) : (
              <Text style={styles.primaryButtonText}>Join Group</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* OR Divider */}
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.orLine} />
        </View>

        {/* Section 2: Create Group */}
        <View style={[styles.card, SHADOWS.lg]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: COLORS.accentGlow }]}>
              <Plus color={COLORS.accent} size={18} />
            </View>
            <View>
              <Text style={styles.cardTitle}>Create a Group</Text>
              <Text style={styles.cardSubtitle}>Start a new bazar hisab group</Text>
            </View>
          </View>

          <View style={[styles.inputWrapper, cf && styles.inputWrapperFocused]}>
            <User color={COLORS.textSecondary} size={16} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="e.g. Sabzi Mandi"
              placeholderTextColor={COLORS.placeholder}
              onFocus={() => setCf(true)}
              onBlur={() => setCf(false)}
            />
          </View>

          <TouchableOpacity
            style={[styles.outlineButton, { borderColor: COLORS.accent }]}
            onPress={handleCreateGroup}
            disabled={cl || !groupName.trim()}
            activeOpacity={0.8}
          >
            {cl ? (
              <ActivityIndicator color={COLORS.accent} size="small" />
            ) : (
              <View style={styles.iconRow}>
                <Plus color={COLORS.accent} size={16} />
                <Text style={styles.outlineButtonText}>Create Group</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'serif',
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    marginTop: 2,
  },
  headerLogoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryGlow,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 24,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: COLORS.border,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: 'sans-serif',
  },
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    marginTop: 2,
  },
  inputWrapper: {
    height: 52,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputWrapperFocused: {
    borderColor: COLORS.borderFocus,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    paddingVertical: 0,
    fontFamily: 'sans-serif',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  primaryButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  orText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    letterSpacing: 1.2,
    fontFamily: 'monospace',
    paddingHorizontal: 12,
    textTransform: 'uppercase',
  },
  outlineButton: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  outlineButtonText: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
});
