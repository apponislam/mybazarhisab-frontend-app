import { baseApi } from '../../api/baseApi';

export interface CreateBazarEntryPayload {
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  unit: 'KG' | 'PIECE' | 'GM';
  notes?: string;
  date: string;
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
  }),
});

export const {
  useCreateBazarEntryMutation,
} = bazarEntryApi;
