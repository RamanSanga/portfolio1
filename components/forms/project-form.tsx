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
import { MediaUpload } from "@/components/admin/media-upload";

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
      videoUrl: initialValues?.videoUrl ?? "",
      sortOrder: initialValues?.sortOrder ?? 0,
      featured: initialValues?.featured ?? false,
      published: initialValues?.published ?? true,
    }),
    [initialValues],
  );

  const {
    register,
    handleSubmit,
    setValue,
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
        videoUrl: values.videoUrl || undefined,
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
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Title + Slug */}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title" error={errors.title?.message}>
          <input {...register("title")} className="admin-input" placeholder="OneCart" />
        </Field>
        <Field label="Slug (optional)" error={errors.slug?.message}>
          <input {...register("slug")} className="admin-input" placeholder="onecart" />
        </Field>
      </div>

      {/* Short description */}
      <Field label="Short Description" error={errors.shortDescription?.message}>
        <textarea
          {...register("shortDescription")}
          rows={3}
          className="admin-textarea"
          placeholder="E-commerce platform with cart and checkout workflows."
        />
      </Field>

      {/* Long description */}
      <Field label="Long Description">
        <textarea {...register("longDescription")} rows={4} className="admin-textarea" />
      </Field>

      {/* Problem / Solution / Impact */}
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Problem">
          <textarea {...register("problem")} rows={3} className="admin-textarea" />
        </Field>
        <Field label="Solution">
          <textarea {...register("solution")} rows={3} className="admin-textarea" />
        </Field>
        <Field label="Impact">
          <textarea {...register("impact")} rows={3} className="admin-textarea" />
        </Field>
      </div>

      {/* Tech + Sort */}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Tech Stack (comma-separated)">
          <input
            {...register("techStackText")}
            className="admin-input"
            placeholder="Next.js, Prisma, PostgreSQL"
          />
        </Field>
        <Field label="Sort Order" error={errors.sortOrder?.message}>
          <input
            {...register("sortOrder", { valueAsNumber: true })}
            type="number"
            min={0}
            className="admin-input"
          />
        </Field>
      </div>

      {/* URLs */}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Live URL" error={errors.liveUrl?.message}>
          <input {...register("liveUrl")} className="admin-input" placeholder="https://..." />
        </Field>
        <Field label="Repository URL" error={errors.repoUrl?.message}>
          <input {...register("repoUrl")} className="admin-input" placeholder="https://github.com/..." />
        </Field>
        <Field label="Case Study URL" error={errors.caseStudyUrl?.message}>
          <input {...register("caseStudyUrl")} className="admin-input" placeholder="https://..." />
        </Field>
      </div>

      <div className="grid gap-6 md:grid-cols-2 p-6 rounded-xl border border-white/5 bg-white/[0.02]">
        <div className="flex flex-col gap-4">
          <Field label="Cover Image URL" error={errors.coverImageUrl?.message}>
            <input {...register("coverImageUrl")} className="admin-input" placeholder="https://..." />
          </Field>
          <MediaUpload 
            label="Upload Cover Image" 
            onUploadComplete={(url) => setValue("coverImageUrl", url)} 
          />
        </div>
        <div className="flex flex-col gap-4">
          <Field label="Video Preview URL" error={errors.videoUrl?.message}>
            <input {...register("videoUrl")} className="admin-input" placeholder="https://..." />
          </Field>
          <MediaUpload 
            label="Upload Video Demo" 
            onUploadComplete={(url) => setValue("videoUrl", url)} 
          />
        </div>
      </div>

      {/* Flags */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.25rem",
          padding: "0.875rem 1rem",
          borderRadius: "8px",
          border: "1px solid var(--border-subtle)",
          background: "var(--background)",
        }}
      >
        <label className="admin-checkbox">
          <input type="checkbox" {...register("featured")} />
          Featured project
        </label>
        <label className="admin-checkbox">
          <input type="checkbox" {...register("published")} />
          Published
        </label>
      </div>

      {/* Form error */}
      {formError ? (
        <p
          style={{
            padding: "0.625rem 0.875rem",
            borderRadius: "6px",
            background: "var(--danger-muted)",
            border: "1px solid rgba(239,68,68,0.25)",
            fontSize: "0.8125rem",
            color: "#fca5a5",
          }}
        >
          {formError}
        </p>
      ) : null}

      {/* Submit */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="submit"
          disabled={isPending}
          className="admin-btn-primary"
          style={{ opacity: isPending ? 0.6 : 1, cursor: isPending ? "not-allowed" : "pointer", fontSize: "0.8125rem", padding: "0.625rem 1.5rem" }}
        >
          {isPending ? "Saving…" : mode === "create" ? "Create Project" : "Save Changes"}
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
      <label className="admin-field-label">{label}</label>
      {children}
      {error ? (
        <p style={{ marginTop: "0.375rem", fontSize: "0.75rem", color: "#f87171" }}>{error}</p>
      ) : null}
    </div>
  );
}
