import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';
import { useGetMyGroupQuery } from '../redux/features/group/groupApi';
import { ArrowLeft, BookOpen } from '../components/CustomIcon';
import { Avatar } from './ExpensesTab';

interface GroupDetailsScreenProps {
  onBack: () => void;
}

export default function GroupDetailsScreen({ onBack }: GroupDetailsScreenProps) {
  const { data: groupData, isLoading, error } = useGetMyGroupQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const myGroup = groupData?.data;

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
        <ArrowLeft color={COLORS.textSecondary} size={16} />
        <Text style={styles.backButtonText}>Profile</Text>
      </TouchableOpacity>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : error || !myGroup ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            {error ? 'Failed to load group details' : 'No active group found'}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.screenHeader}>
            <View style={styles.iconCircleHeader}>
              <BookOpen color={COLORS.primary} size={22} />
            </View>
            <Text style={styles.screenTitle}>Group Details</Text>
            <Text style={styles.screenSubtitle}>
              Manage and view members of your shared bazar group.
            </Text>
          </View>

          {/* Group Basic Info Card */}
          <View style={styles.groupInfoCard}>
            <Text style={styles.groupModalName}>{myGroup.name}</Text>
            
            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Invite Code:</Text>
              <Text style={styles.codeValue}>{myGroup.inviteCode}</Text>
            </View>
            
            <View style={styles.creatorContainer}>
              <Text style={styles.infoLabel}>Created By:</Text>
              <Text style={styles.infoValue}>
                {typeof myGroup.creator === 'object' && myGroup.creator !== null
                  ? (myGroup.creator as any).name
                  : myGroup.members?.find((m) => m._id === myGroup.creator)?.name || 'Admin'}
              </Text>
            </View>
          </View>

          {/* Members Section */}
          <Text style={styles.sectionTitle}>Members ({myGroup.members?.length || 0})</Text>
          
          <View style={styles.membersListContainer}>
            {myGroup.members &&
              myGroup.members.map((member) => (
                <View key={member._id} style={styles.memberRow}>
                  <Avatar
                    user={{
                      id: member._id,
                      name: member.name || '',
                      email: member.email || '',
                      phone: member.phone || '',
                      profileImage: member.profileImage,
                    }}
                    size={44}
                  />
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberEmail}>{member.email}</Text>
                    {member.phone && <Text style={styles.memberPhone}>{member.phone}</Text>}
                  </View>
                </View>
              ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: 'sans-serif',
    marginLeft: 6,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  screenHeader: {
    marginBottom: 28,
    marginTop: 10,
  },
  iconCircleHeader: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primaryGlow,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'serif',
  },
  screenSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    marginTop: 4,
    lineHeight: 18,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    fontFamily: 'sans-serif',
  },
  groupInfoCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 24,
    gap: 12,
    ...SHADOWS.md,
  },
  groupModalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'sans-serif',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
  },
  codeValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'monospace',
    backgroundColor: 'rgba(232, 160, 32, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(232, 160, 32, 0.2)',
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
    fontFamily: 'sans-serif',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    letterSpacing: 1.5,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  membersListContainer: {
    gap: 12,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: COLORS.border,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: 'sans-serif',
  },
  memberEmail: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  memberPhone: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    marginTop: 2,
  },
});
