import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logout, currentUser } from '../redux/features/auth/authSlice';
import { useGetMeQuery } from '../redux/features/auth/authApi';
import { useGetMyGroupQuery } from '../redux/features/group/groupApi';
import {
  User,
  Lock,
  Mail,
  Plus,
  X,
  ChevronRight,
  CheckCircle,
  Users,
} from '../components/CustomIcon';
import { Avatar, initials } from './ExpensesTab';

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  right?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

function SettingsRow({
  icon,
  label,
  sub,
  right,
  onClick,
  danger = false,
}: SettingsRowProps) {
  const Container = onClick ? TouchableOpacity : View;
  return (
    <Container
      onPress={onClick}
      style={styles.rowCard}
      activeOpacity={onClick ? 0.7 : 1}
    >
      <View
        style={[
          styles.rowIconCircle,
          {
            backgroundColor: danger
              ? 'rgba(212,24,61,0.12)'
              : 'rgba(232,160,32,0.1)',
          },
        ]}
      >
        {icon}
      </View>
      <View style={styles.rowTextWrapper}>
        <Text style={[styles.rowLabelText, danger && { color: '#d4183d' }]}>
          {label}
        </Text>
        {sub && <Text style={styles.rowSubText}>{sub}</Text>}
      </View>
      {right
        ? right
        : onClick &&
          !danger && <ChevronRight color={COLORS.textSecondary} size={14} />}
    </Container>
  );
}

interface ProfileTabProps {
  onEditProfile: () => void;
  onChangePassword: () => void;
  onViewGroupDetails: () => void;
}

export default function ProfileTab({
  onEditProfile,
  onChangePassword,
  onViewGroupDetails,
}: ProfileTabProps) {
  const dispatch = useAppDispatch();
  
  // Fetch fresh profile info
  useGetMeQuery(undefined, { refetchOnMountOrArgChange: true });
  
  // Fetch fresh group info
  const { data: groupData } = useGetMyGroupQuery(undefined, { refetchOnMountOrArgChange: true });
  const myGroup = groupData?.data;
  
  const loggedInUser = useAppSelector(currentUser);
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // User matching redux state
  const me = {
    id: loggedInUser?._id || 'unknown',
    name: loggedInUser?.name || 'User',
    email: loggedInUser?.email || '',
    phone: loggedInUser?.phone || '',
    profileImage: loggedInUser?.profileImage,
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => dispatch(logout()),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Title Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>
            My <Text style={{ color: COLORS.primary }}>Profile</Text>
          </Text>
          <Text style={styles.headerSubtitle}>Account & settings</Text>
        </View>
        <Image
          source={require('../assets/logo.png')}
          style={styles.headerLogo}
        />
      </View>
      <View style={styles.divider} />

      {/* User profile card */}
      <View style={[styles.profileCard, SHADOWS.lg]}>
        <Avatar user={me} size={64} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{me.name}</Text>
          <Text style={styles.profileEmail}>{me.email}</Text>
          <Text style={styles.profilePhone}>{me.phone}</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active · Verified</Text>
          </View>
        </View>
      </View>

      {/* Account Settings */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionHeader}>Account</Text>
        <View style={styles.settingsListCard}>
          <SettingsRow
            icon={<User color={COLORS.primary} size={18} />}
            label="Edit Profile"
            sub="Update your name, photo, address & more"
            onClick={onEditProfile}
          />
          <View style={styles.listLineDivider} />
          {myGroup && (
            <>
              <SettingsRow
                icon={<Users color={COLORS.primary} size={18} />}
                label="My Group"
                sub={`${myGroup.name} · Code: ${myGroup.inviteCode}`}
                onClick={onViewGroupDetails}
              />
              <View style={styles.listLineDivider} />
            </>
          )}
          <SettingsRow
            icon={<Lock color={COLORS.primary} size={18} />}
            label="Change Password"
            sub="Update your account password"
            onClick={onChangePassword}
          />
          <View style={styles.listLineDivider} />
          <SettingsRow
            icon={<CheckCircle color={COLORS.primary} size={18} />}
            label="Account Info"
            sub="Last login: Today · Member since Jan 2025"
          />
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionHeader}>Notifications</Text>
        <View style={styles.overlayContainer}>
          <View style={styles.settingsListCard}>
            <SettingsRow
              icon={<Plus color={COLORS.primary} size={18} />}
              label="Push Notifications"
              sub={
                pushNotif
                  ? 'Receive alerts for new entries'
                  : 'Notifications are off'
              }
              right={
                <Switch
                  value={pushNotif}
                  onValueChange={setPushNotif}
                  trackColor={{
                    false: 'rgba(232,160,32,0.2)',
                    true: COLORS.primary,
                  }}
                  thumbColor={
                    Platform.OS === 'ios' ? '#fff' : pushNotif ? '#fff' : '#aaa'
                  }
                  disabled
                />
              }
            />
            <View style={styles.listLineDivider} />
            <SettingsRow
              icon={<Mail color={COLORS.primary} size={18} />}
              label="Email Notifications"
              sub={
                emailNotif
                  ? 'Get email summaries & alerts'
                  : 'Email notifications are off'
              }
              right={
                <Switch
                  value={emailNotif}
                  onValueChange={setEmailNotif}
                  trackColor={{
                    false: 'rgba(232,160,32,0.2)',
                    true: COLORS.primary,
                  }}
                  thumbColor={
                    Platform.OS === 'ios' ? '#fff' : emailNotif ? '#fff' : '#aaa'
                  }
                  disabled
                />
              }
            />
          </View>
          {/* Translucent Watermark Overlay */}
          <View style={styles.watermarkOverlay}>
            <Text style={{ fontSize: 24, marginBottom: 6 }}>🚧</Text>
            <Text style={styles.watermarkText}>Currently working on it</Text>
            <Text style={styles.watermarkSubText}>Coming soon in next release</Text>
          </View>
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionHeader}>Preferences</Text>
        <View style={styles.settingsListCard}>
          <SettingsRow
            icon={<Plus color={COLORS.primary} size={18} />}
            label="Address"
            sub={
              loggedInUser?.address
                ? [
                    loggedInUser.address.street,
                    loggedInUser.address.city,
                    loggedInUser.address.state,
                    loggedInUser.address.zipCode,
                    loggedInUser.address.country,
                  ]
                    .filter(Boolean)
                    .join(', ')
                : 'No address specified'
            }
          />
          <View style={styles.listLineDivider} />
          <SettingsRow
            icon={<User color={COLORS.primary} size={18} />}
            label="About Me"
            sub={loggedInUser?.aboutme || 'No description provided'}
          />
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.settingsSection}>
        <Text style={[styles.sectionHeader, { color: '#d4183d' }]}>
          Danger Zone
        </Text>
        <View
          style={[
            styles.settingsListCard,
            { borderColor: 'rgba(212,24,61,0.25)' },
          ]}
        >
          <SettingsRow
            icon={<X color="#d4183d" size={18} />}
            label="Sign Out"
            sub="Sign out from this device"
            onClick={handleSignOut}
            danger
          />
          <View
            style={[
              styles.listLineDivider,
              { backgroundColor: 'rgba(212,24,61,0.15)' },
            ]}
          />
          <SettingsRow
            icon={<X color="#d4183d" size={18} />}
            label="Delete Account"
            sub="Permanently remove your account and data"
            onClick={handleDeleteAccount}
            danger
          />
        </View>
      </View>

      {/* Delete Confirmation Card */}
      {showDeleteConfirm && (
        <View style={styles.deleteConfirmCard}>
          <View style={styles.deleteHeaderRow}>
            <Text style={styles.deleteHeaderIcon}>⚠️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.deleteTitle}>Delete your account?</Text>
              <Text style={styles.deleteText}>
                All your data, entries, and group memberships will be
                permanently removed. This action cannot be undone.
              </Text>
            </View>
          </View>
          <View style={styles.deleteActions}>
            <TouchableOpacity
              style={styles.deleteCancelBtn}
              onPress={() => setShowDeleteConfirm(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteSubmitBtn}
              onPress={() => {
                setShowDeleteConfirm(false);
                dispatch(logout());
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteSubmitText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
  },
  headerLogo: {
    width: 44,
    height: 44,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'serif',
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 4,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1.2,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'sans-serif',
  },
  profileEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  profilePhone: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
  statusText: {
    fontSize: 11,
    color: '#22c55e',
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  settingsSection: {
    gap: 8,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    paddingLeft: 4,
  },
  settingsListCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1.2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: 'transparent',
  },
  rowIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowTextWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  rowLabelText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    fontFamily: 'sans-serif',
  },
  rowSubText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    marginTop: 2,
  },
  listLineDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 62, // align with text start
  },
  langCode: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
  deleteConfirmCard: {
    borderColor: '#d4183d',
    borderWidth: 1.2,
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(212,24,61,0.05)',
    gap: 16,
  },
  deleteHeaderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteHeaderIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  deleteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d4183d',
    fontFamily: 'sans-serif',
  },
  deleteText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    lineHeight: 18,
    marginTop: 2,
  },
  deleteActions: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteCancelBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  deleteCancelText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
    fontFamily: 'sans-serif',
  },
  deleteSubmitBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#d4183d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteSubmitText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'sans-serif',
  },
  overlayContainer: {
    position: 'relative',
  },
  watermarkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(28, 17, 9, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: 'rgba(232, 160, 32, 0.2)',
  },
  watermarkText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'monospace',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  watermarkSubText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    marginTop: 4,
  },
});
