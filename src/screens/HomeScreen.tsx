import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';

interface HomeScreenProps {
  userEmail: string;
  onLogout: () => void;
}

interface BazarItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export default function HomeScreen({ userEmail, onLogout }: HomeScreenProps) {
  // Budget States
  const [totalBudget] = useState(15000);
  const [items, setItems] = useState<BazarItem[]>([
    { id: '1', title: 'Rice & Lentils (Monthly)', amount: 1850, category: 'Groceries', date: 'Today, 9:30 AM' },
    { id: '2', title: 'Fresh Fish & Chicken', amount: 950, category: 'Bazar', date: 'Yesterday, 6:00 PM' },
    { id: '3', title: 'Organic Vegetables & Spices', amount: 340, category: 'Bazar', date: 'July 11, 8:15 AM' },
    { id: '4', title: 'Home LED Bulbs (x2)', amount: 450, category: 'Utilities', date: 'July 10, 4:30 PM' },
  ]);

  // Modal & Form States
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Bazar');

  // Calculations
  const totalExpense = items.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBudget = totalBudget - totalExpense;

  const handleAddItem = () => {
    if (!newItemTitle.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }
    const amountNum = parseFloat(newItemAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const newItem: BazarItem = {
      id: Date.now().toString(),
      title: newItemTitle.trim(),
      amount: amountNum,
      category: newItemCategory,
      date: 'Just now',
    };

    setItems([newItem, ...items]);
    setNewItemTitle('');
    setNewItemAmount('');
    setIsModalVisible(false);
  };

  const renderItem = ({ item }: { item: BazarItem }) => {
    // Determine category indicator color
    const catColor = item.category === 'Groceries' ? COLORS.primary :
                     item.category === 'Bazar' ? COLORS.accent : COLORS.warning;

    return (
      <View style={[styles.itemCard, SHADOWS.sm]}>
        <View style={styles.itemLeft}>
          <View style={[styles.categoryIndicator, { backgroundColor: catColor }]} />
          <View>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDetails}>{item.category} • {item.date}</Text>
          </View>
        </View>
        <View style={styles.itemRight}>
          <Text style={styles.itemAmount}>৳{item.amount.toLocaleString()}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Top Header Row */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>Assalamu Alaikum,</Text>
          <Text style={styles.userText}>{userEmail.split('@')[0]}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Main Budget Dashboard Card */}
      <View style={[styles.dashboardCard, SHADOWS.md]}>
        <View style={styles.budgetMainRow}>
          <View>
            <Text style={styles.budgetLabel}>REMAINING LEDGER BUDGET</Text>
            <Text style={[styles.budgetValue, { color: remainingBudget >= 0 ? COLORS.success : COLORS.error }]}>
              ৳{remainingBudget.toLocaleString()}
            </Text>
          </View>
          <View style={styles.badgeContainer}>
            <Text style={styles.monthBadge}>July 2026</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Total Budget</Text>
            <Text style={styles.statValue}>৳{totalBudget.toLocaleString()}</Text>
          </View>
          <View style={styles.statVerticalDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Expenses</Text>
            <Text style={[styles.statValue, { color: COLORS.accent }]}>৳{totalExpense.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* List Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Items</Text>
        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.addNewButton}>
          <Text style={styles.addNewButtonText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Ledger Items FlatList */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items added yet. Click "+ Add Item" to start!</Text>
          </View>
        }
      />

      {/* Add Item Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Bazar Item</Text>

            {/* Input Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.modalLabel}>Item Name</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Eggs and Potato"
                placeholderTextColor={COLORS.placeholder}
                value={newItemTitle}
                onChangeText={setNewItemTitle}
              />
            </View>

            {/* Input Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.modalLabel}>Amount (৳)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 250"
                placeholderTextColor={COLORS.placeholder}
                value={newItemAmount}
                onChangeText={setNewItemAmount}
                keyboardType="numeric"
              />
            </View>

            {/* Category Select */}
            <View style={styles.inputGroup}>
              <Text style={styles.modalLabel}>Category</Text>
              <View style={styles.categoryRow}>
                {['Bazar', 'Groceries', 'Utilities'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryTab,
                      newItemCategory === cat && styles.categoryTabActive,
                    ]}
                    onPress={() => setNewItemCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryTabText,
                        newItemCategory === cat && styles.categoryTabTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSubmit]}
                onPress={handleAddItem}
              >
                <Text style={styles.modalBtnSubmitText}>Add to List</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  greetingText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.caption + 2,
  },
  userText: {
    color: COLORS.text,
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  logoutButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  logoutButtonText: {
    color: COLORS.error,
    fontSize: SIZES.caption + 1,
    fontWeight: '600',
  },
  dashboardCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  budgetMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetLabel: {
    color: COLORS.textMuted,
    fontSize: SIZES.caption,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  budgetValue: {
    fontSize: SIZES.h1 - 2,
    fontWeight: 'bold',
    marginTop: 4,
  },
  badgeContainer: {
    backgroundColor: COLORS.primaryGlow,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  monthBadge: {
    color: COLORS.primaryLight,
    fontSize: SIZES.caption,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.caption + 1,
    marginBottom: 4,
  },
  statValue: {
    color: COLORS.text,
    fontSize: SIZES.h3 - 2,
    fontWeight: 'bold',
  },
  statVerticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.h3,
    fontWeight: 'bold',
  },
  addNewButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusSm,
  },
  addNewButtonText: {
    color: COLORS.background,
    fontSize: SIZES.caption + 1,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  itemCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  categoryIndicator: {
    width: 12,
    height: 12,
    borderRadius: SIZES.radiusFull,
  },
  itemTitle: {
    color: COLORS.text,
    fontSize: SIZES.body - 1,
    fontWeight: '600',
  },
  itemDetails: {
    color: COLORS.textMuted,
    fontSize: SIZES.caption,
    marginTop: 2,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemAmount: {
    color: COLORS.text,
    fontSize: SIZES.body,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: SIZES.body - 2,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  modalLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.caption + 1,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  modalInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SPACING.md,
    height: 48,
    color: COLORS.text,
    fontSize: SIZES.body - 1,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  categoryTab: {
    flex: 1,
    height: 40,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  categoryTabActive: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentGlow,
  },
  categoryTabText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.caption + 1,
    fontWeight: '600',
  },
  categoryTabTextActive: {
    color: COLORS.accent,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  modalBtn: {
    flex: 1,
    height: 48,
    borderRadius: SIZES.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnCancel: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  modalBtnCancelText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  modalBtnSubmit: {
    backgroundColor: COLORS.accent,
  },
  modalBtnSubmitText: {
    color: COLORS.background,
    fontWeight: 'bold',
  },
});
