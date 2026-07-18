import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
// Force Babel / react-native-dotenv cache refresh
import { BASE_URL } from '@env';
import { RootState } from '../store';
import { login, logout } from '../features/auth/authSlice';

export interface TResponseMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  totalCost?: number;
  totalAmount?: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface RefreshTokenResponse {
  data: {
    accessToken: string;
    userEmail: string;
  };
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api/v1/`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState)?.auth?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log(result);

  if (result?.error?.status === 401 || result?.error?.status === 403) {
    const url = typeof args === 'string' ? args : args.url;
    if (url.includes('auth/login') || url.includes('auth/register')) {
      return result;
    }
    // Attempt token refresh
    const refreshResult = await baseQuery(
      { url: '/auth/refresh-token', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data && typeof refreshResult.data === 'object' && 'data' in refreshResult.data) {
      const backendData = (refreshResult.data as unknown as RefreshTokenResponse).data;
      const userEmail = backendData.userEmail;
      const accessToken = backendData.accessToken;
      
      if (userEmail && accessToken) {
        api.dispatch(login({ email: userEmail, token: accessToken }));
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
        return { error: { status: 401, data: 'Session expired' } };
      }
    } else {
      api.dispatch(logout());
      return { error: { status: 401, data: 'Session expired' } };
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Ledger',
    'Dashboard',
    'Product',
    'BazarEntry',
    'Bill',
  ],
  endpoints: () => ({}),
});
