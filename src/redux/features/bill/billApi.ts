import { baseApi, TResponseMeta } from '../../api/baseApi';
import { BillCategory } from '../../../screens/BillsTab';

export interface CreateBillPayload {
  category: BillCategory;
  title: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface BillItem {
  _id: string;
  category: BillCategory;
  title: string;
  amount: number;
  date: string;
  notes?: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    profileImage?: string;
  };
  group?: {
    _id: string;
    name: string;
    creator: string;
  };
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BillsQueryParams {
  filter?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface BillsResponse {
  success: boolean;
  message: string;
  meta: TResponseMeta;
  data: BillItem[];
}

export interface BillStatsQueryParams {
  filter?: string;
  startDate?: string;
  endDate?: string;
}

export interface BillStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalEntries: number;
    totalAmount: number;
  };
}

export interface SingleBillResponse {
  success: boolean;
  message: string;
  data: BillItem;
}

interface BillResponse {
  success: boolean;
  message: string;
  data: any;
}

export const billApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createBill: builder.mutation<BillResponse, CreateBillPayload>({
      query: (body) => ({
        url: 'bills',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Bill'],
    }),
    getBills: builder.query<BillsResponse, BillsQueryParams | void>({
      query: (params) => ({
        url: 'bills',
        method: 'GET',
        params: params || undefined,
      }),
      providesTags: ['Bill'],
    }),
    getBillStats: builder.query<BillStatsResponse, BillStatsQueryParams | void>({
      query: (params) => ({
        url: 'bills/stats',
        method: 'GET',
        params: params || undefined,
      }),
      providesTags: ['Bill'],
    }),
    getBillById: builder.query<SingleBillResponse, string>({
      query: (id) => ({
        url: `bills/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Bill', id }],
    }),
    updateBill: builder.mutation<BillResponse, { id: string; body: Partial<CreateBillPayload> }>({
      query: ({ id, body }) => ({
        url: `bills/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Bill'],
    }),
    deleteBill: builder.mutation<BillResponse, string>({
      query: (id) => ({
        url: `bills/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bill'],
    }),
  }),
});

export const {
  useCreateBillMutation,
  useGetBillsQuery,
  useLazyGetBillsQuery,
  useGetBillStatsQuery,
  useGetBillByIdQuery,
  useUpdateBillMutation,
  useDeleteBillMutation,
} = billApi;
