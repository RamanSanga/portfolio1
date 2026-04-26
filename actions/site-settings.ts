"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/authz";

const profileSchema = z.object({
  fullName: z.string().trim().min(2),
  headline: z.string().trim().min(4),
  tagline: z.string().trim().optional(),
  about: z.string().trim().min(20),
  location: z.string().trim().optional(),
  education: z.string().trim().optional(),
  profileImageUrl: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || z.url().safeParse(value).success, { message: "Invalid image URL" }),
  profileImagePublicId: z.string().trim().optional(),
});

const contactSchema = z.object({
  primaryEmail: z.string().trim().email(),
  universityEmail: z.string().trim().email().optional(),
  phone: z.string().trim().optional(),
  location: z.string().trim().optional(),
  education: z.string().trim().optional(),
});

const ctaSchema = z.object({
  title: z.string().trim().min(4),
  description: z.string().trim().min(8),
});

const resumeSchema = z.object({
  label: z.string().trim().min(2),
  fileUrl: z.string().trim().url(),
  mimeType: z.string().trim().optional(),
});

function revalidateSitePaths() {
  revalidatePath("/", "layout");
  revalidatePath("/contact", "page");
  revalidatePath("/admin/profile", "page");
  revalidatePath("/admin/contact", "page");
  revalidateTag(CACHE_TAGS.publicHome, "max");
  revalidateTag(CACHE_TAGS.publicContact, "max");
}

async function ensureMainProfile() {
  const existing = await prisma.siteProfile.findUnique({ where: { singletonKey: "main" } });
  if (existing) return existing;

  return prisma.siteProfile.create({
    data: {
      singletonKey: "main",
      fullName: "Portfolio Owner",
      headline: "Full-Stack Developer",
      about: "Profile details pending setup from admin dashboard.",
    },
  });
}

async function upsertSetting(key: string, value: string) {
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}

export async function updateSiteProfileAction(formData: FormData) {
  await requireAdminSession();

  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    headline: formData.get("headline"),
    tagline: formData.get("tagline") || undefined,
    about: formData.get("about"),
    location: formData.get("location") || undefined,
    education: formData.get("education") || undefined,
    profileImageUrl: formData.get("profileImageUrl") || undefined,
    profileImagePublicId: formData.get("profileImagePublicId") || undefined,
  });

  if (!parsed.success) return;

  await prisma.siteProfile.upsert({
    where: { singletonKey: "main" },
    create: {
      singletonKey: "main",
      ...parsed.data,
      primaryEmail: null,
      universityEmail: null,
      phone: null,
    },
    update: parsed.data,
  });

  revalidateSitePaths();
}

export async function updateContactDetailsAction(formData: FormData) {
  await requireAdminSession();

  const parsed = contactSchema.safeParse({
    primaryEmail: formData.get("primaryEmail"),
    universityEmail: formData.get("universityEmail") || undefined,
    phone: formData.get("phone") || undefined,
    location: formData.get("location") || undefined,
    education: formData.get("education") || undefined,
  });

  if (!parsed.success) return;

  const profile = await ensureMainProfile();

  await prisma.siteProfile.update({
    where: { id: profile.id },
    data: {
      primaryEmail: parsed.data.primaryEmail,
      universityEmail: parsed.data.universityEmail,
      phone: parsed.data.phone,
      location: parsed.data.location,
      education: parsed.data.education,
    },
  });

  revalidateSitePaths();
}

export async function updateContactCtaAction(formData: FormData) {
  await requireAdminSession();

  const parsed = ctaSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  if (!parsed.success) return;

  await upsertSetting("contact_cta_title", parsed.data.title);
  await upsertSetting("contact_cta_description", parsed.data.description);

  revalidateSitePaths();
}

export async function updateResumeAssetAction(formData: FormData) {
  await requireAdminSession();

  const parsed = resumeSchema.safeParse({
    label: formData.get("label"),
    fileUrl: formData.get("fileUrl"),
    mimeType: formData.get("mimeType") || undefined,
  });

  if (!parsed.success) return;

  const latest = await prisma.resumeAsset.findFirst({
    orderBy: [{ version: "desc" }, { createdAt: "desc" }],
  });

  await prisma.resumeAsset.updateMany({ data: { isActive: false } });

  await prisma.resumeAsset.create({
    data: {
      label: parsed.data.label,
      fileUrl: parsed.data.fileUrl,
      mimeType: parsed.data.mimeType,
      isActive: true,
      version: (latest?.version ?? 0) + 1,
    },
  });

  revalidateSitePaths();
}
