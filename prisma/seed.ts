import bcrypt from "bcryptjs";
import { PrismaClient, ProjectStatus } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@portfolio.dev").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.contactMessage.deleteMany();
  await prisma.projectImage.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.resumeAsset.deleteMany();
  await prisma.siteProfile.deleteMany();

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      isActive: true,
      name: "Raman Sanga",
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Raman Sanga",
    },
  });

  const profile = await prisma.siteProfile.create({
    data: {
      fullName: "Raman Sanga",
      headline: "Full-Stack Developer and QA-Focused Engineer",
      tagline: "Building reliable products with strong execution and clean engineering.",
      about:
        "I am a B.Tech CSE student at Bennett University, focused on full-stack product development and quality-driven engineering. I build practical web products with attention to performance, testing discipline, and developer experience.",
      location: "Greater Noida",
      education: "B.Tech CSE, Bennett University, 2027",
      primaryEmail: "ramansanga63@gmail.com",
      universityEmail: "e23cseu2005@bennett.edu.in",
      phone: "+91 93065 32302",
    },
  });

  await prisma.socialLink.createMany({
    data: [
      {
        platform: "Email",
        label: "Primary Email",
        url: "mailto:ramansanga63@gmail.com",
        sortOrder: 1,
        siteProfileId: profile.id,
      },
      {
        platform: "University Email",
        label: "Academic Email",
        url: "mailto:e23cseu2005@bennett.edu.in",
        sortOrder: 2,
        siteProfileId: profile.id,
      },
      {
        platform: "Phone",
        label: "Mobile",
        url: "tel:+919306532302",
        sortOrder: 3,
        siteProfileId: profile.id,
      },
    ],
  });

  const categories = [
    "Languages",
    "Web Dev",
    "QA & Testing",
    "Databases",
    "DevOps & CI/CD",
    "AI / GenAI",
  ];

  const categoryMap = new Map<string, string>();

  for (const [index, categoryName] of categories.entries()) {
    const category = await prisma.skillCategory.create({
      data: {
        name: categoryName,
        slug: slugify(categoryName),
        sortOrder: index,
      },
    });
    categoryMap.set(categoryName, category.id);
  }

  const skillsByCategory: Record<string, string[]> = {
    Languages: ["Python", "Java", "C++", "JavaScript"],
    "Web Dev": ["React.js", "Node.js", "Express.js", "HTML", "CSS"],
    "QA & Testing": ["Selenium", "Playwright"],
    Databases: ["MySQL", "MongoDB", "PostgreSQL"],
    "DevOps & CI/CD": ["GitHub Actions", "Docker", "CI/CD Pipelines", "Git"],
    "AI / GenAI": ["OpenAI API"],
  };

  let skillOrder = 0;
  for (const [categoryName, skills] of Object.entries(skillsByCategory)) {
    const categoryId = categoryMap.get(categoryName);
    if (!categoryId) continue;

    for (const skillName of skills) {
      await prisma.skill.create({
        data: {
          name: skillName,
          slug: slugify(skillName),
          categoryId,
          sortOrder: skillOrder++,
          isFeatured: ["JavaScript", "React.js", "Node.js", "PostgreSQL"].includes(skillName),
        },
      });
    }
  }

  const projects = [
    {
      title: "OneCart",
      slug: "onecart",
      shortDescription: "E-commerce platform with catalog, cart, checkout, and order workflows.",
      longDescription:
        "A full-stack commerce platform focused on clean UX, maintainable backend design, and dependable checkout flows.",
      techStack: ["React", "Node.js", "PostgreSQL"],
      featured: true,
      sortOrder: 1,
    },
    {
      title: "Zobzee",
      slug: "zobzee",
      shortDescription: "Job portal with listings, search, and employer-candidate workflows.",
      longDescription:
        "A hiring platform that streamlines posting, filtering, and application handling with practical dashboard tooling.",
      techStack: ["Next.js", "Node.js", "PostgreSQL"],
      featured: true,
      sortOrder: 2,
    },
    {
      title: "MegaBlog",
      slug: "megablog",
      shortDescription: "Blogging application with publishing and structured content management.",
      longDescription:
        "A content-focused app enabling creation, editing, and management of long-form posts with strong data modeling.",
      techStack: ["React", "Express", "MongoDB"],
      featured: false,
      sortOrder: 3,
    },
    {
      title: "FullStack Mastery",
      slug: "fullstack-mastery",
      shortDescription: "Learning and implementation project around full-stack architecture patterns.",
      longDescription:
        "A practical project suite covering modern full-stack concepts with emphasis on structure and execution quality.",
      techStack: ["TypeScript", "React", "Node.js"],
      featured: false,
      sortOrder: 4,
    },
    {
      title: "Random Meme Generator",
      slug: "random-meme-generator",
      shortDescription: "Lightweight app that generates memes via external API integrations.",
      longDescription:
        "A compact frontend-first product that demonstrates API consumption and responsive interaction patterns.",
      techStack: ["JavaScript", "HTML", "CSS"],
      featured: false,
      sortOrder: 5,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({
      data: {
        title: project.title,
        slug: project.slug,
        shortDescription: project.shortDescription,
        longDescription: project.longDescription,
        techStack: project.techStack,
        featured: project.featured,
        sortOrder: project.sortOrder,
        status: ProjectStatus.PUBLISHED,
      },
    });
  }

  await prisma.experience.createMany({
    data: [
      {
        organization: "Freelance",
        role: "Web Developer",
        context: "Clothing E-commerce Website",
        summary:
          "Delivered a custom e-commerce website for a clothing business with product browsing and conversion-focused user flows.",
        startDate: new Date("2024-12-01"),
        endDate: new Date("2025-02-28"),
        featured: true,
        sortOrder: 1,
      },
      {
        organization: "Smart India Hackathon",
        role: "Participant",
        context: "24th Position",
        summary:
          "Achieved 24th position with a working solution developed under time-constrained, competitive conditions.",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        featured: true,
        sortOrder: 2,
      },
    ],
  });

  await prisma.certification.createMany({
    data: [
      {
        issuer: "NVIDIA",
        title: "Getting Started with Accelerated Computing in CUDA C++",
        isFeatured: true,
        sortOrder: 1,
      },
      {
        issuer: "UC San Diego",
        title: "Data Structures Specialization",
        isFeatured: true,
        sortOrder: 2,
      },
    ],
  });

  await prisma.siteSetting.createMany({
    data: [
      {
        key: "contact_cta_title",
        value: "Let us build your next product.",
      },
      {
        key: "contact_cta_description",
        value: "Open to full-stack, QA automation, and product engineering opportunities.",
      },
      {
        key: "seo_site_title",
        value: "Raman Sanga | Portfolio",
      },
      {
        key: "seo_site_description",
        value: "Full-stack developer portfolio featuring projects, experience, and certifications.",
      },
    ],
  });

  await prisma.resumeAsset.create({
    data: {
      label: "Primary Resume",
      fileUrl: "https://example.com/resume.pdf",
      mimeType: "application/pdf",
      isActive: true,
      version: 1,
    },
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
