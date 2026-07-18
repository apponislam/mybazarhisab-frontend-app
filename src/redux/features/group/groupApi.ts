import { baseApi } from '../../api/baseApi';
import { setHasGroup } from '../auth/authSlice';

export type TGroupMember = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
};

export type TGroupCreator = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
} | string;

export type TGroupDetails = {
  _id: string;
  name: string;
  creator: TGroupCreator;
  members: TGroupMember[];
  inviteCode: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export const groupApi = baseApi.injectEndpoints({
  overrideExisting: true,
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
    getMyGroup: builder.query<{ success: boolean; message: string; data: TGroupDetails | null }, void>({
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
    leaveGroup: builder.mutation<{ success: boolean; message: string; data: any }, void>({
      query: () => ({
        url: 'groups/leave',
        method: 'DELETE',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.success) {
            dispatch(setHasGroup(false));
          }
        } catch (err) {
          console.log('Failed to leave group:', err);
        }
      },
    }),
    updateGroup: builder.mutation<{ success: boolean; message: string; data: any }, { name: string }>({
      query: (body) => ({
        url: 'groups',
        method: 'PATCH',
        body,
      }),
    }),
    generateInviteCode: builder.mutation<{ success: boolean; message: string; data: any }, void>({
      query: () => ({
        url: 'groups/generate-code',
        method: 'POST',
      }),
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
  useLeaveGroupMutation,
  useUpdateGroupMutation,
  useGenerateInviteCodeMutation,
} = groupApi;
