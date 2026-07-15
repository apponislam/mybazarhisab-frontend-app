import { baseApi } from '../../api/baseApi';
import { TUser, updateUser } from './authSlice';

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: TUser;
    accessToken: string;
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, any>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<AuthResponse, any>({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    forgotPassword: builder.mutation<{ success: boolean; message: string; data: null }, { email: string }>({
      query: (body) => ({
        url: 'auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    verifyOtp: builder.mutation<{ success: boolean; message: string; data: { token: string } }, { email: string; otp: string }>({
      query: (body) => ({
        url: 'auth/verify-otp',
        method: 'POST',
        body,
      }),
    }),
    resendOtp: builder.mutation<{ success: boolean; message: string; data: null }, { email: string }>({
      query: (body) => ({
        url: 'auth/resend-otp',
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation<{ success: boolean; message: string; data: null }, { token: string; newPassword: string }>({
      query: (body) => ({
        url: 'auth/reset-password',
        method: 'POST',
        body,
      }),
    }),
    getMe: builder.query<{ success: boolean; message: string; data: TUser }, void>({
      query: () => ({
        url: 'auth/me',
        method: 'GET',
      }),
      providesTags: ['User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            dispatch(updateUser(data.data));
          }
        } catch (err) {
          // ignore
        }
      },
    }),
    updateProfile: builder.mutation<{ success: boolean; message: string; data: TUser }, Partial<TUser>>({
      query: (profileData) => ({
        url: 'auth/profile',
        method: 'PATCH',
        body: profileData,
      }),
      invalidatesTags: ['User'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            dispatch(updateUser(data.data));
          }
        } catch (err) {
          // ignore
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
} = authApi;
