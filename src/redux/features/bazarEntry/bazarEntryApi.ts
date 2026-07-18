import { baseApi, TResponseMeta } from '../../api/baseApi';

export interface CreateBazarEntryPayload {
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  unit: 'KG' | 'PIECE' | 'GM';
  notes?: string;
  date: string;
}

export interface BazarEntryItem {
  _id: string;
  product?: {
    _id: string;
    name: string;
    photo?: string;
    is18Plus?: boolean;
    description?: string;
  };
  name?: string;
  price: number;
  quantity: number;
  unit: 'KG' | 'PIECE' | 'GM';
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

export interface BazarEntriesQueryParams {
  filter?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface BazarEntriesResponse {
  success: boolean;
  message: string;
  meta: TResponseMeta;
  data: BazarEntryItem[];
}

export interface BazarEntryStatsQueryParams {
  filter?: string;
  startDate?: string;
  endDate?: string;
}

export interface BazarEntryStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalEntries: number;
    totalAmount: number;
  };
}

export interface SingleBazarEntryResponse {
  success: boolean;
  message: string;
  data: BazarEntryItem;
}

interface BazarEntryResponse {
  success: boolean;
  message: string;
  data: any;
}

export const bazarEntryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBazarEntry: builder.mutation<BazarEntryResponse, CreateBazarEntryPayload>({
      query: (body) => ({
        url: 'bazar-entries',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['BazarEntry'],
    }),
    getBazarEntries: builder.query<BazarEntriesResponse, BazarEntriesQueryParams | void>({
      query: (params) => ({
        url: 'bazar-entries',
        method: 'GET',
        params: params || undefined,
      }),
      providesTags: ['BazarEntry'],
    }),
    getBazarEntryStats: builder.query<BazarEntryStatsResponse, BazarEntryStatsQueryParams | void>({
      query: (params) => ({
        url: 'bazar-entries/stats',
        method: 'GET',
        params: params || undefined,
      }),
      providesTags: ['BazarEntry'],
    }),
    getBazarEntryById: builder.query<SingleBazarEntryResponse, string>({
      query: (id) => ({
        url: `bazar-entries/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'BazarEntry', id }],
    }),
    updateBazarEntry: builder.mutation<BazarEntryResponse, { id: string; body: Partial<CreateBazarEntryPayload> }>({
      query: ({ id, body }) => ({
        url: `bazar-entries/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['BazarEntry'],
    }),
    deleteBazarEntry: builder.mutation<BazarEntryResponse, string>({
      query: (id) => ({
        url: `bazar-entries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BazarEntry'],
    }),
  }),
});

export const {
  useCreateBazarEntryMutation,
  useGetBazarEntriesQuery,
  useLazyGetBazarEntriesQuery,
  useGetBazarEntryStatsQuery,
  useGetBazarEntryByIdQuery,
  useUpdateBazarEntryMutation,
  useDeleteBazarEntryMutation,
} = bazarEntryApi;

