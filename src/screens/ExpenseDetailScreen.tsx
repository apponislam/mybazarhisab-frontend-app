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
import { ArrowLeft, User } from '../components/CustomIcon';
import { MockBazarEntry, Avatar, fmtFull } from './ExpensesTab';

interface ExpenseDetailScreenProps {
  entry: MockBazarEntry;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

// Delete Confirm Component
interface DeleteConfirmProps {
  label: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirm({ label, onConfirm, onCancel }: DeleteConfirmProps) {
  return (
    <View style={styles.deleteConfirmCard}>
      <View style={styles.deleteHeaderRow}>
        <Text style={styles.deleteHeaderIcon}>⚠️</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.deleteTitle}>Delete {label}?</Text>
          <Text style={styles.deleteSubtitle}>This action cannot be undone.</Text>
        </View>
      </View>
      <View style={styles.deleteActions}>
        <TouchableOpacity
          style={styles.deleteCancelBtn}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteCancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteSubmitBtn}
          onPress={onConfirm}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteSubmitText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ExpenseDetailScreen({
  entry,
  onBack,
  onEdit,
  onDelete,
}: ExpenseDetailScreenProps) {
  const total = entry.price * entry.quantity;
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <View style={styles.container}>
      {/* Top Nav Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft color={COLORS.textSecondary} size={16} />
          <Text style={styles.backBtnText}>Expenses</Text>
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
            <Text style={styles.deleteBtnText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View style={[styles.heroCard, SHADOWS.lg]}>
          <Text style={styles.heroEmoji}>{entry.product.emoji}</Text>
          <Text style={styles.heroTitle}>{entry.product.name}</Text>
          <Text style={styles.heroAmount}>{fmtFull(total)}</Text>
          <Text style={styles.heroSubtitle}>
            ৳{entry.price} × {entry.quantity} {entry.unit}
          </Text>
        </View>

        {/* Detail Rows */}
        <View style={styles.detailsList}>
          {/* Row 1: Quantity */}
          <View style={styles.detailCard}>
            <View style={styles.detailIconCircle}>
              <Text style={styles.detailIconText}>⚖️</Text>
            </View>
            <View style={styles.detailTextWrapper}>
              <Text style={styles.detailLabel}>Quantity</Text>
              <Text style={styles.detailValue}>
                {entry.quantity} {entry.unit}
              </Text>
            </View>
          </View>

          {/* Row 2: Unit Price */}
          <View style={styles.detailCard}>
            <View style={styles.detailIconCircle}>
              <Text style={styles.detailIconText}>৳</Text>
            </View>
            <View style={styles.detailTextWrapper}>
              <Text style={styles.detailLabel}>Unit Price</Text>
              <Text style={styles.detailValue}>
                ৳{entry.price} / {entry.unit}
              </Text>
            </View>
          </View>

          {/* Row 3: Date */}
          <View style={styles.detailCard}>
            <View style={styles.detailIconCircle}>
              <Text style={styles.detailIconText}>📅</Text>
            </View>
            <View style={styles.detailTextWrapper}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{entry.date}</Text>
            </View>
          </View>

          {/* Row 4: Added by user */}
          <View style={styles.detailCard}>
            <Avatar user={entry.user} size={36} />
            <View style={styles.detailTextWrapper}>
              <Text style={styles.detailLabel}>Added by</Text>
              <Text style={styles.detailValue}>{entry.user.name}</Text>
              <Text style={styles.detailSubValue}>{entry.user.phone}</Text>
            </View>
          </View>

          {/* Row 5: Notes (Optional) */}
          {entry.notes ? (
            <View style={styles.detailCard}>
              <View style={styles.detailIconCircle}>
                <Text style={styles.detailIconText}>📝</Text>
              </View>
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>Notes</Text>
                <Text style={styles.detailNotesText}>{entry.notes}</Text>
              </View>
            </View>
          ) : null}

          {/* Delete confirmation section */}
          {confirmDelete && (
            <DeleteConfirm
              label="Expense"
              onConfirm={onDelete}
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
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 24, 61, 0.4)',
    backgroundColor: 'rgba(212, 24, 61, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: {
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 20,
  },
  heroCard: {
    backgroundColor: COLORS.surface,
    borderColor: 'rgba(232, 160, 32, 0.35)',
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
    color: COLORS.primary,
    fontFamily: 'monospace',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
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
  deleteSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
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
});
