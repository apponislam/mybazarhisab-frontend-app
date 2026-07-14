import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';
import { ChevronRight } from '../components/CustomIcon';
import { MockUser, Avatar, FilterTabs, fmtFull } from './ExpensesTab';

export type BillCategory =
  | 'RENT' | 'TRAVEL' | 'WIFI' | 'ELECTRICITY' | 'GAS' | 'WATER'
  | 'MAID' | 'MAINTENANCE' | 'SUBSCRIPTION' | 'MOBILE' | 'MEDICAL'
  | 'EDUCATION' | 'SHOPPING' | 'ENTERTAINMENT' | 'LAUNDRY' | 'LOAN_EMI'
  | 'SALON_GROOMING' | 'GIFTS_FESTIVALS' | 'UTILITIES' | 'OTHERS';

export interface MockBill {
  id: string;
  user: MockUser;
  category: BillCategory;
  title: string;
  amount: number;
  date: string;
  notes?: string;
}

export const BILL_META: Record<BillCategory, { label: string; emoji: string; color: string }> = {
  RENT:           { label: 'Rent',         emoji: '🏠', color: '#e8a020' },
  TRAVEL:         { label: 'Travel',       emoji: '🚗', color: '#3b82f6' },
  WIFI:           { label: 'Wi-Fi',        emoji: '📶', color: '#06b6d4' },
  ELECTRICITY:    { label: 'Electricity',  emoji: '⚡', color: '#f59e0b' },
  GAS:            { label: 'Gas',          emoji: '🔥', color: '#f97316' },
  WATER:          { label: 'Water',        emoji: '💧', color: '#60a5fa' },
  MAID:           { label: 'Maid',         emoji: '✨', color: '#a78bfa' },
  MAINTENANCE:    { label: 'Maintenance',  emoji: '🔧', color: '#78716c' },
  SUBSCRIPTION:   { label: 'Subscription', emoji: '💳', color: '#ec4899' },
  MOBILE:         { label: 'Mobile',       emoji: '📱', color: '#34d399' },
  MEDICAL:        { label: 'Medical',      emoji: '❤️', color: '#f43f5e' },
  EDUCATION:      { label: 'Education',    emoji: '🎓', color: '#8b5cf6' },
  SHOPPING:       { label: 'Shopping',     emoji: '🛍️', color: '#c06010' },
  ENTERTAINMENT:  { label: 'Entertainment',emoji: '📺', color: '#6366f1' },
  LAUNDRY:        { label: 'Laundry',      emoji: '👕', color: '#14b8a6' },
  LOAN_EMI:       { label: 'Loan / EMI',   emoji: '💵', color: '#ef4444' },
  SALON_GROOMING: { label: 'Salon',        emoji: '✂️', color: '#d946ef' },
  GIFTS_FESTIVALS:{ label: 'Gifts',        emoji: '🎁', color: '#f59e0b' },
  UTILITIES:      { label: 'Utilities',    emoji: '⚙️', color: '#94a3b8' },
  OTHERS:         { label: 'Others',       emoji: '💬', color: '#64748b' },
};

export const BILL_CATEGORIES = Object.entries(BILL_META).map(([k, v]) => ({
  key: k as BillCategory,
  ...v,
}));

// BillRow Component
interface BillRowProps {
  bill: MockBill;
  onClick: () => void;
}

export function BillRow({ bill, onClick }: BillRowProps) {
  const meta = BILL_META[bill.category];
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[styles.billRowCard, SHADOWS.sm]}
      activeOpacity={0.8}
    >
      {/* Colored Icon box */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: `${meta.color}20`,
            borderColor: `${meta.color}40`,
          },
        ]}
      >
        <Text style={styles.iconText}>{meta.emoji}</Text>
      </View>

      <View style={styles.centerInfo}>
        <Text style={styles.billTitle}>{bill.title}</Text>
        <View style={styles.userRow}>
          <Avatar user={bill.user} size={16} />
          <Text style={styles.userName} numberOfLines={1}>
            {bill.user.name}
          </Text>
        </View>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: `${meta.color}18` }]}>
            <Text style={[styles.badgeText, { color: meta.color }]}>{meta.label}</Text>
          </View>
          <Text style={styles.dateText}>{bill.date}</Text>
        </View>
      </View>

      <View style={styles.rightInfo}>
        <Text style={styles.amountText}>{fmtFull(bill.amount)}</Text>
        <ChevronRight color={COLORS.textSecondary} size={14} style={{ marginTop: 2 }} />
      </View>
    </TouchableOpacity>
  );
}

interface BillsTabProps {
  bills: MockBill[];
  onDetail: (b: MockBill) => void;
}

export default function BillsTab({ bills, onDetail }: BillsTabProps) {
  const [filter, setFilter] = useState<'month' | 'all'>('month');

  // For visual demo, filter to items within July (month)
  const filtered = filter === 'month'
    ? bills.filter(b => b.date.toLowerCase().includes('today') || b.date.toLowerCase().includes('yesterday') || b.date.toLowerCase().includes('july') || b.date.toLowerCase().includes('5') || b.date.toLowerCase().includes('8'))
    : bills;

  const total = filtered.reduce((s, b) => s + b.amount, 0);

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Group <Text style={{ color: COLORS.accent }}>Bills</Text>
        </Text>
        <Text style={styles.headerSubtitle}>
          {filtered.length} bills · <Text style={{ color: COLORS.accent, fontWeight: 'bold', fontFamily: 'monospace' }}>{fmtFull(total)}</Text>
          {filter === 'month' && <Text style={{ color: COLORS.textSecondary }}> in July</Text>}
        </Text>
      </View>

      {/* Filter Tabs */}
      <FilterTabs active={filter} onChange={setFilter} />

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BillRow bill={item} onClick={() => onDetail(item)} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📄</Text>
            <Text style={styles.emptyText}>No bills logged this month</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
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
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  billRowCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1.2,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 22,
  },
  centerInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 8,
  },
  billTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'sans-serif',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 4,
  },
  userName: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  dateText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
  },
  rightInfo: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amountText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
  },
});
