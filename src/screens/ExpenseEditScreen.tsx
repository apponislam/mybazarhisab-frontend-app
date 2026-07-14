import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, Package } from '../components/CustomIcon';
import { MockBazarEntry, BazarUnit } from './ExpensesTab';

interface ExpenseEditScreenProps {
  entry: MockBazarEntry;
  onBack: () => void;
  onSave: (updated: MockBazarEntry) => void;
}

export default function ExpenseEditScreen({
  entry,
  onBack,
  onSave,
}: ExpenseEditScreenProps) {
  const [price, setPrice] = useState(String(entry.price));
  const [quantity, setQuantity] = useState(String(entry.quantity));
  const [unit, setUnit] = useState<BazarUnit>(entry.unit);
  const [date, setDate] = useState(entry.date);
  const [notes, setNotes] = useState(entry.notes ?? '');
  const [loading, setLoading] = useState(false);

  // Focus States
  const [fPrice, setFPrice] = useState(false);
  const [fQty, setFQty] = useState(false);
  const [fNotes, setFNotes] = useState(false);

  const handleSubmit = () => {
    if (!price || !quantity) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSave({
        ...entry,
        price: Number(price),
        quantity: Number(quantity),
        unit,
        notes: notes.trim() || undefined,
      });
    }, 1200);
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
        <ArrowLeft color={COLORS.textSecondary} size={16} />
        <Text style={styles.backButtonText}>Cancel</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.screenHeader}>
          <View style={styles.iconCircleHeader}>
            <Text style={styles.headerEmoji}>{entry.product.emoji}</Text>
          </View>
          <View>
            <Text style={styles.screenTitle}>Edit Expense</Text>
            <Text style={styles.screenSubtitle}>{entry.product.name}</Text>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Grid: Price & Qty */}
          <View style={styles.gridRow}>
            {/* Price */}
            <View style={[styles.fieldBox, styles.flexHalf]}>
              <Text style={styles.fieldLabel}>Price (৳)</Text>
              <View style={[styles.inputWrapper, fPrice && styles.inputWrapperFocused]}>
                <Text style={styles.currencyPrefix}>৳</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.placeholder}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  onFocus={() => setFPrice(true)}
                  onBlur={() => setFPrice(false)}
                />
              </View>
            </View>

            {/* Quantity */}
            <View style={[styles.fieldBox, styles.flexHalf]}>
              <Text style={styles.fieldLabel}>Quantity</Text>
              <View style={[styles.inputWrapper, fQty && styles.inputWrapperFocused]}>
                <Package color={COLORS.textSecondary} size={16} style={styles.fieldIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="0"
                  placeholderTextColor={COLORS.placeholder}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  onFocus={() => setFQty(true)}
                  onBlur={() => setFQty(false)}
                />
              </View>
            </View>
          </View>

          {/* Unit selection tabs */}
          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>Unit</Text>
            <View style={styles.unitTabsRow}>
              {(['KG', 'PIECE', 'GM'] as BazarUnit[]).map((u) => (
                <TouchableOpacity
                  key={u}
                  onPress={() => setUnit(u)}
                  style={[
                    styles.unitTabBtn,
                    unit === u && styles.unitTabBtnActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.unitTabText,
                      unit === u && styles.unitTabTextActive,
                    ]}
                  >
                    {u}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
            style={styles.primaryButton}
            onPress={handleSubmit}
            disabled={loading || !price || !quantity}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.textOnPrimary} size="small" />
            ) : (
              <Text style={styles.primaryButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
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
    backgroundColor: COLORS.primaryGlow,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 22,
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
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  flexHalf: {
    flex: 1,
  },
  unitTabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  unitTabBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitTabBtnActive: {
    borderColor: COLORS.borderFocus,
    backgroundColor: 'rgba(232,160,32,0.15)',
  },
  unitTabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
  unitTabTextActive: {
    color: COLORS.primary,
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
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    ...SHADOWS.md,
  },
  primaryButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
});
