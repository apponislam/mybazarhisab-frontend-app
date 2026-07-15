import { baseApi } from '../../api/baseApi';
import { TUser } from './authSlice';

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
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
} = authApi;
