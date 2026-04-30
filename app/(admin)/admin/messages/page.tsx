import {
  archiveMessageAction,
  deleteMessageAction,
  markMessageReadAction,
  markMessageRepliedAction,
} from "@/actions/messages";
import { MessageStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function statusBadgeClass(status: MessageStatus): string {
  switch (status) {
    case MessageStatus.NEW: return "badge badge-danger";
    case MessageStatus.READ: return "badge badge-info";
    case MessageStatus.REPLIED: return "badge badge-success";
    case MessageStatus.ARCHIVED: return "badge badge-default";
    default:         return "badge badge-default";
  }
}

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: [{ createdAt: "desc" }],
  });

  return (
    <div>
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Messages Inbox</h1>
          <p className="admin-page-subtitle">Review inbound contact messages and track response workflow.</p>
        </div>
        {messages.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="badge badge-danger">
              {messages.filter((m) => m.status === MessageStatus.NEW).length} unread
            </span>
          </div>
        )}
      </div>

      {/* Messages list */}
      {messages.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">Inbox is empty</p>
          <p className="empty-state-desc">Contact messages will appear here once submitted.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {messages.map((message) => (
            <article
              key={message.id}
              className="admin-card"
              style={{
                borderLeftColor: message.status === MessageStatus.NEW ? "rgba(239,68,68,0.5)" : undefined,
                borderLeftWidth: message.status === MessageStatus.NEW ? "3px" : undefined,
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                  marginBottom: "0.75rem",
                }}
              >
                <div>
                  <h2 style={{ fontSize: "0.9375rem", fontWeight: 500, color: "var(--foreground)" }}>
                    {message.subject}
                  </h2>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", marginTop: "0.125rem" }}>
                    {message.name}
                    <span style={{ color: "var(--text-quaternary)", margin: "0 0.375rem" }}>·</span>
                    <a
                      href={`mailto:${message.email}`}
                      style={{ color: "var(--text-secondary)", transition: "color 160ms ease" }}
                    >
                      {message.email}
                    </a>
                  </p>
                </div>
                <span className={statusBadgeClass(message.status)}>{message.status}</span>
              </div>

              {/* Message body */}
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--text-tertiary)",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                  padding: "0.875rem 1rem",
                  background: "var(--background)",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                  marginBottom: "1rem",
                }}
              >
                {message.message}
              </p>

              {/* Timestamp + actions */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                }}
              >
                <p style={{ fontSize: "0.75rem", color: "var(--text-quaternary)" }}>
                  {new Date(message.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <form action={markMessageReadAction.bind(null, message.id)}>
                    <button type="submit" className="admin-btn-secondary">Mark Read</button>
                  </form>
                  <form action={markMessageRepliedAction.bind(null, message.id)}>
                    <button type="submit" className="admin-btn-secondary">Mark Replied</button>
                  </form>
                  <form action={archiveMessageAction.bind(null, message.id)}>
                    <button type="submit" className="admin-btn-secondary">Archive</button>
                  </form>
                  <form action={deleteMessageAction.bind(null, message.id)}>
                    <button type="submit" className="admin-btn-danger">Delete</button>
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
