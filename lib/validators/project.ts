import { z } from "zod";

const optionalUrl = z.string().trim().refine((value) => !value || z.url().safeParse(value).success, {
  message: "Please enter a valid URL.",
});

export const projectFormClientSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  slug: z.string().trim(),
  shortDescription: z.string().trim().min(10, "Short description must be at least 10 characters."),
  longDescription: z.string().trim(),
  problem: z.string().trim(),
  solution: z.string().trim(),
  impact: z.string().trim(),
  techStackText: z.string().trim(),
  liveUrl: optionalUrl,
  repoUrl: optionalUrl,
  caseStudyUrl: optionalUrl,
  coverImageUrl: optionalUrl,
  videoUrl: optionalUrl,
  sortOrder: z.number().int().min(0),
  featured: z.boolean(),
  published: z.boolean(),
});

export const projectFormSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  slug: z.string().trim().optional(),
  shortDescription: z.string().trim().min(10, "Short description must be at least 10 characters."),
  longDescription: z.string().trim().optional(),
  problem: z.string().trim().optional(),
  solution: z.string().trim().optional(),
  impact: z.string().trim().optional(),
  techStackText: z.string().trim().optional(),
  liveUrl: optionalUrl.optional(),
  repoUrl: optionalUrl.optional(),
  caseStudyUrl: optionalUrl.optional(),
  coverImageUrl: optionalUrl.optional(),
  videoUrl: optionalUrl.optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export type ProjectFormInput = z.infer<typeof projectFormSchema>;
export type ProjectFormValues = z.infer<typeof projectFormClientSchema>;
