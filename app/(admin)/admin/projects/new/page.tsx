import Link from "next/link";
import { ProjectForm } from "@/components/forms/project-form";

export default function AdminProjectCreatePage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Create Project</h1>
          <p className="mt-1 text-sm text-zinc-400">Add a new case study entry to your portfolio.</p>
        </div>
        <Link
          href="/admin/projects"
          className="rounded-md border border-zinc-700 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-300"
        >
          Back to Projects
        </Link>
      </div>

      <ProjectForm mode="create" />
    </div>
  );
}
