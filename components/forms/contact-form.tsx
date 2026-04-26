"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactMessageSchema, type ContactMessageInput } from "@/lib/validators/contact";

export function ContactForm() {
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactMessageInput>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setResultMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const payload = (await response.json()) as { message?: string };

        if (!response.ok) {
          setResultMessage(payload.message ?? "Failed to send message.");
          return;
        }

        setResultMessage("Message sent successfully. I will get back to you soon.");
        reset();
      } catch {
        setResultMessage("Unable to send message right now. Please try again later.");
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-zinc-500">
            Name
          </label>
          <input
            id="name"
            {...register("name")}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100"
            placeholder="Your name"
          />
          {errors.name ? <p className="mt-1 text-xs text-red-400">{errors.name.message}</p> : null}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-zinc-500">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100"
            placeholder="your@email.com"
          />
          {errors.email ? <p className="mt-1 text-xs text-red-400">{errors.email.message}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-zinc-500">
          Subject
        </label>
        <input
          id="subject"
          {...register("subject")}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100"
          placeholder="Project collaboration"
        />
        {errors.subject ? <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p> : null}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-zinc-500">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100"
          placeholder="Tell me about your role, timeline, or project details."
        />
        {errors.message ? <p className="mt-1 text-xs text-red-400">{errors.message.message}</p> : null}
      </div>

      {resultMessage ? <p className="text-sm text-zinc-300">{resultMessage}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-white disabled:opacity-60"
      >
        {isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
