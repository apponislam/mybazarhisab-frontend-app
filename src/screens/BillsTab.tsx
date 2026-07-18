import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';
import {
  ChevronRight,
  Home,
  Car,
  Wifi,
  Zap,
  Flame,
  Droplet,
  Sparkles,
  Wrench,
  CreditCard,
  Phone,
  Heart,
  GraduationCap,
  ShoppingBag,
  Tv,
  Shirt,
  TrendingUp,
  Scissors,
  Gift,
  Settings,
  MessageSquare,
} from '../components/CustomIcon';
import { MockUser, Avatar, FilterTabs, fmtFull } from './ExpensesTab';
import { useLazyGetBillsQuery } from '../redux/features/bill/billApi';

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

export const BILL_META: Record<BillCategory, { label: string; icon: (props: any) => React.ReactNode; color: string; emoji: string }> = {
  RENT:           { label: 'Rent',         icon: (p) => <Home {...p} />,           color: '#e8a020', emoji: '🏠' },
  TRAVEL:         { label: 'Travel',       icon: (p) => <Car {...p} />,           color: '#3b82f6', emoji: '🚗' },
  WIFI:           { label: 'Wi-Fi',        icon: (p) => <Wifi {...p} />,          color: '#06b6d4', emoji: '📶' },
  ELECTRICITY:    { label: 'Electricity',  icon: (p) => <Zap {...p} />,           color: '#f59e0b', emoji: '⚡' },
  GAS:            { label: 'Gas',          icon: (p) => <Flame {...p} />,          color: '#f97316', emoji: '🔥' },
  WATER:          { label: 'Water',        icon: (p) => <Droplet {...p} />,        color: '#60a5fa', emoji: '💧' },
  MAID:           { label: 'Maid',         icon: (p) => <Sparkles {...p} />,       color: '#a78bfa', emoji: '✨' },
  MAINTENANCE:    { label: 'Maintenance',  icon: (p) => <Wrench {...p} />,         color: '#78716c', emoji: '🔧' },
  SUBSCRIPTION:   { label: 'Subscription', icon: (p) => <CreditCard {...p} />,     color: '#ec4899', emoji: '💳' },
  MOBILE:         { label: 'Mobile',       icon: (p) => <Phone {...p} />,          color: '#34d399', emoji: '📱' },
  MEDICAL:        { label: 'Medical',      icon: (p) => <Heart {...p} />,          color: '#f43f5e', emoji: '❤️' },
  EDUCATION:      { label: 'Education',    icon: (p) => <GraduationCap {...p} />,   color: '#8b5cf6', emoji: '🎓' },
  SHOPPING:       { label: 'Shopping',     icon: (p) => <ShoppingBag {...p} />,     color: '#c06010', emoji: '🛍️' },
  ENTERTAINMENT:  { label: 'Entertainment',icon: (p) => <Tv {...p} />,             color: '#6366f1', emoji: '📺' },
  LAUNDRY:        { label: 'Laundry',      icon: (p) => <Shirt {...p} />,          color: '#14b8a6', emoji: '👕' },
  LOAN_EMI:       { label: 'Loan / EMI',   icon: (p) => <TrendingUp {...p} />,     color: '#ef4444', emoji: '💵' },
  SALON_GROOMING: { label: 'Salon',        icon: (p) => <Scissors {...p} />,       color: '#d946ef', emoji: '✂️' },
  GIFTS_FESTIVALS:{ label: 'Gifts',        icon: (p) => <Gift {...p} />,           color: '#f59e0b', emoji: '🎁' },
  UTILITIES:      { label: 'Utilities',    icon: (p) => <Settings {...p} />,       color: '#94a3b8', emoji: '⚙️' },
  OTHERS:         { label: 'Others',       icon: (p) => <MessageSquare {...p} />,  color: '#64748b', emoji: '💬' },
};

export const BILL_CATEGORIES = Object.entries(BILL_META).map(([k, v]) => ({
  key: k as BillCategory,
  ...v,
}));

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

function mapApiToMockBill(item: any): MockBill {
  return {
    id: item._id,
    category: item.category,
    title: item.title,
    amount: item.amount,
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
        {meta.icon({ color: meta.color, size: 22 })}
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

export default function BillsTab({ bills: propBills, onDetail }: BillsTabProps) {
  const [filter, setFilter] = useState<'month' | 'all'>('month');
  const [billsList, setBillsList] = useState<MockBill[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [triggerGetBills, { isFetching, isLoading }] = useLazyGetBillsQuery();

  const loadData = async (targetPage: number, isRefreshing: boolean = false) => {
    try {
      const params: any = {
        page: targetPage,
        limit: 15,
      };
      if (filter !== 'month') {
        params.filter = 'ALL';
      }

      const result = await triggerGetBills(params).unwrap();
      if (result?.success) {
        const mapped = result.data.map(mapApiToMockBill);
        if (isRefreshing || targetPage === 1) {
          setBillsList(mapped);
        } else {
          setBillsList((prev) => [...prev, ...mapped]);
        }
        setHasNext(result.meta?.hasNext || false);
        setPage(targetPage);
        setTotalAmount(result.meta?.totalAmount || 0);
        setTotalItems(result.meta?.total || 0);
      }
    } catch (err) {
      console.log('Failed to fetch bills:', err);
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
        <ActivityIndicator size="small" color={COLORS.accent} />
      </View>
    );
  };

  const now = new Date();
  const currentMonthName = now.toLocaleString('en-US', { month: 'long' });

  if (isLoading && page === 1) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Group <Text style={{ color: COLORS.accent }}>Bills</Text>
        </Text>
        <Text style={styles.headerSubtitle}>
          {totalItems} bills · <Text style={{ color: COLORS.accent, fontWeight: 'bold', fontFamily: 'monospace' }}>{fmtFull(totalAmount || 0)}</Text>
          {filter === 'month' && <Text style={{ color: COLORS.textSecondary }}> in {currentMonthName}</Text>}
        </Text>
      </View>

      {/* Filter Tabs */}
      <FilterTabs active={filter} onChange={setFilter} />

      {/* List */}
      <FlatList
        data={billsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BillRow bill={item} onClick={() => onDetail(item)} />
        )}
        contentContainerStyle={styles.listContent}
        refreshing={isFetching && page === 1}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📄</Text>
            <Text style={styles.emptyText}>
              {filter === 'month' ? `No bills logged in ${currentMonthName}` : 'No bills logged yet'}
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
