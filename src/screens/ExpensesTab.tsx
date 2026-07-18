import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';
import { ChevronRight } from '../components/CustomIcon';
import { useLazyGetBazarEntriesQuery, useLazyGetBazarEntryStatsQuery } from '../redux/features/bazarEntry/bazarEntryApi';

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

function getEmojiForProduct(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('onion') || n.includes('pyaj')) return '🧅';
  if (n.includes('potato') || n.includes('alu')) return '🥔';
  if (n.includes('tomato')) return '🍅';
  if (n.includes('fish') || n.includes('mach')) return '🐟';
  if (n.includes('meat') || n.includes('beef') || n.includes('chicken') || n.includes('murgi')) return '🍗';
  if (n.includes('egg') || n.includes('dim')) return '🥚';
  if (n.includes('oil') || n.includes('tel')) return '🫙';
  if (n.includes('garlic') || n.includes('rosun')) return '🧄';
  if (n.includes('dal') || n.includes('lentil')) return '🫘';
  if (n.includes('rice') || n.includes('chal')) return '🌾';
  return '🛒';
}

function formatDateDisplay(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const today = new Date();
  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

  return isToday ? `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : dayStr;
}

function mapApiToMockEntry(item: any): MockBazarEntry {
  const productName = item.product?.name || item.name || 'Unknown Item';
  return {
    id: item._id,
    product: {
      id: item.product?._id || 'p_' + item._id,
      name: productName,
      emoji: getEmojiForProduct(productName),
    },
    price: item.price,
    quantity: item.quantity,
    unit: item.unit,
    date: formatDateDisplay(item.date),
    notes: item.notes || undefined,
    user: {
      id: item.user?._id || 'u_unknown',
      name: item.user?.name || 'Unknown User',
      email: item.user?.email || '',
      phone: item.user?.phone || '',
      profileImage: item.user?.profileImage,
    },
  };
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

export default function ExpensesTab({ entries: propEntries, onDetail }: ExpensesTabProps) {
  const [filter, setFilter] = useState<'month' | 'all'>('month');
  const [bazarList, setBazarList] = useState<MockBazarEntry[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [triggerGetBazarEntries, { isFetching, isLoading }] = useLazyGetBazarEntriesQuery();
  const [triggerGetStats] = useLazyGetBazarEntryStatsQuery();

  const loadData = async (targetPage: number, isRefreshing: boolean = false) => {
    try {
      const params: any = {
        page: targetPage,
        limit: 15,
      };
      if (filter !== 'month') {
        params.filter = 'ALL';
      }

      const result = await triggerGetBazarEntries(params).unwrap();
      if (result?.success) {
        const mapped = result.data.map(mapApiToMockEntry);
        if (isRefreshing || targetPage === 1) {
          setBazarList(mapped);
        } else {
          setBazarList((prev) => [...prev, ...mapped]);
        }
        setHasNext(result.meta?.hasNext || false);
        setPage(targetPage);
      }

      // Fetch stats (totalEntries + totalAmount) from the dedicated stats endpoint
      if (targetPage === 1) {
        const statsParams: any = {};
        if (filter !== 'month') {
          statsParams.filter = 'ALL';
        }
        try {
          const statsResult = await triggerGetStats(statsParams).unwrap();
          if (statsResult?.success) {
            setTotalCost(statsResult.data.totalAmount || 0);
            setTotalItems(statsResult.data.totalEntries || 0);
          }
        } catch (statsErr) {
          console.log('Failed to fetch bazar stats:', statsErr);
        }
      }
    } catch (err) {
      console.log('Failed to fetch bazar entries:', err);
    }
  };

  useEffect(() => {
    loadData(1, true);
  }, [filter]);

  const handleRefresh = () => {
    loadData(1, true);
  };

  const handleLoadMore = () => {
    if (hasNext && !isFetching) {
      loadData(page + 1, false);
    }
  };

  const renderFooter = () => {
    if (!isFetching || page === 1) return null;
    return (
      <View style={{ paddingVertical: 20, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  const now = new Date();
  const currentMonthName = now.toLocaleString('en-US', { month: 'long' });

  if (isLoading && page === 1) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Bazar <Text style={{ color: COLORS.primary }}>Expenses</Text>
        </Text>
        <Text style={styles.headerSubtitle}>
          {totalItems} entries · <Text style={{ color: COLORS.primary, fontWeight: 'bold', fontFamily: 'monospace' }}>{fmtFull(totalCost || 0)}</Text>
          {filter === 'month' && <Text style={{ color: COLORS.textSecondary }}> in {currentMonthName}</Text>}
        </Text>
      </View>

      {/* Filter Tabs */}
      <FilterTabs active={filter} onChange={setFilter} />

      {/* List */}
      <FlatList
        data={bazarList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseRow entry={item} onClick={() => onDetail(item)} />
        )}
        contentContainerStyle={styles.listContent}
        refreshing={isFetching && page === 1}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={styles.emptyText}>
              {filter === 'month' ? `No expenses logged in ${currentMonthName}` : 'No expenses logged yet'}
            </Text>
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
