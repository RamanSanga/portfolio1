"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/authz";

function revalidateCertificationPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/certifications", "page");
  revalidatePath("/admin/certifications", "page");
  revalidateTag(CACHE_TAGS.publicHome, "max");
  revalidateTag(CACHE_TAGS.publicCertifications, "max");
}

const certificationSchema = z.object({
  issuer: z.string().trim().min(2),
  title: z.string().trim().min(2),
  issueDate: z.string().trim().optional(),
  credentialId: z.string().trim().optional(),
  credentialUrl: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || z.url().safeParse(value).success, {
      message: "Invalid URL",
    }),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
});

export async function createCertificationAction(formData: FormData) {
  await requireAdminSession();

  const parsed = certificationSchema.safeParse({
    issuer: formData.get("issuer"),
    title: formData.get("title"),
    issueDate: formData.get("issueDate") || undefined,
    credentialId: formData.get("credentialId") || undefined,
    credentialUrl: formData.get("credentialUrl") || undefined,
    sortOrder: formData.get("sortOrder"),
    isFeatured: formData.get("isFeatured") === "on",
  });

  if (!parsed.success) return;

  await prisma.certification.create({
    data: {
      issuer: parsed.data.issuer,
      title: parsed.data.title,
      issueDate: parsed.data.issueDate ? new Date(parsed.data.issueDate) : null,
      credentialId: parsed.data.credentialId,
      credentialUrl: parsed.data.credentialUrl,
      sortOrder: parsed.data.sortOrder,
      isFeatured: parsed.data.isFeatured,
    },
  });

  revalidateCertificationPaths();
}

export async function updateCertificationAction(certificationId: string, formData: FormData) {
  await requireAdminSession();

  const parsed = certificationSchema.safeParse({
    issuer: formData.get("issuer"),
    title: formData.get("title"),
    issueDate: formData.get("issueDate") || undefined,
    credentialId: formData.get("credentialId") || undefined,
    credentialUrl: formData.get("credentialUrl") || undefined,
    sortOrder: formData.get("sortOrder"),
    isFeatured: formData.get("isFeatured") === "on",
  });

  if (!parsed.success) return;

  await prisma.certification.update({
    where: { id: certificationId },
    data: {
      issuer: parsed.data.issuer,
      title: parsed.data.title,
      issueDate: parsed.data.issueDate ? new Date(parsed.data.issueDate) : null,
      credentialId: parsed.data.credentialId,
      credentialUrl: parsed.data.credentialUrl,
      sortOrder: parsed.data.sortOrder,
      isFeatured: parsed.data.isFeatured,
    },
  });

  revalidateCertificationPaths();
}

export async function deleteCertificationAction(certificationId: string) {
  await requireAdminSession();
  await prisma.certification.delete({ where: { id: certificationId } });
  revalidateCertificationPaths();
}
