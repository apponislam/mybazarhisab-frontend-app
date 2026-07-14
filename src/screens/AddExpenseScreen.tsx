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

interface AddExpenseScreenProps {
  onBack: () => void;
  onDone: (entry: MockBazarEntry) => void;
}

// Simple emoji finder based on keywords
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
  return '🛒'; // default
}

export default function AddExpenseScreen({ onBack, onDone }: AddExpenseScreenProps) {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<BazarUnit>('KG');
  const [date, setDate] = useState('Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Focus States
  const [fProduct, setFProduct] = useState(false);
  const [fPrice, setFPrice] = useState(false);
  const [fQty, setFQty] = useState(false);
  const [fNotes, setFNotes] = useState(false);

  const handleSubmit = () => {
    if (!productName.trim() || !price || !quantity) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      
      const newEntry: MockBazarEntry = {
        id: 'e_' + Date.now(),
        product: {
          id: 'p_' + Date.now(),
          name: productName.trim(),
          emoji: getEmojiForProduct(productName),
        },
        price: Number(price),
        quantity: Number(quantity),
        unit,
        date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        notes: notes.trim() || undefined,
        user: {
          id: 'u1',
          name: 'Ahmed Hassan',
          email: 'ahmed@email.com',
          phone: '+880 1711 234567',
        },
      };
      
      onDone(newEntry);
    }, 1400);
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
            <ShoppingBagIconOutline />
          </View>
          <View>
            <Text style={styles.screenTitle}>Add Expense</Text>
            <Text style={styles.screenSubtitle}>Bazar purchase entry</Text>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Product Name */}
          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>Product Name</Text>
            <View style={[styles.inputWrapper, fProduct && styles.inputWrapperFocused]}>
              <Package color={COLORS.textSecondary} size={18} style={styles.fieldIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Hilsha Fish, Rice, Onion"
                placeholderTextColor={COLORS.placeholder}
                value={productName}
                onChangeText={setProductName}
                onFocus={() => setFProduct(true)}
                onBlur={() => setFProduct(false)}
                autoCorrect={false}
              />
            </View>
          </View>

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
            disabled={loading || !productName.trim() || !price || !quantity}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.textOnPrimary} size="small" />
            ) : (
              <Text style={styles.primaryButtonText}>Save Expense</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// Simple Vector ShoppingBag placeholder for outline
function ShoppingBagIconOutline() {
  return (
    <View style={{ width: 22, height: 22, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{
        width: 14,
        height: 14,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        borderRadius: 2.5,
        position: 'absolute',
        bottom: 1,
      }} />
      <View style={{
        width: 8,
        height: 8,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        position: 'absolute',
        top: 2,
        borderBottomWidth: 0,
      }} />
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
