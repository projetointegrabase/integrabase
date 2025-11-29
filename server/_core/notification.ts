import { TRPCError } from "@trpc/server";

export type NotificationPayload = {
  title: string;
  content: string;
};

/**
 * Simplified notification - just logs to console
 * In production, you could integrate with:
 * - Email service (SendGrid, Resend, etc.)
 * - Slack webhook
 * - Discord webhook
 * - Telegram bot
 */
export async function notifyOwner(
  payload: NotificationPayload
): Promise<boolean> {
  const { title, content } = payload;

  if (!title || !content) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title and content are required.",
    });
  }

  // Log notification (in production, send email/slack/etc)
  console.log("[Notification]", {
    title,
    content,
    timestamp: new Date().toISOString(),
  });

  return true;
}
