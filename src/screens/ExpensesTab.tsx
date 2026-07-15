import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';
import { ChevronRight } from '../components/CustomIcon';

export type BazarUnit = 'KG' | 'PIECE' | 'GM';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
}

export interface MockProduct {
  id: string;
  name: string;
  emoji: string;
}

export interface MockBazarEntry {
  id: string;
  product: MockProduct;
  price: number;
  quantity: number;
  unit: BazarUnit;
  date: string; // Keep as string for mobile ease or Date
  notes?: string;
  user: MockUser;
}

// Helper to format currency
export function fmtFull(n: number) {
  return `৳${n.toLocaleString()}`;
}

// Initials helper
export function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

// Avatar color helper
export const AVATAR_COLORS = ['#c06010', '#8b6914', '#3d7a5c', '#5a4a8a', '#7a3d3d'];
export function avatarColor(id: string) {
  return AVATAR_COLORS[id.charCodeAt(1) % AVATAR_COLORS.length];
}

// Avatar Component
export function Avatar({ user, size = 36 }: { user: MockUser; size?: number }) {
  if (user.profileImage) {
    return (
      <Image
        source={{ uri: user.profileImage }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
      />
    );
  }
  const bgColor = avatarColor(user.id);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bgColor,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontSize: size * 0.36, fontWeight: 'bold' }}>
        {initials(user.name)}
      </Text>
    </View>
  );
}

// Filter Tabs Component
interface FilterTabsProps {
  active: 'month' | 'all';
  onChange: (v: 'month' | 'all') => void;
}

export function FilterTabs({ active, onChange }: FilterTabsProps) {
  return (
    <View style={styles.filterTabsContainer}>
      {(['month', 'all'] as const).map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => onChange(tab)}
          style={[
            styles.filterTabBtn,
            active === tab && {
              backgroundColor: COLORS.primary,
              ...SHADOWS.sm,
            },
          ]}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.filterTabText,
              active === tab && {
                color: '#1a0e07',
                fontWeight: 'bold',
              },
            ]}
          >
            {tab === 'month' ? 'This Month' : 'All'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ExpenseRow Component
interface ExpenseRowProps {
  entry: MockBazarEntry;
  onClick: () => void;
}

export function ExpenseRow({ entry, onClick }: ExpenseRowProps) {
  const total = entry.price * entry.quantity;
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[styles.expenseRowCard, SHADOWS.sm]}
      activeOpacity={0.8}
    >
      <View style={styles.emojiContainer}>
        <Text style={styles.emojiText}>{entry.product.emoji}</Text>
      </View>
      
      <View style={styles.centerInfo}>
        <Text style={styles.productName}>{entry.product.name}</Text>
        <View style={styles.userRow}>
          <Avatar user={entry.user} size={16} />
          <Text style={styles.userName} numberOfLines={1}>
            {entry.user.name}
          </Text>
        </View>
        <Text style={styles.quantityText}>
          {entry.quantity} {entry.unit} · {entry.date}
        </Text>
      </View>

      <View style={styles.rightInfo}>
        <Text style={styles.totalAmount}>{fmtFull(total)}</Text>
        <Text style={styles.unitPriceText}>৳{entry.price}/{entry.unit}</Text>
        <ChevronRight color={COLORS.textSecondary} size={14} style={{ marginTop: 2 }} />
      </View>
    </TouchableOpacity>
  );
}

interface ExpensesTabProps {
  entries: MockBazarEntry[];
  onDetail: (e: MockBazarEntry) => void;
}

export default function ExpensesTab({ entries, onDetail }: ExpensesTabProps) {
  const [filter, setFilter] = useState<'month' | 'all'>('month');

  // For visual demo, we can mock that items with "Today", "Yesterday", or "July 12" belong to "This Month"
  const filtered = filter === 'month' 
    ? entries.filter(e => e.date.toLowerCase().includes('today') || e.date.toLowerCase().includes('yesterday') || e.date.toLowerCase().includes('12') || e.date.toLowerCase().includes('10'))
    : entries;

  const total = filtered.reduce((s, e) => s + e.price * e.quantity, 0);

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Bazar <Text style={{ color: COLORS.primary }}>Expenses</Text>
        </Text>
        <Text style={styles.headerSubtitle}>
          {filtered.length} entries · <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontFamily: 'monospace' }}>{fmtFull(total)}</Text>
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
          <ExpenseRow entry={item} onClick={() => onDetail(item)} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={styles.emptyText}>No expenses this month</Text>
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
  filterTabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 4,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  filterTabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  expenseRowCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1.2,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primaryGlow,
    borderColor: 'rgba(232, 160, 32, 0.2)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emojiText: {
    fontSize: 22,
  },
  centerInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 8,
  },
  productName: {
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
  quantityText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
  rightInfo: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  totalAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'monospace',
  },
  unitPriceText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    marginTop: 2,
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
