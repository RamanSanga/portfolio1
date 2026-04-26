"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectAction, updateProjectAction } from "@/actions/projects";
import {
  projectFormClientSchema,
  type ProjectFormInput,
  type ProjectFormValues,
} from "@/lib/validators/project";

type ProjectFormProps = {
  mode: "create" | "edit";
  projectId?: string;
  initialValues?: Partial<ProjectFormValues>;
};

export function ProjectForm({ mode, projectId, initialValues }: ProjectFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const defaultValues = useMemo<ProjectFormValues>(
    () => ({
      title: initialValues?.title ?? "",
      slug: initialValues?.slug ?? "",
      shortDescription: initialValues?.shortDescription ?? "",
      longDescription: initialValues?.longDescription ?? "",
      problem: initialValues?.problem ?? "",
      solution: initialValues?.solution ?? "",
      impact: initialValues?.impact ?? "",
      techStackText: initialValues?.techStackText ?? "",
      liveUrl: initialValues?.liveUrl ?? "",
      repoUrl: initialValues?.repoUrl ?? "",
      caseStudyUrl: initialValues?.caseStudyUrl ?? "",
      coverImageUrl: initialValues?.coverImageUrl ?? "",
      sortOrder: initialValues?.sortOrder ?? 0,
      featured: initialValues?.featured ?? false,
      published: initialValues?.published ?? true,
    }),
    [initialValues],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormClientSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit((values) => {
    setFormError(null);

    startTransition(async () => {
      const payload: ProjectFormInput = {
        ...values,
        slug: values.slug || undefined,
        longDescription: values.longDescription || undefined,
        problem: values.problem || undefined,
        solution: values.solution || undefined,
        impact: values.impact || undefined,
        techStackText: values.techStackText || undefined,
        liveUrl: values.liveUrl || undefined,
        repoUrl: values.repoUrl || undefined,
        caseStudyUrl: values.caseStudyUrl || undefined,
        coverImageUrl: values.coverImageUrl || undefined,
      };

      const result =
        mode === "create"
          ? await createProjectAction(payload)
          : await updateProjectAction(projectId as string, payload);

      if (!result.success) {
        setFormError(result.error ?? "Unable to save project.");
        return;
      }

      router.push("/admin/projects");
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title" error={errors.title?.message}>
          <input
            {...register("title")}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100"
            placeholder="OneCart"
          />
        </Field>

        <Field label="Slug (optional)" error={errors.slug?.message}>
          <input
            {...register("slug")}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100"
            placeholder="onecart"
          />
        </Field>
      </div>

      <Field label="Short Description" error={errors.shortDescription?.message}>
        <textarea
          {...register("shortDescription")}
          rows={3}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100"
          placeholder="E-commerce platform with cart and checkout workflows."
        />
      </Field>

      <Field label="Long Description">
        <textarea
          {...register("longDescription")}
          rows={4}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Problem">
          <textarea
            {...register("problem")}
            rows={3}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100"
          />
        </Field>
        <Field label="Solution">
          <textarea
            {...register("solution")}
            rows={3}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100"
          />
        </Field>
        <Field label="Impact">
          <textarea
            {...register("impact")}
            rows={3}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100"
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Tech Stack (comma-separated)">
          <input
            {...register("techStackText")}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100"
            placeholder="Next.js, Prisma, PostgreSQL"
          />
        </Field>

        <Field label="Sort Order" error={errors.sortOrder?.message}>
          <input
            {...register("sortOrder", { valueAsNumber: true })}
            type="number"
            min={0}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100"
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Live URL" error={errors.liveUrl?.message}>
          <input
            {...register("liveUrl")}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100"
            placeholder="https://..."
          />
        </Field>

        <Field label="Repository URL" error={errors.repoUrl?.message}>
          <input
            {...register("repoUrl")}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100"
            placeholder="https://github.com/..."
          />
        </Field>

        <Field label="Case Study URL" error={errors.caseStudyUrl?.message}>
          <input
            {...register("caseStudyUrl")}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100"
            placeholder="https://..."
          />
        </Field>

        <Field label="Cover Image URL" error={errors.coverImageUrl?.message}>
          <input
            {...register("coverImageUrl")}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100"
            placeholder="https://res.cloudinary.com/..."
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-5 rounded-md border border-zinc-800 bg-zinc-900/30 px-4 py-3">
        <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" {...register("featured")} className="h-4 w-4 accent-zinc-200" />
          Featured project
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" {...register("published")} className="h-4 w-4 accent-zinc-200" />
          Published
        </label>
      </div>

      {formError ? <p className="text-sm text-red-400">{formError}</p> : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-white disabled:opacity-60"
        >
          {isPending ? "Saving..." : mode === "create" ? "Create Project" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-[0.13em] text-zinc-500">{label}</label>
      {children}
      {error ? <p className="mt-1.5 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
