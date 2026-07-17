import { baseApi } from '../../api/baseApi';

export interface ProductItem {
  _id: string;
  name: string;
  photo: string;
  is18Plus: boolean;
  description: string;
}

interface ProductMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ProductSearchResponse {
  success: boolean;
  message: string;
  meta: ProductMeta;
  data: ProductItem[];
}

interface ProductSearchParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchProducts: builder.query<ProductSearchResponse, ProductSearchParams>({
      query: ({ searchTerm, page = 1, limit = 10 }) => {
        const params: Record<string, any> = { page, limit };
        if (searchTerm) {
          params.searchTerm = searchTerm;
        }
        return {
          url: `products`,
          method: 'GET',
          params,
        };
      },
      providesTags: ['Product'],
    }),
  }),
});

export const {
  useSearchProductsQuery,
  useLazySearchProductsQuery,
} = productApi;
