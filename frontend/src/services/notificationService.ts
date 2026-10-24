/**
 * notificationService — Fetches and normalizes notification data.
 *
 * Wraps the notifications API and ensures the returned shape always contains
 * both `pending` and `due_returns` arrays, even when the server omits them.
 */
import { NotificationsData } from "@/types";
import { notificationsApi } from "./api";

/**
 * Normalizes notification notice objects.
 */
export function normalizeNotifications(data: NotificationsData): NotificationsData {
  return {
    due_returns: Array.isArray(data?.due_returns) ? data.due_returns : [],
    pending: Array.isArray(data?.pending) ? data.pending : []
  };
}

export const notificationService = {
  async getNotifications(): Promise<NotificationsData> {
    const raw = await notificationsApi.getNotifications();
    return normalizeNotifications(raw);
  }
};
