"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/authz";

function revalidateExperiencePaths() {
  revalidatePath("/", "layout");
  revalidatePath("/experience", "page");
  revalidatePath("/admin/experience", "page");
  revalidateTag(CACHE_TAGS.publicHome, "max");
  revalidateTag(CACHE_TAGS.publicExperience, "max");
}

const experienceSchema = z.object({
  organization: z.string().trim().min(2),
  role: z.string().trim().min(2),
  context: z.string().trim().optional(),
  summary: z.string().trim().min(8),
  location: z.string().trim().optional(),
  startDate: z.string().trim().min(1),
  endDate: z.string().trim().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  featured: z.boolean().default(false),
});

export async function createExperienceAction(formData: FormData) {
  await requireAdminSession();

  const parsed = experienceSchema.safeParse({
    organization: formData.get("organization"),
    role: formData.get("role"),
    context: formData.get("context") || undefined,
    summary: formData.get("summary"),
    location: formData.get("location") || undefined,
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || undefined,
    sortOrder: formData.get("sortOrder"),
    featured: formData.get("featured") === "on",
  });

  if (!parsed.success) return;

  await prisma.experience.create({
    data: {
      organization: parsed.data.organization,
      role: parsed.data.role,
      context: parsed.data.context,
      summary: parsed.data.summary,
      location: parsed.data.location,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      sortOrder: parsed.data.sortOrder,
      featured: parsed.data.featured,
    },
  });

  revalidateExperiencePaths();
}

export async function updateExperienceAction(experienceId: string, formData: FormData) {
  await requireAdminSession();

  const parsed = experienceSchema.safeParse({
    organization: formData.get("organization"),
    role: formData.get("role"),
    context: formData.get("context") || undefined,
    summary: formData.get("summary"),
    location: formData.get("location") || undefined,
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || undefined,
    sortOrder: formData.get("sortOrder"),
    featured: formData.get("featured") === "on",
  });

  if (!parsed.success) return;

  await prisma.experience.update({
    where: { id: experienceId },
    data: {
      organization: parsed.data.organization,
      role: parsed.data.role,
      context: parsed.data.context,
      summary: parsed.data.summary,
      location: parsed.data.location,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      sortOrder: parsed.data.sortOrder,
      featured: parsed.data.featured,
    },
  });

  revalidateExperiencePaths();
}

export async function deleteExperienceAction(experienceId: string) {
  await requireAdminSession();
  await prisma.experience.delete({ where: { id: experienceId } });
  revalidateExperiencePaths();
}
