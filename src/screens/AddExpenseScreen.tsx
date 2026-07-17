import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  FlatList,
  Image,
  Keyboard,
} from 'react-native';
import { COLORS, SPACING, SIZES, SHADOWS } from '../constants/theme';
import { ArrowLeft, Package, X, ChevronDown } from '../components/CustomIcon';
import { MockBazarEntry, BazarUnit } from './ExpensesTab';
import { useLazySearchProductsQuery, ProductItem } from '../redux/features/product/productApi';
import { useCreateBazarEntryMutation } from '../redux/features/bazarEntry/bazarEntryApi';

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

// Format today's date as YYYY-MM-DD
function getTodayDate(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function AddExpenseScreen({ onBack, onDone }: AddExpenseScreenProps) {
  // Form state
  const [productName, setProductName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<BazarUnit>('KG');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Search dropdown state
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Focus States
  const [fProduct, setFProduct] = useState(false);
  const [fPrice, setFPrice] = useState(false);
  const [fQty, setFQty] = useState(false);
  const [fNotes, setFNotes] = useState(false);

  // Debounce timer ref
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // RTK Query hooks
  const [searchProducts, { isFetching: isSearching }] = useLazySearchProductsQuery();
  const [createBazarEntry, { isLoading: isCreating }] = useCreateBazarEntryMutation();

  // Debounced search handler
  const handleProductSearch = useCallback((text: string) => {
    setProductName(text);
    setSelectedProduct(null); // Clear selected product when typing

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (text.trim().length < 2) {
      setShowDropdown(false);
      setAllProducts([]);
      setSearchPage(1);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const result = await searchProducts({
          searchTerm: text.trim(),
          page: 1,
          limit: 10,
        }).unwrap();

        setAllProducts(result.data || []);
        setHasMore(result.meta?.hasNext || false);
        setTotalResults(result.meta?.total || 0);
        setSearchPage(1);
        setShowDropdown(true);
      } catch (err) {
        // Search failed silently — user can still type custom name
        setAllProducts([]);
        setShowDropdown(true);
      }
    }, 400);
  }, [searchProducts]);

  // Load more products (lazy loading / pagination)
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isSearching) return;

    const nextPage = searchPage + 1;
    try {
      const result = await searchProducts({
        searchTerm: productName.trim(),
        page: nextPage,
        limit: 10,
      }).unwrap();

      setAllProducts((prev) => [...prev, ...(result.data || [])]);
      setHasMore(result.meta?.hasNext || false);
      setSearchPage(nextPage);
    } catch (err) {
      // Silently fail
    }
  }, [hasMore, isSearching, searchPage, productName, searchProducts]);

  // Select product from dropdown
  const handleSelectProduct = (product: ProductItem) => {
    setSelectedProduct(product);
    setProductName(product.name);
    setShowDropdown(false);
    Keyboard.dismiss();
  };

  // Use custom name (no product selected from DB)
  const handleUseCustomName = () => {
    setSelectedProduct(null);
    setShowDropdown(false);
    Keyboard.dismiss();
  };

  // Clear selected product
  const handleClearProduct = () => {
    setSelectedProduct(null);
    setProductName('');
    setShowDropdown(false);
    setAllProducts([]);
  };

  // Submit handler — POST to API
  const handleSubmit = async () => {
    if (!productName.trim() || !price || !quantity) return;

    setLoading(true);
    try {
      const payload: any = {
        name: productName.trim(),
        price: Number(price),
        quantity: Number(quantity),
        unit,
        date: getTodayDate(),
      };

      // If a product was selected from search, include the productId
      if (selectedProduct) {
        payload.productId = selectedProduct._id;
      }

      if (notes.trim()) {
        payload.notes = notes.trim();
      }

      await createBazarEntry(payload).unwrap();

      // Create local entry for immediate UI update via onDone
      const newEntry: MockBazarEntry = {
        id: 'e_' + Date.now(),
        product: {
          id: selectedProduct?._id || 'p_' + Date.now(),
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
    } catch (err) {
      // If API fails, still show as local entry for now
      setLoading(false);
    }
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Render a single product result row
  const renderProductItem = ({ item }: { item: ProductItem }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleSelectProduct(item)}
      activeOpacity={0.7}
    >
      {item.photo ? (
        <Image source={{ uri: item.photo }} style={styles.productPhoto} />
      ) : (
        <View style={styles.productPhotoPlaceholder}>
          <Package color={COLORS.textSecondary} size={16} />
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productItemName} numberOfLines={1}>{item.name}</Text>
        {item.description ? (
          <Text style={styles.productItemDesc} numberOfLines={1}>{item.description}</Text>
        ) : null}
      </View>
      {item.is18Plus && (
        <View style={styles.adultBadge}>
          <Text style={styles.adultBadgeText}>18+</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const isFormValid = productName.trim() && price && quantity;

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
        <ArrowLeft color={COLORS.textSecondary} size={16} />
        <Text style={styles.backButtonText}>Cancel</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
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
          {/* Product Name with Search Dropdown */}
          <View style={styles.fieldBox}>
            <Text style={styles.fieldLabel}>Product Name</Text>
            <View style={[styles.inputWrapper, fProduct && styles.inputWrapperFocused]}>
              {selectedProduct?.photo ? (
                <Image source={{ uri: selectedProduct.photo }} style={styles.selectedProductThumb} />
              ) : (
                <Package color={COLORS.textSecondary} size={18} style={styles.fieldIcon} />
              )}
              <TextInput
                style={styles.textInput}
                placeholder="Search or type product name…"
                placeholderTextColor={COLORS.placeholder}
                value={productName}
                onChangeText={handleProductSearch}
                onFocus={() => {
                  setFProduct(true);
                  if (productName.trim().length >= 2 && !selectedProduct) {
                    setShowDropdown(true);
                  }
                }}
                onBlur={() => setFProduct(false)}
                autoCorrect={false}
              />
              {productName.length > 0 && (
                <TouchableOpacity onPress={handleClearProduct} style={styles.clearBtn} activeOpacity={0.7}>
                  <X color={COLORS.textSecondary} size={14} />
                </TouchableOpacity>
              )}
              {isSearching && (
                <ActivityIndicator color={COLORS.primary} size="small" style={{ marginLeft: 4 }} />
              )}
            </View>

            {/* Selected product indicator */}
            {selectedProduct && (
              <View style={styles.selectedIndicator}>
                <View style={styles.selectedDot} />
                <Text style={styles.selectedText}>
                  Linked to product: <Text style={styles.selectedName}>{selectedProduct.name}</Text>
                </Text>
              </View>
            )}

            {/* Search Dropdown */}
            {showDropdown && fProduct && (
              <View style={styles.dropdownContainer}>
                {allProducts.length > 0 ? (
                  <>
                    <View style={styles.dropdownHeader}>
                      <Text style={styles.dropdownHeaderText}>
                        {totalResults} product{totalResults !== 1 ? 's' : ''} found
                      </Text>
                    </View>
                    <FlatList
                      data={allProducts}
                      keyExtractor={(item) => item._id}
                      renderItem={renderProductItem}
                      style={styles.dropdownList}
                      nestedScrollEnabled
                      keyboardShouldPersistTaps="handled"
                      onEndReached={handleLoadMore}
                      onEndReachedThreshold={0.3}
                      ListFooterComponent={
                        hasMore ? (
                          <View style={styles.loadMoreContainer}>
                            {isSearching ? (
                              <ActivityIndicator color={COLORS.primary} size="small" />
                            ) : (
                              <TouchableOpacity onPress={handleLoadMore} activeOpacity={0.7}>
                                <Text style={styles.loadMoreText}>Load more…</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        ) : null
                      }
                    />
                  </>
                ) : !isSearching ? (
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsEmoji}>🔍</Text>
                    <Text style={styles.noResultsText}>No products found</Text>
                  </View>
                ) : null}

                {/* Use custom name option */}
                <TouchableOpacity
                  style={styles.useCustomBtn}
                  onPress={handleUseCustomName}
                  activeOpacity={0.7}
                >
                  <Text style={styles.useCustomText}>
                    Use "<Text style={styles.useCustomName}>{productName}</Text>" as custom name
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
            style={[styles.primaryButton, (!isFormValid || loading || isCreating) && styles.primaryButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading || isCreating || !isFormValid}
            activeOpacity={0.8}
          >
            {(loading || isCreating) ? (
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
    zIndex: 1,
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
  clearBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(232, 160, 32, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  // Selected product indicator
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  selectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  selectedText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
  },
  selectedName: {
    color: COLORS.success,
    fontWeight: '600',
  },
  selectedProductThumb: {
    width: 24,
    height: 24,
    borderRadius: 6,
    marginRight: 10,
  },
  // Dropdown styles
  dropdownContainer: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginTop: 4,
    overflow: 'hidden',
    maxHeight: 280,
    ...SHADOWS.md,
  },
  dropdownHeader: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownHeaderText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
  },
  dropdownList: {
    maxHeight: 180,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(232, 160, 32, 0.08)',
  },
  productPhoto: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: COLORS.surfaceElevated,
  },
  productPhotoPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  productInfo: {
    flex: 1,
  },
  productItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: 'sans-serif',
  },
  productItemDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
    marginTop: 2,
  },
  adultBadge: {
    backgroundColor: COLORS.errorLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  adultBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.error,
    fontFamily: 'monospace',
  },
  loadMoreContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  loadMoreText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    fontFamily: 'sans-serif',
  },
  noResultsContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  noResultsEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  noResultsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
  },
  useCustomBtn: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(232, 160, 32, 0.06)',
  },
  useCustomText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
  },
  useCustomName: {
    color: COLORS.primary,
    fontWeight: 'bold',
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
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
});
