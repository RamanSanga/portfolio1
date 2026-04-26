"use server";

import { revalidatePath } from "next/cache";
import { MessageStatus } from "@prisma/client";
import { requireAdminSession } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

function revalidateMessagePaths() {
  revalidatePath("/admin/messages", "page");
}

export async function markMessageReadAction(messageId: string) {
  await requireAdminSession();
  await prisma.contactMessage.update({
    where: { id: messageId },
    data: { isRead: true, status: MessageStatus.READ },
  });
  revalidateMessagePaths();
}

export async function markMessageRepliedAction(messageId: string) {
  await requireAdminSession();
  await prisma.contactMessage.update({
    where: { id: messageId },
    data: { isRead: true, status: MessageStatus.REPLIED, repliedAt: new Date() },
  });
  revalidateMessagePaths();
}

export async function archiveMessageAction(messageId: string) {
  await requireAdminSession();
  await prisma.contactMessage.update({
    where: { id: messageId },
    data: { status: MessageStatus.ARCHIVED },
  });
  revalidateMessagePaths();
}

export async function deleteMessageAction(messageId: string) {
  await requireAdminSession();
  await prisma.contactMessage.delete({ where: { id: messageId } });
  revalidateMessagePaths();
}
