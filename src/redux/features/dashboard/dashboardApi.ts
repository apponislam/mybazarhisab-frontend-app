import { baseApi } from '../../api/baseApi';
import { GroupStats } from '../../../screens/GroupPickerScreen';

interface UserDashboardStatsResponse {
  success: boolean;
  message: string;
  data: GroupStats;
}

export const dashboardApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getUserDashboardStats: builder.query<UserDashboardStatsResponse, void>({
      query: () => ({
        url: 'dashboard/user-stats',
        method: 'GET',
      }),
      providesTags: ['Dashboard', 'BazarEntry', 'Bill'],
    }),
  }),
});

export const {
  useGetUserDashboardStatsQuery,
} = dashboardApi;
