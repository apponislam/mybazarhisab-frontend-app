import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';

// Redux & API
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { hasGroup as selectHasGroup, currentUser } from '../redux/features/auth/authSlice';
import { useLazyCheckGroupQuery, useGetMyGroupQuery } from '../redux/features/group/groupApi';
import {
  useGetBazarEntriesQuery,
  useUpdateBazarEntryMutation,
  useDeleteBazarEntryMutation,
} from '../redux/features/bazarEntry/bazarEntryApi';

// Custom icons & components
import { BookOpen, ShoppingBag, Calendar, User, Plus } from '../components/CustomIcon';
import AddPicker from '../components/AddPicker';

// Screens & Tabs
import GroupPickerScreen, { GroupStats } from './GroupPickerScreen';
import HomeTab from './HomeTab';
import ExpensesTab, { MockBazarEntry, MockUser, MockProduct } from './ExpensesTab';
import BillsTab, { MockBill } from './BillsTab';
import ProfileTab from './ProfileTab';
import AddExpenseScreen from './AddExpenseScreen';
import AddBillScreen from './AddBillScreen';
import ExpenseDetailScreen from './ExpenseDetailScreen';
import ExpenseEditScreen from './ExpenseEditScreen';
import BillDetailScreen from './BillDetailScreen';
import BillEditScreen from './BillEditScreen';
import EditProfileScreen from './EditProfileScreen';
import ChangePasswordScreen from './ChangePasswordScreen';
import GroupDetailsScreen from './GroupDetailsScreen';

const { width } = Dimensions.get('window');

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

// ─── Initial Mock Data ────────────────────────────────────────────────────────
const MOCK_USERS: MockUser[] = [
  { id: 'u1', name: 'Ahmed Hassan', email: 'ahmed@email.com', phone: '+880 1711 234567' },
  { id: 'u2', name: 'Fatima Begum', email: 'fatima@email.com', phone: '+880 1812 345678' },
  { id: 'u3', name: 'Karim Uddin', email: 'karim@email.com', phone: '+880 1913 456789' },
  { id: 'u4', name: 'Rahima Khatun', email: 'rahima@email.com', phone: '+880 1614 567890' },
];

const MOCK_PRODUCTS: MockProduct[] = [
  { id: 'p1', name: 'Onion', emoji: '🧅' },
  { id: 'p2', name: 'Potato', emoji: '🥔' },
  { id: 'p3', name: 'Tomato', emoji: '🍅' },
  { id: 'p4', name: 'Rice (Miniket)', emoji: '🌾' },
  { id: 'p5', name: 'Hilsha Fish', emoji: '🐟' },
  { id: 'p6', name: 'Chicken', emoji: '🍗' },
  { id: 'p7', name: 'Eggs', emoji: '🥚' },
  { id: 'p8', name: 'Soybean Oil', emoji: '🫙' },
  { id: 'p9', name: 'Garlic', emoji: '🧄' },
  { id: 'p10', name: 'Lentils (Dal)', emoji: '🫘' },
];

const INITIAL_ENTRIES: MockBazarEntry[] = [
  { id: 'e1', product: MOCK_PRODUCTS[4], price: 480, quantity: 1, unit: 'KG', date: 'July 12, 10:15 AM', notes: 'Fresh from Karwan Bazar', user: MOCK_USERS[0] },
  { id: 'e2', product: MOCK_PRODUCTS[3], price: 70, quantity: 5, unit: 'KG', date: 'July 12, 09:30 AM', user: MOCK_USERS[1] },
  { id: 'e3', product: MOCK_PRODUCTS[0], price: 55, quantity: 2, unit: 'KG', date: 'July 11, 06:45 PM', user: MOCK_USERS[2] },
  { id: 'e4', product: MOCK_PRODUCTS[5], price: 220, quantity: 1.5, unit: 'KG', date: 'July 11, 11:20 AM', notes: 'Country chicken', user: MOCK_USERS[0] },
  { id: 'e5', product: MOCK_PRODUCTS[6], price: 145, quantity: 12, unit: 'PIECE', date: 'July 10, 08:30 AM', user: MOCK_USERS[3] },
  { id: 'e6', product: MOCK_PRODUCTS[7], price: 185, quantity: 2, unit: 'PIECE', date: 'July 10, 04:00 PM', notes: '5L bottle', user: MOCK_USERS[1] },
  { id: 'e7', product: MOCK_PRODUCTS[2], price: 60, quantity: 1, unit: 'KG', date: 'June 25, 11:15 AM', user: MOCK_USERS[2] },
  { id: 'e8', product: MOCK_PRODUCTS[9], price: 110, quantity: 500, unit: 'GM', date: 'June 22, 05:30 PM', user: MOCK_USERS[0] },
  { id: 'e9', product: MOCK_PRODUCTS[1], price: 40, quantity: 3, unit: 'KG', date: 'June 18, 08:15 AM', user: MOCK_USERS[3] },
  { id: 'e10', product: MOCK_PRODUCTS[8], price: 30, quantity: 250, unit: 'GM', date: 'June 15, 06:12 PM', notes: 'Local market', user: MOCK_USERS[1] },
];

const INITIAL_BILLS: MockBill[] = [
  { id: 'b1', user: MOCK_USERS[0], category: 'RENT', title: 'House Rent', amount: 18000, date: 'July 5, 2026', notes: 'Paid to landlord Alam saheb' },
  { id: 'b2', user: MOCK_USERS[1], category: 'WIFI', title: 'Grameenphone Broadband', amount: 1200, date: 'July 3, 2026' },
  { id: 'b3', user: MOCK_USERS[2], category: 'ELECTRICITY', title: 'DESCO Bill', amount: 2400, date: 'July 8, 2026', notes: 'AC usage high' },
  { id: 'b4', user: MOCK_USERS[0], category: 'GAS', title: 'Titas Gas Bill', amount: 950, date: 'July 7, 2026' },
  { id: 'b5', user: MOCK_USERS[3], category: 'MAID', title: 'House Maid Salary', amount: 3500, date: 'July 1, 2026' },
  { id: 'b6', user: MOCK_USERS[1], category: 'MOBILE', title: 'Robi Recharge', amount: 500, date: 'July 6, 2026' },
  { id: 'b7', user: MOCK_USERS[2], category: 'MEDICAL', title: 'Square Hospital Visit', amount: 1800, date: 'June 20, 2026', notes: 'Dr. Rahman consultation' },
  { id: 'b8', user: MOCK_USERS[0], category: 'SUBSCRIPTION', title: 'Netflix Monthly', amount: 399, date: 'June 2, 2026' },
];

type AppTabType = 'home' | 'expenses' | 'bills' | 'profile';
type AppSubScreenType =
  | null
  | 'add-picker'
  | 'add-expense'
  | 'add-bill'
  | 'expense-detail'
  | 'expense-edit'
  | 'bill-detail'
  | 'bill-edit'
  | 'profile-edit'
  | 'profile-change-password'
  | 'profile-group-details';

export default function HomeScreen() {
  // Navigation & Screen states
  const [groupStats, setGroupStats] = useState<GroupStats | null>(null);
  const [tab, setTab] = useState<AppTabType>('home');
  const [subScreen, setSubScreen] = useState<AppSubScreenType>(null);
  const [showAddPicker, setShowAddPicker] = useState(false);

  // Lists state
  const [entries, setEntries] = useState<MockBazarEntry[]>([]);
  const [bills, setBills] = useState<MockBill[]>(INITIAL_BILLS);

  // Selected Detail states
  const [selectedEntry, setSelectedEntry] = useState<MockBazarEntry | null>(null);
  const [selectedBill, setSelectedBill] = useState<MockBill | null>(null);

  const loggedInUser = useAppSelector(currentUser);
  const myUserId = loggedInUser?._id || 'u1';

  // Helper calculation update to pass updated totals into Group stats dynamically
  const calculateStats = (groupName: string): GroupStats => {
    const totalBazar = entries.reduce((s, e) => s + e.price * e.quantity, 0);
    const totalBill = bills.reduce((s, b) => s + b.amount, 0);
    
    // My Bazar entries
    const myEntries = entries.filter((e) => e.user.id === myUserId);
    const myBazarExpense = myEntries.reduce((s, e) => s + e.price * e.quantity, 0);
    const myBillExpense = bills.filter((b) => b.user.id === myUserId).reduce((s, b) => s + b.amount, 0);

    return {
      groupName,
      totalMembers: 4,
      totalGroupBazarEntries: entries.length,
      totalMyBazarEntries: myEntries.length,
      totalProductsCreatedByMe: 8,
      thisMonthBazarExpense: totalBazar,
      prevMonthBazarExpense: 10950,
      thisYearBazarExpense: totalBazar + 85000,
      prevYearBazarExpense: 87200,
      thisMonthBillExpense: totalBill,
      prevMonthBillExpense: 5100,
      thisYearBillExpense: totalBill + 39000,
      prevYearBillExpense: 39800,
      thisMonthTotalExpense: totalBazar + totalBill,
      prevMonthTotalExpense: 16050,
      thisYearTotalExpense: totalBazar + totalBill + 124000,
      prevYearTotalExpense: 127000,
    };
  };

  const userHasGroup = useAppSelector(selectHasGroup);
  const [triggerCheckGroup, { isFetching: isChecking }] = useLazyCheckGroupQuery();
  const { data: myGroupData, isFetching: isFetchingGroup } = useGetMyGroupQuery(undefined, {
    skip: !userHasGroup,
  });

  // RTK Query API Hooks
  const { data: bazarData } = useGetBazarEntriesQuery(undefined, {
    skip: !userHasGroup,
  });
  const [updateBazarEntry] = useUpdateBazarEntryMutation();
  const [deleteBazarEntry] = useDeleteBazarEntryMutation();

  // Sync bazar entries from database
  useEffect(() => {
    if (bazarData?.data) {
      setEntries(bazarData.data.map(mapApiToMockEntry));
    }
  }, [bazarData]);

  useEffect(() => {
    if (userHasGroup === null) {
      triggerCheckGroup();
    }
  }, [userHasGroup]);

  useEffect(() => {
    if (userHasGroup === true && myGroupData?.data) {
      setGroupStats(calculateStats(myGroupData.data.name));
    } else if (userHasGroup === false) {
      setGroupStats(null);
    }
  }, [userHasGroup, myGroupData, entries]);

  // If loading or checking membership
  if (userHasGroup === null || isChecking || (userHasGroup === true && isFetchingGroup && !groupStats)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Render Gate 1: Join/Create group selection
  if (userHasGroup === false || !groupStats) {
    return <GroupPickerScreen onGroupReady={(s) => setGroupStats(s)} />;
  }

  // Get active stats object dynamically calculated
  const activeStats = calculateStats(groupStats.groupName);

  // Render Gate 2: Detail or Edit screens
  if (subScreen === 'expense-detail' && selectedEntry) {
    return (
      <ExpenseDetailScreen
        entry={selectedEntry}
        onBack={() => {
          setSelectedEntry(null);
          setSubScreen(null);
        }}
        onEdit={() => setSubScreen('expense-edit')}
        onDelete={async () => {
          try {
            await deleteBazarEntry(selectedEntry.id).unwrap();
            setSelectedEntry(null);
            setSubScreen(null);
          } catch (err) {
            // Silently handle error
          }
        }}
      />
    );
  }

  if (subScreen === 'expense-edit' && selectedEntry) {
    return (
      <ExpenseEditScreen
        entry={selectedEntry}
        onBack={() => setSubScreen('expense-detail')}
        onSave={async (updated) => {
          try {
            await updateBazarEntry({
              id: updated.id,
              body: {
                price: updated.price,
                quantity: updated.quantity,
                unit: updated.unit,
                notes: updated.notes,
              },
            }).unwrap();
            setSelectedEntry(updated);
            setSubScreen('expense-detail');
          } catch (err) {
            // Silently handle error
          }
        }}
      />
    );
  }

  if (subScreen === 'bill-detail' && selectedBill) {
    return (
      <BillDetailScreen
        bill={selectedBill}
        onBack={() => {
          setSelectedBill(null);
          setSubScreen(null);
        }}
        onEdit={() => setSubScreen('bill-edit')}
        onDelete={() => {
          setBills((bs) => bs.filter((b) => b.id !== selectedBill.id));
          setSelectedBill(null);
          setSubScreen(null);
        }}
      />
    );
  }

  if (subScreen === 'bill-edit' && selectedBill) {
    return (
      <BillEditScreen
        bill={selectedBill}
        onBack={() => setSubScreen('bill-detail')}
        onSave={(updated) => {
          setBills((bs) => bs.map((b) => (b.id === updated.id ? updated : b)));
          setSelectedBill(updated);
          setSubScreen('bill-detail');
        }}
      />
    );
  }

  if (subScreen === 'add-expense') {
    return (
      <AddExpenseScreen
        onBack={() => setSubScreen(null)}
        onDone={(newEntry) => {
          setEntries((es) => [newEntry, ...es]);
          setSubScreen(null);
          setTab('expenses');
        }}
      />
    );
  }

  if (subScreen === 'add-bill') {
    return (
      <AddBillScreen
        onBack={() => setSubScreen(null)}
        onDone={(newBill) => {
          setBills((bs) => [newBill, ...bs]);
          setSubScreen(null);
          setTab('bills');
        }}
      />
    );
  }

  if (subScreen === 'profile-edit') {
    return <EditProfileScreen onBack={() => setSubScreen(null)} />;
  }

  if (subScreen === 'profile-change-password') {
    return <ChangePasswordScreen onBack={() => setSubScreen(null)} />;
  }

  if (subScreen === 'profile-group-details') {
    return <GroupDetailsScreen onBack={() => setSubScreen(null)} />;
  }

  // Render Gate 3: Standard tab dashboard view
  const renderTabContent = () => {
    switch (tab) {
      case 'home':
        return <HomeTab stats={activeStats} />;
      case 'expenses':
        return (
          <ExpensesTab
            entries={entries}
            onDetail={(e) => {
              setSelectedEntry(e);
              setSubScreen('expense-detail');
            }}
          />
        );
      case 'bills':
        return (
          <BillsTab
            bills={bills}
            onDetail={(b) => {
              setSelectedBill(b);
              setSubScreen('bill-detail');
            }}
          />
        );
      case 'profile':
        return (
          <ProfileTab
            onEditProfile={() => setSubScreen('profile-edit')}
            onChangePassword={() => setSubScreen('profile-change-password')}
            onViewGroupDetails={() => setSubScreen('profile-group-details')}
          />
        );
      default:
        return <HomeTab stats={activeStats} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Central Screen Tab Content */}
      <View style={styles.contentArea}>{renderTabContent()}</View>

      {/* Bottom Custom Tab Bar */}
      <View style={[styles.bottomTabBar, SHADOWS.lg]}>
        {/* Home Tab */}
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setTab('home')}
          activeOpacity={0.7}
        >
          <BookOpen color={tab === 'home' ? COLORS.primary : COLORS.textSecondary} size={20} />
          <Text style={[styles.tabLabelText, tab === 'home' && { color: COLORS.primary }]}>Home</Text>
          {tab === 'home' && <View style={styles.activeDot} />}
        </TouchableOpacity>

        {/* Expenses Tab */}
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setTab('expenses')}
          activeOpacity={0.7}
        >
          <ShoppingBag color={tab === 'expenses' ? COLORS.primary : COLORS.textSecondary} size={20} />
          <Text style={[styles.tabLabelText, tab === 'expenses' && { color: COLORS.primary }]}>Expenses</Text>
          {tab === 'expenses' && <View style={styles.activeDot} />}
        </TouchableOpacity>

        {/* Central Plus ADD Button */}
        <View style={styles.centerAddBtnContainer}>
          <TouchableOpacity
            style={styles.centerAddBtn}
            onPress={() => setShowAddPicker(true)}
            activeOpacity={0.8}
          >
            <Plus color={COLORS.background} size={24} />
          </TouchableOpacity>
          <Text style={styles.tabLabelText}>Add</Text>
        </View>

        {/* Bills Tab */}
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setTab('bills')}
          activeOpacity={0.7}
        >
          <Calendar color={tab === 'bills' ? COLORS.primary : COLORS.textSecondary} size={20} />
          <Text style={[styles.tabLabelText, tab === 'bills' && { color: COLORS.primary }]}>Bills</Text>
          {tab === 'bills' && <View style={styles.activeDot} />}
        </TouchableOpacity>

        {/* Profile Tab */}
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => setTab('profile')}
          activeOpacity={0.7}
        >
          <User color={tab === 'profile' ? COLORS.primary : COLORS.textSecondary} size={20} />
          <Text style={[styles.tabLabelText, tab === 'profile' && { color: COLORS.primary }]}>Profile</Text>
          {tab === 'profile' && <View style={styles.activeDot} />}
        </TouchableOpacity>
      </View>

      {/* Add entry Selection Overlay picker */}
      <AddPicker
        visible={showAddPicker}
        onExpense={() => {
          setShowAddPicker(false);
          setSubScreen('add-expense');
        }}
        onBill={() => {
          setShowAddPicker(false);
          setSubScreen('add-bill');
        }}
        onClose={() => setShowAddPicker(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentArea: {
    flex: 1,
  },
  bottomTabBar: {
    height: 72,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1.2,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 10 : 6,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabLabelText: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    marginTop: 4,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 2,
  },
  centerAddBtnContainer: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    paddingTop: 4,
  },
  centerAddBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    ...SHADOWS.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
