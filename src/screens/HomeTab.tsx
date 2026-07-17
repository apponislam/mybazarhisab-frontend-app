import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';
import { GroupStats } from './GroupPickerScreen';
import {
  ShoppingBag,
  BookOpen,
  Package,
  Calendar,
  ChevronUp,
  ChevronDown,
  TrendingUp,
} from '../components/CustomIcon';

const { width } = Dimensions.get('window');

// Formatting helpers
function fmt(n: number) {
  if (n >= 100000) return `৳${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `৳${(n / 1000).toFixed(1)}K`;
  return `৳${n.toLocaleString()}`;
}

// Delta component for MoM percentage comparisons
function Delta({ current, prev }: { current: number; prev: number }) {
  if (prev === 0) return null;
  const pct = Math.round(((current - prev) / prev) * 100);
  const up = pct >= 0;
  return (
    <View style={styles.deltaRow}>
      {up ? (
        <ChevronUp color="#22c55e" size={12} />
      ) : (
        <ChevronDown color="#ef4444" size={12} />
      )}
      <Text style={[styles.deltaText, { color: up ? '#22c55e' : '#ef4444' }]}>
        {Math.abs(pct)}%
      </Text>
    </View>
  );
}

// StatCard Component
interface StatCardProps {
  label: string;
  value: number;
  prev?: number;
  icon: React.ReactNode;
  accent?: boolean;
}

function StatCard({ label, value, prev, icon, accent = false }: StatCardProps) {
  return (
    <View style={[styles.statCard, SHADOWS.sm]}>
      <View style={styles.statCardHeader}>
        <View
          style={[
            styles.statIconBox,
            {
              backgroundColor: accent ? 'rgba(192, 96, 16, 0.15)' : 'rgba(232, 160, 32, 0.12)',
              borderColor: accent ? 'rgba(192, 96, 16, 0.3)' : 'rgba(232, 160, 32, 0.25)',
            },
          ]}
        >
          {icon}
        </View>
        {prev !== undefined && <Delta current={value} prev={prev} />}
      </View>
      <Text style={styles.statCardValue}>{fmt(value)}</Text>
      <Text style={styles.statCardLabel}>{label}</Text>
    </View>
  );
}

// CountCard Component
interface CountCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

function CountCard({ label, value, icon }: CountCardProps) {
  return (
    <View style={[styles.countCard, SHADOWS.sm]}>
      <View style={styles.countIconBox}>{icon}</View>
      <View style={styles.countTextWrapper}>
        <Text style={styles.countValue}>{value.toLocaleString()}</Text>
        <Text style={styles.countLabel}>{label}</Text>
      </View>
    </View>
  );
}

// Section Label Divider
function SectionLabel({ children }: { children: string }) {
  return (
    <View style={styles.sectionLabelRow}>
      <Text style={styles.sectionLabelText}>{children}</Text>
      <View style={styles.sectionLabelLine} />
    </View>
  );
}

interface HomeTabProps {
  stats: GroupStats;
}

export default function HomeTab({ stats }: HomeTabProps) {
  const now = new Date();
  const mn = now.toLocaleString('default', { month: 'long' });
  const yr = now.getFullYear();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Group Title Section */}
      <View style={styles.groupHeader}>
        <View style={styles.headerInfo}>
          <Text style={styles.groupNameText}>{stats.groupName}</Text>
          <Text style={styles.groupMetaText}>Hisab Overview</Text>
        </View>
        <View style={styles.membersBadge}>
          <Text style={styles.membersBadgeText}>{stats.totalMembers} members</Text>
        </View>
      </View>
      <View style={styles.divider} />

      {/* Overview Counts */}
      <SectionLabel>Overview</SectionLabel>
      <View style={styles.gridRow}>
        <View style={styles.flexHalf}>
          <CountCard
            label="Group Bazar & Bills"
            value={stats.totalGroupBazarAndBills}
            icon={<ShoppingBag color={COLORS.primary} size={18} />}
          />
        </View>
        <View style={styles.flexHalf}>
          <CountCard
            label="My Bazar & Bills"
            value={stats.totalMyBazarAndBills}
            icon={<BookOpen color={COLORS.primary} size={18} />}
          />
        </View>
      </View>
      <View style={{ marginTop: 2 }}>
        <CountCard
          label="Products Created by Me"
          value={stats.totalNewProductsCreatedByMe}
          icon={<Package color={COLORS.primary} size={18} />}
        />
      </View>

      {/* Bazar Expense */}
      <SectionLabel>Bazar Expense</SectionLabel>
      <View style={styles.gridRow}>
        <View style={styles.flexHalf}>
          <StatCard
            label={`${mn} Bazar`}
            value={stats.thisMonthBazarExpense}
            prev={stats.prevMonthBazarExpense}
            icon={<ShoppingBag color={COLORS.primary} size={16} />}
          />
        </View>
        <View style={styles.flexHalf}>
          <StatCard
            label="Prev Month"
            value={stats.prevMonthBazarExpense}
            icon={<ShoppingBag color={COLORS.textSecondary} size={16} />}
          />
        </View>
      </View>
      <View style={styles.gridRow}>
        <View style={styles.flexHalf}>
          <StatCard
            label={`${yr} Bazar`}
            value={stats.thisYearBazarExpense}
            prev={stats.prevYearBazarExpense}
            icon={<Calendar color={COLORS.primary} size={16} />}
          />
        </View>
        <View style={styles.flexHalf}>
          <StatCard
            label={`${yr - 1} Bazar`}
            value={stats.prevYearBazarExpense}
            icon={<Calendar color={COLORS.textSecondary} size={16} />}
          />
        </View>
      </View>

      {/* Bill Expense */}
      <SectionLabel>Bill Expense</SectionLabel>
      <View style={styles.gridRow}>
        <View style={styles.flexHalf}>
          <StatCard
            label={`${mn} Bills`}
            value={stats.thisMonthBillExpense}
            prev={stats.prevMonthBillExpense}
            icon={<Calendar color={COLORS.accent} size={16} />}
            accent
          />
        </View>
        <View style={styles.flexHalf}>
          <StatCard
            label="Prev Month"
            value={stats.prevMonthBillExpense}
            icon={<Calendar color={COLORS.textSecondary} size={16} />}
            accent
          />
        </View>
      </View>
      <View style={styles.gridRow}>
        <View style={styles.flexHalf}>
          <StatCard
            label={`${yr} Bills`}
            value={stats.thisYearBillExpense}
            prev={stats.prevYearBillExpense}
            icon={<TrendingUp color={COLORS.accent} size={16} />}
            accent
          />
        </View>
        <View style={styles.flexHalf}>
          <StatCard
            label={`${yr - 1} Bills`}
            value={stats.prevYearBillExpense}
            icon={<TrendingUp color={COLORS.textSecondary} size={16} />}
            accent
          />
        </View>
      </View>

      {/* Total Expense Summary Hero */}
      <SectionLabel>Total Expense</SectionLabel>
      <View style={[styles.heroCard, SHADOWS.lg]}>
        <Text style={styles.heroPreTitle}>{mn} {yr} — Total</Text>
        <Text style={styles.heroAmount}>{fmt(stats.thisMonthTotalExpense)}</Text>
        <View style={styles.heroComparisonRow}>
          <Delta current={stats.thisMonthTotalExpense} prev={stats.prevMonthTotalExpense} />
          <Text style={styles.heroComparisonText}>
            {"  "}vs {fmt(stats.prevMonthTotalExpense)} last month
          </Text>
        </View>
      </View>

      <View style={styles.gridRow}>
        <View style={styles.flexHalf}>
          <StatCard
            label={`${yr} Grand Total`}
            value={stats.thisYearTotalExpense}
            prev={stats.prevYearTotalExpense}
            icon={<TrendingUp color={COLORS.primary} size={16} />}
          />
        </View>
        <View style={styles.flexHalf}>
          <StatCard
            label={`${yr - 1} Grand Total`}
            value={stats.prevYearTotalExpense}
            icon={<Package color={COLORS.textSecondary} size={16} />}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    paddingRight: 12,
  },
  groupNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'serif',
  },
  groupMetaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    marginTop: 2,
  },
  membersBadge: {
    backgroundColor: COLORS.primaryGlow,
    borderWidth: 1,
    borderColor: 'rgba(232, 160, 32, 0.3)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  membersBadgeText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 4,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  sectionLabelText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sectionLabelLine: {
    flex: 1,
    height: 1.2,
    backgroundColor: COLORS.border,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  flexHalf: {
    flex: 1,
  },
  countCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1.2,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primaryGlow,
    borderColor: 'rgba(232,160,32,0.25)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countTextWrapper: {
    flex: 1,
  },
  countValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'monospace',
  },
  countLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    marginTop: 2,
  },
  statCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1.2,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'monospace',
  },
  statCardLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    lineHeight: 14,
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  deltaText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  heroCard: {
    backgroundColor: COLORS.surface,
    borderColor: 'rgba(232, 160, 32, 0.35)',
    borderWidth: 1.2,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  heroPreTitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroAmount: {
    fontSize: 34,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'monospace',
    marginVertical: 8,
  },
  heroComparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroComparisonText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
  },
});
