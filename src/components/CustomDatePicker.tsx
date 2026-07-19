import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import { COLORS, SHADOWS } from '../constants/theme';
import { X, Calendar } from './CustomIcon';

interface CustomDatePickerProps {
  visible: boolean;
  value: Date;
  onClose: () => void;
  onChange: (date: Date) => void;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Custom SVG-like Chevron Left component using simple Views
function ChevronLeft({ color = COLORS.primary, size = 18 }) {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{
          width: size * 0.45,
          height: size * 0.45,
          borderLeftWidth: 2,
          borderBottomWidth: 2,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
          marginLeft: size * 0.15,
        }}
      />
    </View>
  );
}

// Custom SVG-like Chevron Right component using simple Views
function ChevronRight({ color = COLORS.primary, size = 18 }) {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{
          width: size * 0.45,
          height: size * 0.45,
          borderTopWidth: 2,
          borderRightWidth: 2,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
          marginRight: size * 0.15,
        }}
      />
    </View>
  );
}

export default function CustomDatePicker({
  visible,
  value,
  onClose,
  onChange,
}: CustomDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(value));
  const [currentMonth, setCurrentMonth] = useState(value.getMonth());
  const [currentYear, setCurrentYear] = useState(value.getFullYear());
  const [viewMode, setViewMode] = useState<'calendar' | 'year'>('calendar');

  // Reset internal state when visible changes or value updates
  useEffect(() => {
    if (visible) {
      const d = new Date(value);
      setSelectedDate(d);
      setCurrentMonth(d.getMonth());
      setCurrentYear(d.getFullYear());
      setViewMode('calendar');
    }
  }, [visible, value]);

  // Navigate to previous month
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  // Navigate to next month
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Select a day
  const handleDaySelect = (dayObj: { day: number; month: number; year: number }) => {
    const newDate = new Date(dayObj.year, dayObj.month, dayObj.day);
    setSelectedDate(newDate);

    // If day belongs to previous/next month, update active month view
    if (dayObj.month !== currentMonth) {
      setCurrentMonth(dayObj.month);
      setCurrentYear(dayObj.year);
    }
  };

  // Confirm selection
  const handleConfirm = () => {
    onChange(selectedDate);
    onClose();
  };

  // Set to today
  const handleSelectToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setViewMode('calendar');
  };

  // Generate calendar cells (6 weeks = 42 cells)
  const getCalendarDays = () => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthTotalDays = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Previous month's trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthTotalDays - i;
      const m = currentMonth === 0 ? 11 : currentMonth - 1;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      days.push({ day: d, month: m, year: y, isCurrentMonth: false });
    }

    // Current month's days
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, month: currentMonth, year: currentYear, isCurrentMonth: true });
    }

    // Next month's leading days
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const m = currentMonth === 11 ? 0 : currentMonth + 1;
      const y = currentMonth === 11 ? currentYear + 1 : currentYear;
      days.push({ day: i, month: m, year: y, isCurrentMonth: false });
    }

    return days;
  };

  // Generate list of years (e.g. from 2020 to 2035)
  const getYears = () => {
    const years = [];
    const startYear = Math.max(2000, currentYear - 12);
    const endYear = currentYear + 12;
    for (let y = startYear; y <= endYear; y++) {
      years.push(y);
    }
    return years;
  };

  const isToday = (d: number, m: number, y: number) => {
    const today = new Date();
    return (
      today.getDate() === d &&
      today.getMonth() === m &&
      today.getFullYear() === y
    );
  };

  const isSelected = (d: number, m: number, y: number) => {
    return (
      selectedDate.getDate() === d &&
      selectedDate.getMonth() === m &&
      selectedDate.getFullYear() === y
    );
  };

  const daysGrid = getCalendarDays();
  const yearsList = getYears();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={styles.modalContent}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Calendar color={COLORS.primary} size={18} />
              <Text style={styles.headerTitle}>Select Date</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X color={COLORS.textSecondary} size={14} />
            </TouchableOpacity>
          </View>

          {/* Month & Year Selection Header */}
          <View style={styles.monthHeaderRow}>
            <TouchableOpacity
              onPress={handlePrevMonth}
              style={styles.navArrow}
              activeOpacity={0.7}
              disabled={viewMode === 'year'}
            >
              <ChevronLeft color={viewMode === 'year' ? COLORS.textMuted : COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setViewMode(viewMode === 'calendar' ? 'year' : 'calendar')}
              style={styles.monthSelectorBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.monthSelectorText}>
                {MONTHS[currentMonth]} {currentYear}
              </Text>
              <Text style={styles.monthSelectorChevron}>
                {viewMode === 'calendar' ? '▼' : '▲'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNextMonth}
              style={styles.navArrow}
              activeOpacity={0.7}
              disabled={viewMode === 'year'}
            >
              <ChevronRight color={viewMode === 'year' ? COLORS.textMuted : COLORS.primary} />
            </TouchableOpacity>
          </View>

          {viewMode === 'calendar' ? (
            <View>
              {/* Weekdays Header */}
              <View style={styles.weekdaysRow}>
                {WEEKDAYS.map((d, index) => (
                  <Text key={index} style={styles.weekdayText}>
                    {d}
                  </Text>
                ))}
              </View>

              {/* Days Grid */}
              <View style={styles.daysGrid}>
                {daysGrid.map((item, index) => {
                  const isSel = isSelected(item.day, item.month, item.year);
                  const isTod = isToday(item.day, item.month, item.year);
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleDaySelect(item)}
                      style={[
                        styles.dayCell,
                        isSel && styles.dayCellSelected,
                        !isSel && isTod && styles.dayCellToday,
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          !item.isCurrentMonth && styles.dayTextOut,
                          isSel && styles.dayTextSelected,
                          !isSel && isTod && styles.dayTextToday,
                        ]}
                      >
                        {item.day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : (
            /* Year Picker Grid */
            <View style={styles.yearGridContainer}>
              <FlatList
                data={yearsList}
                keyExtractor={(item) => item.toString()}
                numColumns={3}
                contentContainerStyle={styles.yearGrid}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isSelYear = item === currentYear;
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setCurrentYear(item);
                        setViewMode('calendar');
                      }}
                      style={[
                        styles.yearCell,
                        isSelYear && styles.yearCellSelected,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.yearText,
                          isSelYear && styles.yearTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}

          {/* Quick actions & confirmation */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              onPress={handleSelectToday}
              style={styles.todayBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.todayBtnText}>Today</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={onClose}
                style={styles.actionBtnCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.actionBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                style={styles.actionBtnConfirm}
                activeOpacity={0.7}
              >
                <Text style={styles.actionBtnConfirmText}>Select</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: COLORS.border,
    padding: 16,
    ...SHADOWS.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(232, 160, 32, 0.08)',
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'sans-serif',
  },
  closeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(232, 160, 32, 0.08)',
  },
  monthSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(232, 160, 32, 0.08)',
  },
  monthSelectorText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'sans-serif',
  },
  monthSelectorChevron: {
    fontSize: 8,
    color: COLORS.textSecondary,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekdayText: {
    width: 40,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
  },
  dayCell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCellSelected: {
    backgroundColor: COLORS.primary,
  },
  dayCellToday: {
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  dayText: {
    fontSize: 14,
    color: COLORS.text,
    fontFamily: 'sans-serif',
  },
  dayTextOut: {
    color: COLORS.textMuted,
    opacity: 0.5,
  },
  dayTextSelected: {
    color: COLORS.textOnPrimary,
    fontWeight: 'bold',
  },
  dayTextToday: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  yearGridContainer: {
    height: 250,
    justifyContent: 'center',
  },
  yearGrid: {
    justifyContent: 'space-between',
    rowGap: 12,
    paddingBottom: 10,
  },
  yearCell: {
    flex: 1,
    height: 45,
    marginHorizontal: 4,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(232, 160, 32, 0.08)',
  },
  yearCellSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  yearText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
    fontFamily: 'sans-serif',
  },
  yearTextSelected: {
    color: COLORS.textOnPrimary,
    fontWeight: 'bold',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(232, 160, 32, 0.08)',
    paddingTop: 14,
  },
  todayBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primaryGlow,
  },
  todayBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'sans-serif',
  },
  actionBtnCancel: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  actionBtnCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    fontFamily: 'sans-serif',
  },
  actionBtnConfirm: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  actionBtnConfirmText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textOnPrimary,
    fontFamily: 'sans-serif',
  },
});
