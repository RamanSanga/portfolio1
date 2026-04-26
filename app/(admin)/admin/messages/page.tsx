import {
  archiveMessageAction,
  deleteMessageAction,
  markMessageReadAction,
  markMessageRepliedAction,
} from "@/actions/messages";
import { prisma } from "@/lib/prisma";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: [{ createdAt: "desc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Messages Inbox</h1>
      <p className="mt-1 text-sm text-zinc-400">Review inbound contact messages and track response workflow.</p>

      <section className="mt-6 space-y-3">
        {messages.map((message) => (
          <article key={message.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-medium text-zinc-100">{message.subject}</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {message.name} · {message.email}
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-300">{message.message}</p>
              </div>
              <span className="rounded border border-zinc-700 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-zinc-400">
                {message.status}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <form action={markMessageReadAction.bind(null, message.id)}>
                <button type="submit" className="rounded-md border border-zinc-700 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-300">Mark Read</button>
              </form>
              <form action={markMessageRepliedAction.bind(null, message.id)}>
                <button type="submit" className="rounded-md border border-zinc-700 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-300">Mark Replied</button>
              </form>
              <form action={archiveMessageAction.bind(null, message.id)}>
                <button type="submit" className="rounded-md border border-zinc-700 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-300">Archive</button>
              </form>
              <form action={deleteMessageAction.bind(null, message.id)}>
                <button type="submit" className="rounded-md border border-red-900/70 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-red-300">Delete</button>
              </form>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
