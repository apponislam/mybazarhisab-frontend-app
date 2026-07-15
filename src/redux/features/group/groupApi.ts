import { baseApi } from '../../api/baseApi';
import { setHasGroup } from '../auth/authSlice';

export const groupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkGroup: builder.query<{ success: boolean; message: string; data: boolean }, void>({
      query: () => ({
        url: 'groups/check-group',
        method: 'GET',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data && typeof data.data === 'boolean') {
            dispatch(setHasGroup(data.data));
          }
        } catch (err) {
          console.log('Failed to check group membership:', err);
        }
      },
    }),
    getMyGroup: builder.query<{ success: boolean; message: string; data: { name: string; inviteCode: string } | null }, void>({
      query: () => ({
        url: 'groups/my-group',
        method: 'GET',
      }),
    }),
    createGroup: builder.mutation<{ success: boolean; message: string; data: any }, { name: string }>({
      query: (body) => ({
        url: 'groups',
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.success) {
            dispatch(setHasGroup(true));
          }
        } catch (err) {
          console.log('Failed to create group:', err);
        }
      },
    }),
    joinGroup: builder.mutation<{ success: boolean; message: string; data: any }, { inviteCode: string }>({
      query: (body) => ({
        url: 'groups/join',
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.success) {
            dispatch(setHasGroup(true));
          }
        } catch (err) {
          console.log('Failed to join group:', err);
        }
      },
    }),
  }),
});

export const {
  useCheckGroupQuery,
  useLazyCheckGroupQuery,
  useGetMyGroupQuery,
  useLazyGetMyGroupQuery,
  useCreateGroupMutation,
  useJoinGroupMutation,
} = groupApi;
