import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BazarItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
}

interface LedgerState {
  totalBudget: number;
  items: BazarItem[];
}

const initialState: LedgerState = {
  totalBudget: 15000,
  items: [
    { id: '1', title: 'Rice & Lentils (Monthly)', amount: 1850, category: 'Groceries', date: 'Today, 9:30 AM' },
    { id: '2', title: 'Fresh Fish & Chicken', amount: 950, category: 'Bazar', date: 'Yesterday, 6:00 PM' },
    { id: '3', title: 'Organic Vegetables & Spices', amount: 340, category: 'Bazar', date: 'July 11, 8:15 AM' },
    { id: '4', title: 'Home LED Bulbs (x2)', amount: 450, category: 'Utilities', date: 'July 10, 4:30 PM' },
  ],
};

const ledgerSlice = createSlice({
  name: 'ledger',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<BazarItem>) => {
      state.items.unshift(action.payload);
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateBudget: (state, action: PayloadAction<number>) => {
      state.totalBudget = action.payload;
    },
  },
});

export const { addItem, deleteItem, updateBudget } = ledgerSlice.actions;
export default ledgerSlice.reducer;
