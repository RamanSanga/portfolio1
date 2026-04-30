"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { ProjectStatus } from "@prisma/client";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { requireAdminSession } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { projectFormSchema, type ProjectFormInput } from "@/lib/validators/project";

type ActionResult = {
  success: boolean;
  error?: string;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function buildUniqueSlug(base: string, excludeProjectId?: string): Promise<string> {
  const normalized = slugify(base) || "project";
  let candidate = normalized;
  let count = 1;

  while (true) {
    const existing = await prisma.project.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === excludeProjectId) {
      return candidate;
    }

    count += 1;
    candidate = `${normalized}-${count}`;
  }
}

function parseTechStack(input?: string): string[] {
  if (!input) return [];
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function revalidateProjectPaths(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/projects", "page");
  revalidatePath("/admin/projects", "page");
  revalidateTag(CACHE_TAGS.publicHome, "max");
  revalidateTag(CACHE_TAGS.publicProjects, "max");
  revalidateTag(CACHE_TAGS.publicProjectDetail, "max");
  if (slug) {
    revalidatePath(`/projects/${slug}`, "page");
  }
}

export async function createProjectAction(input: ProjectFormInput): Promise<ActionResult> {
  await requireAdminSession();

  const parsed = projectFormSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? "Invalid input.";
    return { success: false, error: firstIssue };
  }

  try {
    const values = parsed.data;
    const slug = await buildUniqueSlug(values.slug || values.title);

    await prisma.project.create({
      data: {
        title: values.title,
        slug,
        shortDescription: values.shortDescription,
        longDescription: values.longDescription,
        problem: values.problem,
        solution: values.solution,
        impact: values.impact,
        techStack: parseTechStack(values.techStackText),
        liveUrl: values.liveUrl,
        repoUrl: values.repoUrl,
        caseStudyUrl: values.caseStudyUrl,
        coverImageUrl: values.coverImageUrl,
        videoUrl: values.videoUrl,
        featured: values.featured,
        published: values.published,
        status: values.published ? ProjectStatus.PUBLISHED : ProjectStatus.DRAFT,
        sortOrder: values.sortOrder,
      },
    });

    revalidateProjectPaths(slug);
    return { success: true };
  } catch (error) {
    console.error("createProjectAction error", error);
    return { success: false, error: "Failed to create project." };
  }
}

export async function updateProjectAction(projectId: string, input: ProjectFormInput): Promise<ActionResult> {
  await requireAdminSession();

  const parsed = projectFormSchema.safeParse(input);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? "Invalid input.";
    return { success: false, error: firstIssue };
  }

  try {
    const values = parsed.data;
    const slug = await buildUniqueSlug(values.slug || values.title, projectId);
    const current = await prisma.project.findUnique({ where: { id: projectId }, select: { slug: true } });

    await prisma.project.update({
      where: { id: projectId },
      data: {
        title: values.title,
        slug,
        shortDescription: values.shortDescription,
        longDescription: values.longDescription,
        problem: values.problem,
        solution: values.solution,
        impact: values.impact,
        techStack: parseTechStack(values.techStackText),
        liveUrl: values.liveUrl,
        repoUrl: values.repoUrl,
        caseStudyUrl: values.caseStudyUrl,
        coverImageUrl: values.coverImageUrl,
        videoUrl: values.videoUrl,
        featured: values.featured,
        published: values.published,
        status: values.published ? ProjectStatus.PUBLISHED : ProjectStatus.DRAFT,
        sortOrder: values.sortOrder,
      },
    });

    revalidateProjectPaths(current?.slug);
    if (slug !== current?.slug) {
      revalidateProjectPaths(slug);
    }
    return { success: true };
  } catch (error) {
    console.error("updateProjectAction error", error);
    return { success: false, error: "Failed to update project." };
  }
}

export async function deleteProjectAction(projectId: string): Promise<void> {
  await requireAdminSession();

  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { slug: true } });
  await prisma.project.delete({ where: { id: projectId } });
  revalidateProjectPaths(project?.slug);
}

export async function toggleProjectFeaturedAction(projectId: string): Promise<void> {
  await requireAdminSession();

  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { featured: true, slug: true } });
  if (!project) return;

  await prisma.project.update({
    where: { id: projectId },
    data: { featured: !project.featured },
  });

  revalidateProjectPaths(project.slug);
}

export async function toggleProjectPublishedAction(projectId: string): Promise<void> {
  await requireAdminSession();

  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { published: true, slug: true } });
  if (!project) return;

  const nextPublished = !project.published;

  await prisma.project.update({
    where: { id: projectId },
    data: {
      published: nextPublished,
      status: nextPublished ? ProjectStatus.PUBLISHED : ProjectStatus.DRAFT,
    },
  });

  revalidateProjectPaths(project.slug);
}
