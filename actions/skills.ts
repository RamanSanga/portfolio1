"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/authz";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function revalidateSkillPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/skills", "page");
  revalidatePath("/admin/skills/categories", "page");
  revalidateTag(CACHE_TAGS.publicHome, "max");
  revalidateTag(CACHE_TAGS.publicSkills, "max");
}

const createCategorySchema = z.object({
  name: z.string().trim().min(2),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isVisible: z.boolean().default(true),
});

const updateCategorySchema = createCategorySchema.extend({
  slug: z.string().trim().min(2),
});

const createSkillSchema = z.object({
  name: z.string().trim().min(1),
  categoryId: z.string().trim().min(1),
  proficiency: z.coerce.number().int().min(0).max(100).optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
});

const updateSkillSchema = createSkillSchema.extend({
  slug: z.string().trim().min(1),
});

async function uniqueCategorySlug(name: string, excludeId?: string) {
  const base = slugify(name) || "category";
  let candidate = base;
  let count = 1;

  while (true) {
    const existing = await prisma.skillCategory.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!existing || existing.id === excludeId) return candidate;
    count += 1;
    candidate = `${base}-${count}`;
  }
}

async function uniqueSkillSlug(name: string, excludeId?: string) {
  const base = slugify(name) || "skill";
  let candidate = base;
  let count = 1;

  while (true) {
    const existing = await prisma.skill.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!existing || existing.id === excludeId) return candidate;
    count += 1;
    candidate = `${base}-${count}`;
  }
}

export async function createSkillCategoryAction(formData: FormData) {
  await requireAdminSession();

  const parsed = createCategorySchema.safeParse({
    name: formData.get("name"),
    sortOrder: formData.get("sortOrder"),
    isVisible: formData.get("isVisible") === "on",
  });

  if (!parsed.success) return;

  const slug = await uniqueCategorySlug(parsed.data.name);
  await prisma.skillCategory.create({
    data: {
      name: parsed.data.name,
      slug,
      sortOrder: parsed.data.sortOrder,
      isVisible: parsed.data.isVisible,
    },
  });

  revalidateSkillPaths();
}

export async function updateSkillCategoryAction(categoryId: string, formData: FormData) {
  await requireAdminSession();

  const parsed = updateCategorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    sortOrder: formData.get("sortOrder"),
    isVisible: formData.get("isVisible") === "on",
  });

  if (!parsed.success) return;

  const slug = await uniqueCategorySlug(parsed.data.slug, categoryId);
  await prisma.skillCategory.update({
    where: { id: categoryId },
    data: {
      name: parsed.data.name,
      slug,
      sortOrder: parsed.data.sortOrder,
      isVisible: parsed.data.isVisible,
    },
  });

  revalidateSkillPaths();
}

export async function deleteSkillCategoryAction(categoryId: string) {
  await requireAdminSession();
  await prisma.skillCategory.delete({ where: { id: categoryId } });
  revalidateSkillPaths();
}

export async function createSkillAction(formData: FormData) {
  await requireAdminSession();

  const parsed = createSkillSchema.safeParse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    proficiency: formData.get("proficiency") || undefined,
    sortOrder: formData.get("sortOrder"),
    isFeatured: formData.get("isFeatured") === "on",
  });

  if (!parsed.success) return;

  const slug = await uniqueSkillSlug(parsed.data.name);
  await prisma.skill.create({
    data: {
      name: parsed.data.name,
      slug,
      categoryId: parsed.data.categoryId,
      proficiency: parsed.data.proficiency,
      sortOrder: parsed.data.sortOrder,
      isFeatured: parsed.data.isFeatured,
    },
  });

  revalidateSkillPaths();
}

export async function updateSkillAction(skillId: string, formData: FormData) {
  await requireAdminSession();

  const parsed = updateSkillSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    categoryId: formData.get("categoryId"),
    proficiency: formData.get("proficiency") || undefined,
    sortOrder: formData.get("sortOrder"),
    isFeatured: formData.get("isFeatured") === "on",
  });

  if (!parsed.success) return;

  const slug = await uniqueSkillSlug(parsed.data.slug, skillId);
  await prisma.skill.update({
    where: { id: skillId },
    data: {
      name: parsed.data.name,
      slug,
      categoryId: parsed.data.categoryId,
      proficiency: parsed.data.proficiency,
      sortOrder: parsed.data.sortOrder,
      isFeatured: parsed.data.isFeatured,
    },
  });

  revalidateSkillPaths();
}

export async function deleteSkillAction(skillId: string) {
  await requireAdminSession();
  await prisma.skill.delete({ where: { id: skillId } });
  revalidateSkillPaths();
}
