import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";

const getPublicHomeDataCached = unstable_cache(
  async () => {
    const [profile, featuredProjects, categories, experience, certifications, resume, settings] =
      await Promise.all([
        prisma.siteProfile.findFirst({
          where: { singletonKey: "main" },
          select: {
            fullName: true,
            headline: true,
            about: true,
            primaryEmail: true,
            phone: true,
            location: true,
          },
        }),
        prisma.project.findMany({
          where: { published: true, featured: true },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
          take: 3,
          select: {
            id: true,
            slug: true,
            title: true,
            shortDescription: true,
            coverImageUrl: true,
            videoUrl: true,
            liveUrl: true,
          },
        }),
        prisma.skillCategory.findMany({
          where: { isVisible: true },
          include: {
            skills: {
              select: { name: true },
              orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            },
          },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        }),
        prisma.experience.findMany({
          orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { startDate: "desc" }],
          take: 4,
          select: {
            id: true,
            role: true,
            organization: true,
            context: true,
            summary: true,
          },
        }),
        prisma.certification.findMany({
          orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
          take: 6,
          select: {
            id: true,
            issuer: true,
            title: true,
          },
        }),
        prisma.resumeAsset.findFirst({
          where: { isActive: true },
          orderBy: [{ version: "desc" }, { updatedAt: "desc" }],
          select: {
            fileUrl: true,
          },
        }),
        prisma.siteSetting.findMany({
          where: {
            key: {
              in: ["contact_cta_title", "contact_cta_description"],
            },
          },
          select: {
            key: true,
            value: true,
          },
        }),
      ]);

    const settingsMap = new Map(settings.map((item) => [item.key, item.value]));

    return {
      profile,
      featuredProjects,
      categories,
      experience,
      certifications,
      resume,
      contactCtaTitle: String(settingsMap.get("contact_cta_title") ?? "Let us build your next product."),
      contactCtaDescription: String(
        settingsMap.get("contact_cta_description") ??
          "Open to full-stack, QA automation, and product engineering opportunities.",
      ),
    };
  },
  ["public-home-data"],
  {
    revalidate: 300,
    tags: [
      CACHE_TAGS.publicHome,
      CACHE_TAGS.publicProjects,
      CACHE_TAGS.publicExperience,
      CACHE_TAGS.publicCertifications,
      CACHE_TAGS.publicContact,
      CACHE_TAGS.publicSkills,
    ],
  },
);

const getPublishedProjectsCached = unstable_cache(
  async () => {
    return prisma.project.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        featured: true,
        shortDescription: true,
        coverImageUrl: true,
        videoUrl: true,
        liveUrl: true,
      },
    });
  },
  ["published-projects"],
  {
    revalidate: 300,
    tags: [CACHE_TAGS.publicProjects, CACHE_TAGS.publicProjectDetail],
  },
);

const getPublishedProjectBySlugCached = unstable_cache(
  async (slug: string) => {
    return prisma.project.findFirst({
      where: { slug, published: true },
      select: {
        title: true,
        shortDescription: true,
        longDescription: true,
        coverImageUrl: true,
        videoUrl: true,
        techStack: true,
        liveUrl: true,
        repoUrl: true,
        featured: true,
      },
    });
  },
  ["published-project-by-slug"],
  {
    revalidate: 300,
    tags: [CACHE_TAGS.publicProjectDetail, CACHE_TAGS.publicProjects],
  },
);

export async function getPublicHomeData() {
  return getPublicHomeDataCached();
}

export async function getPublishedProjects() {
  return getPublishedProjectsCached();
}

export async function getPublishedProjectBySlug(slug: string) {
  return getPublishedProjectBySlugCached(slug);
}
