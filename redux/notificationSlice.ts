import { createSlice } from "@reduxjs/toolkit";

export type NotificationItem = {
  _id: string;
  title: string;
  message: string;
  type?: string;
  isRead: boolean;
  createdAt: string;
};

type NotificationState = {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
};

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
  } as NotificationState,
  reducers: {
    setNotifications(state, action) {
      state.notifications = action.payload || [];
    },
    setUnreadCount(state, action) {
      state.unreadCount = action.payload ?? 0;
    },
    setNotificationLoading(state, action) {
      state.loading = Boolean(action.payload);
    },
    markNotificationReadLocal(state, action) {
      const id = action.payload;
      const n = state.notifications.find((x) => x._id === id);
      if (n) {
        n.isRead = true;
      }
      state.unreadCount = state.notifications.filter((x) => !x.isRead).length;
    },
    markAllReadLocal(state) {
      state.notifications = state.notifications.map((n) => ({ ...n, isRead: true }));
      state.unreadCount = 0;
    },
  },
});

export const {
  setNotifications,
  setUnreadCount,
  setNotificationLoading,
  markNotificationReadLocal,
  markAllReadLocal,
} = notificationSlice.actions;

export default notificationSlice.reducer;
