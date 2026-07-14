import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';
import { X, ChevronRight } from '../components/CustomIcon';

interface AddPickerProps {
  visible: boolean;
  onExpense: () => void;
  onBill: () => void;
  onClose: () => void;
}

export default function AddPicker({ visible, onExpense, onBill, onClose }: AddPickerProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Entry</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.modalCloseBtn}
              activeOpacity={0.7}
            >
              <X color={COLORS.textSecondary} size={14} />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsWrapper}>
            {/* Option 1: Add Expense */}
            <TouchableOpacity
              style={styles.optionCard}
              onPress={onExpense}
              activeOpacity={0.9}
            >
              <View style={[styles.iconCircle, { backgroundColor: COLORS.primary }]}>
                <ShoppingBagIcon color={COLORS.background} />
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.optionTitle}>Add Expense</Text>
                <Text style={styles.optionSubtitle}>
                  Record a bazar purchase with product, price & quantity
                </Text>
              </View>
              <ChevronRight color={COLORS.textSecondary} size={16} />
            </TouchableOpacity>

            {/* Option 2: Add Bill */}
            <TouchableOpacity
              style={[styles.optionCard, { borderColor: 'rgba(192, 96, 16, 0.4)' }]}
              onPress={onBill}
              activeOpacity={0.9}
            >
              <View style={[styles.iconCircle, { backgroundColor: COLORS.accent }]}>
                <ReceiptIcon color="#fff" />
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.optionTitle}>Add Bill</Text>
                <Text style={styles.optionSubtitle}>
                  Log rent, utilities, subscriptions and other bills
                </Text>
              </View>
              <ChevronRight color={COLORS.textSecondary} size={16} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// Simple ShoppingBag vector representation
function ShoppingBagIcon({ color }: { color: string }) {
  return (
    <View style={{ width: 18, height: 18, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{
        width: 12,
        height: 12,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: 2,
        position: 'absolute',
        bottom: 1,
      }} />
      <View style={{
        width: 6,
        height: 6,
        borderWidth: 1.5,
        borderColor: color,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        position: 'absolute',
        top: 2,
        borderBottomWidth: 0,
      }} />
    </View>
  );
}

// Simple Receipt vector representation
function ReceiptIcon({ color }: { color: string }) {
  return (
    <View style={{ width: 18, height: 18, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{
        width: 12,
        height: 14,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: 2,
      }}>
        {/* receipt lines */}
        <View style={{ width: 6, height: 1.2, backgroundColor: color, alignSelf: 'center', marginTop: 3 }} />
        <View style={{ width: 6, height: 1.2, backgroundColor: color, alignSelf: 'center', marginTop: 2 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1.2,
    borderColor: COLORS.border,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'serif',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsWrapper: {
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(232, 160, 32, 0.04)',
    gap: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  textWrapper: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'sans-serif',
  },
  optionSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    marginTop: 4,
    lineHeight: 16,
  },
});
