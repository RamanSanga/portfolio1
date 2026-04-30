import Link from "next/link";
import {
  deleteProjectAction,
  toggleProjectFeaturedAction,
  toggleProjectPublishedAction,
} from "@/actions/projects";
import { prisma } from "@/lib/prisma";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Projects</h1>
          <p className="admin-page-subtitle">Manage case studies, publication status, and featured order.</p>
        </div>
        <Link href="/admin/projects/new" className="admin-btn-primary">
          + New Project
        </Link>
      </div>

      {/* Projects list */}
      {projects.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">No projects yet</p>
          <p className="empty-state-desc">Create your first project to get started.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {projects.map((project) => (
            <article key={project.id} className="admin-card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                {/* Left: info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                    <h2 style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--foreground)" }}>
                      {project.title}
                    </h2>
                    <span className={`badge ${project.published ? "badge-success" : "badge-warning"}`}>
                      {project.published ? "Published" : "Draft"}
                    </span>
                    {project.featured && (
                      <span className="badge badge-info">Featured</span>
                    )}
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-quaternary)", marginBottom: "0.5rem", fontFamily: "var(--font-mono)" }}>
                    /{project.slug}
                  </p>
                  {project.shortDescription && (
                    <p style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", lineHeight: 1.6, maxWidth: "65ch" }}>
                      {project.shortDescription}
                    </p>
                  )}
                </div>

                {/* Right: actions */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", flexShrink: 0 }}>
                  <Link href={`/admin/projects/${project.id}/edit`} className="admin-btn-secondary">
                    Edit
                  </Link>
                  <form action={toggleProjectFeaturedAction.bind(null, project.id)}>
                    <button type="submit" className="admin-btn-secondary">
                      {project.featured ? "Unfeature" : "Feature"}
                    </button>
                  </form>
                  <form action={toggleProjectPublishedAction.bind(null, project.id)}>
                    <button type="submit" className="admin-btn-secondary">
                      {project.published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={deleteProjectAction.bind(null, project.id)}>
                    <button type="submit" className="admin-btn-danger">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
