import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft } from '../components/CustomIcon';
import { MockBill, BILL_META } from './BillsTab';
import { Avatar, fmtFull } from './ExpensesTab';
import { DeleteConfirm } from './ExpenseDetailScreen';
import { useDeleteBillMutation } from '../redux/features/bill/billApi';

interface BillDetailScreenProps {
  bill: MockBill;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function BillDetailScreen({
  bill,
  onBack,
  onEdit,
  onDelete,
}: BillDetailScreenProps) {
  const meta = BILL_META[bill.category];
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteBill, { isLoading: isDeleting }] = useDeleteBillMutation();

  const handleDelete = async () => {
    try {
      await deleteBill(bill.id).unwrap();
      onDelete();
    } catch (err) {
      // Silently handle error
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Nav Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft color={COLORS.textSecondary} size={16} />
          <Text style={styles.backBtnText}>Bills</Text>
        </TouchableOpacity>

        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={onEdit} style={styles.editBtn} activeOpacity={0.7}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setConfirmDelete(true)}
            style={styles.deleteBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: COLORS.surface,
              borderColor: `${meta.color}50`,
            },
            SHADOWS.lg,
          ]}
        >
          <View style={{ marginBottom: 12 }}>
            {meta.icon({ color: meta.color, size: 48 })}
          </View>
          <Text style={styles.heroTitle}>{bill.title}</Text>
          <Text style={[styles.heroAmount, { color: meta.color }]}>
            {fmtFull(bill.amount)}
          </Text>
          
          <View style={[styles.categoryBadge, { backgroundColor: `${meta.color}20` }]}>
            <Text style={[styles.categoryBadgeText, { color: meta.color }]}>
              {meta.label}
            </Text>
          </View>
        </View>

        {/* Details list */}
        <View style={styles.detailsList}>
          {/* Row 1: Date */}
          <View style={styles.detailCard}>
            <View style={styles.detailIconCircle}>
              <Text style={styles.detailIconText}>📅</Text>
            </View>
            <View style={styles.detailTextWrapper}>
              <Text style={styles.detailLabel}>Payment Date</Text>
              <Text style={styles.detailValue}>{bill.date}</Text>
            </View>
          </View>

          {/* Row 2: Paid by user */}
          <View style={styles.detailCard}>
            <Avatar user={bill.user} size={36} />
            <View style={styles.detailTextWrapper}>
              <Text style={styles.detailLabel}>Paid by</Text>
              <Text style={styles.detailValue}>{bill.user.name}</Text>
              <Text style={styles.detailSubValue}>{bill.user.phone}</Text>
            </View>
          </View>

          {/* Row 3: Notes (Optional) */}
          {bill.notes ? (
            <View style={styles.detailCard}>
              <View style={styles.detailIconCircle}>
                <Text style={styles.detailIconText}>📝</Text>
              </View>
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>Notes</Text>
                <Text style={styles.detailNotesText}>{bill.notes}</Text>
              </View>
            </View>
          ) : null}

          {/* Delete confirmation section */}
          {confirmDelete && (
            <DeleteConfirm
              label="Bill"
              onConfirm={handleDelete}
              onCancel={() => setConfirmDelete(false)}
            />
          )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtnText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: 'sans-serif',
    marginLeft: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(232, 160, 32, 0.4)',
    backgroundColor: 'rgba(232, 160, 32, 0.1)',
  },
  editBtnText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 24, 61, 0.4)',
    backgroundColor: 'rgba(212, 24, 61, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#d4183d',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 20,
  },
  heroCard: {
    borderWidth: 1.2,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'serif',
    marginBottom: 6,
  },
  heroAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  detailsList: {
    gap: 12,
  },
  detailCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1.2,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primaryGlow,
    borderColor: 'rgba(232, 160, 32, 0.25)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailIconText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  detailTextWrapper: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: 'monospace',
  },
  detailSubValue: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  detailNotesText: {
    fontSize: 13,
    color: COLORS.text,
    fontFamily: 'sans-serif',
    lineHeight: 18,
  },
});
