import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';
import {
  useGetMyGroupQuery,
  useLeaveGroupMutation,
  useUpdateGroupMutation,
  useGenerateInviteCodeMutation,
} from '../redux/features/group/groupApi';
import { useAppSelector } from '../redux/hooks';
import { currentUser } from '../redux/features/auth/authSlice';
import { ArrowLeft, Users, X } from '../components/CustomIcon';
import { Avatar } from './ExpensesTab';

interface GroupDetailsScreenProps {
  onBack: () => void;
}

export default function GroupDetailsScreen({ onBack }: GroupDetailsScreenProps) {
  const loggedInUser = useAppSelector(currentUser);
  const currentUserId = loggedInUser?._id;

  const { data: groupData, isLoading, error, refetch } = useGetMyGroupQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [leaveGroup, { isLoading: isLeaving }] = useLeaveGroupMutation();
  const [updateGroup, { isLoading: isUpdatingName }] = useUpdateGroupMutation();
  const [generateInviteCode, { isLoading: isRegeneratingCode }] = useGenerateInviteCodeMutation();

  const [showEditName, setShowEditName] = useState(false);
  const [newName, setNewName] = useState('');

  const myGroup = groupData?.data;

  const isCreator = myGroup
    ? myGroup.creator === currentUserId ||
      (typeof myGroup.creator === 'object' && myGroup.creator?._id === currentUserId)
    : false;

  const handleLeaveGroup = () => {
    Alert.alert(
      'Leave Group',
      'Are you sure you want to leave this group? You will no longer share expenses or bills with this group.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              await leaveGroup().unwrap();
              onBack();
            } catch (err: any) {
              Alert.alert('Error', err?.data?.message || err?.message || 'Failed to leave group');
            }
          },
        },
      ]
    );
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) return;
    try {
      await updateGroup({ name: newName.trim() }).unwrap();
      setShowEditName(false);
      refetch();
    } catch (err: any) {
      Alert.alert('Error', err?.data?.message || err?.message || 'Failed to update group name');
    }
  };

  const handleRegenerateInviteCode = () => {
    Alert.alert(
      'Regenerate Invite Code',
      'Are you sure you want to generate a new invitation code? The old code will expire instantly.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate New Code',
          onPress: async () => {
            try {
              await generateInviteCode().unwrap();
              refetch();
            } catch (err: any) {
              Alert.alert('Error', err?.data?.message || err?.message || 'Failed to generate new code');
            }
          },
        },
      ]
    );
  };

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
              <Users color={COLORS.primary} size={22} />
            </View>
            <Text style={styles.screenTitle}>Group Details</Text>
            <Text style={styles.screenSubtitle}>
              Manage and view members of your shared bazar group.
            </Text>
          </View>

          {/* Group Basic Info Card */}
          <View style={styles.groupInfoCard}>
            <View style={styles.groupHeaderRow}>
              <Text style={styles.groupModalName}>{myGroup.name}</Text>
              <TouchableOpacity
                onPress={() => {
                  setNewName(myGroup.name);
                  setShowEditName(true);
                }}
                style={styles.editNameBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Invite Code:</Text>
              <Text style={styles.codeValue}>{myGroup.inviteCode}</Text>
              <TouchableOpacity
                onPress={handleRegenerateInviteCode}
                style={styles.regenCodeBtn}
                activeOpacity={0.7}
                disabled={isRegeneratingCode}
              >
                {isRegeneratingCode ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                  <Text style={styles.regenText}>Generate New</Text>
                )}
              </TouchableOpacity>
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

          {/* Leave Group Action Button */}
          <TouchableOpacity
            onPress={handleLeaveGroup}
            style={styles.leaveGroupBtn}
            activeOpacity={0.8}
            disabled={isLeaving}
          >
            {isLeaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.leaveGroupText}>🚪 Leave Group</Text>
            )}
          </TouchableOpacity>

          {/* Edit Group Name Modal */}
          <Modal
            visible={showEditName}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowEditName(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setShowEditName(false)}
              activeOpacity={1}
            >
              <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Edit Group Name</Text>
                  <TouchableOpacity
                    onPress={() => setShowEditName(false)}
                    style={styles.modalCloseBtn}
                    activeOpacity={0.7}
                  >
                    <X color={COLORS.textSecondary} size={14} />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    value={newName}
                    onChangeText={setNewName}
                    placeholder="Enter new group name"
                    placeholderTextColor={COLORS.placeholder}
                    autoFocus
                  />
                </View>

                <TouchableOpacity
                  onPress={handleUpdateName}
                  style={styles.saveBtn}
                  activeOpacity={0.8}
                  disabled={isUpdatingName || !newName.trim()}
                >
                  {isUpdatingName ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.saveBtnText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
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
  groupHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editNameBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(232, 160, 32, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(232, 160, 32, 0.3)',
  },
  editText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
  regenCodeBtn: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(232, 160, 32, 0.08)',
    borderWidth: 1.2,
    borderColor: 'rgba(232, 160, 32, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  regenText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  leaveGroupBtn: {
    height: 50,
    backgroundColor: '#d4183d',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
    ...SHADOWS.md,
  },
  leaveGroupText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1.2,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    ...SHADOWS.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'sans-serif',
  },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    height: 52,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginBottom: 16,
  },
  textInput: {
    color: COLORS.text,
    fontSize: 15,
    fontFamily: 'sans-serif',
  },
  saveBtn: {
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  saveBtnText: {
    color: '#1a0e07',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
});
