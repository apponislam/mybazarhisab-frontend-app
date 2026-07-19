import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Platform,
  BackHandler,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, X, Plus, Calendar } from '../components/CustomIcon';
import { MockBill, BillCategory, BILL_CATEGORIES, BILL_META } from './BillsTab';
import { useCreateBillMutation } from '../redux/features/bill/billApi';
import CustomDatePicker from '../components/CustomDatePicker';

interface AddBillScreenProps {
  onBack: () => void;
  onDone: (bill: MockBill) => void;
}

// Format a Date to YYYY-MM-DD
function formatDateYMD(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Format a Date to human-readable display
function formatDateDisplay(d: Date): string {
  const today = new Date();
  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

  return isToday ? `Today — ${dayStr}` : dayStr;
}

export default function AddBillScreen({ onBack, onDone }: AddBillScreenProps) {
  const [category, setCategory] = useState<BillCategory>('RENT');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [showCatPicker, setShowCatPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Focus States
  const [fTitle, setFTitle] = useState(false);
  const [fAmount, setFAmount] = useState(false);
  const [fNotes, setFNotes] = useState(false);

  // RTK Query hook
  const [createBill, { isLoading: isCreating }] = useCreateBillMutation();

  useEffect(() => {
    const handleBack = () => {
      if (showCatPicker) {
        setShowCatPicker(false);
        return true;
      }
      if (showDatePicker) {
        setShowDatePicker(false);
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => sub.remove();
  }, [showCatPicker, showDatePicker]);

  const activeMeta = BILL_META[category];

  const handleSubmit = async () => {
    if (!title.trim() || !amount) return;

    setLoading(true);
    try {
      const payload: any = {
        category,
        title: title.trim(),
        amount: Number(amount),
        date: formatDateYMD(date),
      };

      if (notes.trim()) {
        payload.notes = notes.trim();
      }

      await createBill(payload).unwrap();

      // Create local entry for immediate UI update
      const newBill: MockBill = {
        id: 'b_' + Date.now(),
        category,
        title: title.trim(),
        amount: Number(amount),
        date: formatDateDisplay(date),
        notes: notes.trim() || undefined,
        user: {
          id: 'u1',
          name: 'Ahmed Hassan',
          email: 'ahmed@email.com',
          phone: '+880 1711 234567',
        },
      };

      onDone(newBill);
    } catch (err) {
      setLoading(false);
    }
  };

  const isFormValid = title.trim() && amount;

  return (
    <View style={styles.container}>
      {/* Cancel button */}
      <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
        <ArrowLeft color={COLORS.textSecondary} size={16} />
        <Text style={styles.backButtonText}>Cancel</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.screenHeader}>
          <View style={styles.iconCircleHeader}>
            <Text style={{ fontSize: 20, color: '#fff' }}>📄</Text>
          </View>
          <View>
            <Text style={styles.screenTitle}>Add Bill</Text>
            <Text style={styles.screenSubtitle}>Utility or recurring expense</Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          {/* Category Picker Selector */}
          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>Category</Text>
            <TouchableOpacity
              onPress={() => setShowCatPicker(true)}
              style={styles.categorySelectorBtn}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.categoryBox,
                  {
                    backgroundColor: `${activeMeta.color}20`,
                    borderColor: `${activeMeta.color}40`,
                  },
                ]}
              >
                {activeMeta.icon({ color: activeMeta.color, size: 20 })}
              </View>
              <Text style={styles.categoryLabelText}>{activeMeta.label}</Text>
              <Text style={styles.categorySelectorChevron}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>Title</Text>
            <View style={[styles.inputWrapper, fTitle && styles.inputWrapperFocused]}>
              <Plus color={COLORS.textSecondary} size={16} style={styles.fieldIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. July House Rent"
                placeholderTextColor={COLORS.placeholder}
                value={title}
                onChangeText={setTitle}
                onFocus={() => setFTitle(true)}
                onBlur={() => setFTitle(false)}
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Amount */}
          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>Amount (৳)</Text>
            <View style={[styles.inputWrapper, fAmount && styles.inputWrapperFocused]}>
              <Text style={styles.currencyPrefix}>৳</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0.00"
                placeholderTextColor={COLORS.placeholder}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                onFocus={() => setFAmount(true)}
                onBlur={() => setFAmount(false)}
              />
            </View>
          </View>

          {/* Date Field */}
          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>Date</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.inputWrapper}
              activeOpacity={0.8}
            >
              <Calendar color={COLORS.textSecondary} size={18} style={styles.fieldIcon} />
              <Text style={{ flex: 1, color: COLORS.text, fontSize: 15, fontFamily: 'sans-serif' }}>
                {formatDateDisplay(date)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Notes (Optional) */}
          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>Notes (optional)</Text>
            <View style={[styles.inputWrapper, fNotes && styles.inputWrapperFocused, styles.textAreaWrapper]}>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Any additional info…"
                placeholderTextColor={COLORS.placeholder}
                value={notes}
                onChangeText={setNotes}
                onFocus={() => setFNotes(true)}
                onBlur={() => setFNotes(false)}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              { backgroundColor: COLORS.accent },
              (!isFormValid || loading || isCreating) && styles.primaryButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading || isCreating || !isFormValid}
            activeOpacity={0.8}
          >
            {(loading || isCreating) ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.primaryButtonText}>Save Bill</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Category Picker Overlay Modal */}
      <Modal
        visible={showCatPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCatPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowCatPicker(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity
                onPress={() => setShowCatPicker(false)}
                style={styles.modalCloseBtn}
                activeOpacity={0.7}
              >
                <X color={COLORS.textSecondary} size={14} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.categoryGrid}>
              {BILL_CATEGORIES.map((c) => (
                <TouchableOpacity
                  key={c.key}
                  onPress={() => {
                    setCategory(c.key);
                    setShowCatPicker(false);
                  }}
                  style={[
                    styles.gridItem,
                    category === c.key && {
                      borderColor: c.color,
                      backgroundColor: `${c.color}15`,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.gridIconCircle,
                      {
                        backgroundColor: `${c.color}20`,
                        borderColor: `${c.color}40`,
                      },
                    ]}
                  >
                    {c.icon({ color: c.color, size: 20 })}
                  </View>
                  <Text style={styles.gridLabelText} numberOfLines={1}>
                    {c.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date Picker Modal */}
      <CustomDatePicker
        visible={showDatePicker}
        value={date}
        onClose={() => setShowDatePicker(false)}
        onChange={(selected) => setDate(selected)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: 'sans-serif',
    marginLeft: 6,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
    marginTop: 10,
  },
  iconCircleHeader: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.accentGlow,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'serif',
  },
  screenSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    marginTop: 2,
  },
  formContainer: {
    width: '100%',
  },
  fieldBox: {
    marginBottom: 16,
    width: '100%',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(245, 237, 226, 0.8)',
    marginBottom: 8,
    fontFamily: 'sans-serif',
  },
  categorySelectorBtn: {
    height: 60,
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.border,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 18,
  },
  categoryLabelText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
  categorySelectorChevron: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  inputWrapper: {
    height: 52,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapperFocused: {
    borderColor: COLORS.borderFocus,
  },
  fieldIcon: {
    marginRight: 10,
  },
  currencyPrefix: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    paddingVertical: 0,
    fontFamily: 'sans-serif',
  },
  dateHint: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  textAreaWrapper: {
    height: 96,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  textArea: {
    height: '100%',
  },
  primaryButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    ...SHADOWS.md,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
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
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'sans-serif',
  },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    columnGap: 10,
    paddingBottom: 24,
  },
  gridItem: {
    width: '48%',
    height: 60,
    backgroundColor: 'rgba(46, 26, 10, 0.8)',
    borderColor: 'rgba(232, 160, 32, 0.15)',
    borderWidth: 1.2,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  gridIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  gridEmoji: {
    fontSize: 16,
  },
  gridLabelText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: 'sans-serif',
  },
});
