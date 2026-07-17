import { baseApi } from '../../api/baseApi';
import { BillCategory } from '../../../screens/BillsTab';

export interface CreateBillPayload {
  category: BillCategory;
  title: string;
  amount: number;
  date: string;
  notes?: string;
}

interface BillResponse {
  success: boolean;
  message: string;
  data: any;
}

export const billApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBill: builder.mutation<BillResponse, CreateBillPayload>({
      query: (body) => ({
        url: 'bills',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Bill'],
    }),
  }),
});

export const {
  useCreateBillMutation,
} = billApi;
