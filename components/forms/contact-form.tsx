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
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Name + Email row */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="label-overline"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Name
          </label>
          <input
            id="name"
            {...register("name")}
            className="form-input"
            placeholder="Your name"
          />
          {errors.name ? (
            <p style={{ marginTop: "0.375rem", fontSize: "0.75rem", color: "#f87171" }}>
              {errors.name.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="email"
            className="label-overline"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="form-input"
            placeholder="your@email.com"
          />
          {errors.email ? (
            <p style={{ marginTop: "0.375rem", fontSize: "0.75rem", color: "#f87171" }}>
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="label-overline"
          style={{ display: "block", marginBottom: "0.5rem" }}
        >
          Subject
        </label>
        <input
          id="subject"
          {...register("subject")}
          className="form-input"
          placeholder="Project collaboration"
        />
        {errors.subject ? (
          <p style={{ marginTop: "0.375rem", fontSize: "0.75rem", color: "#f87171" }}>
            {errors.subject.message}
          </p>
        ) : null}
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="label-overline"
          style={{ display: "block", marginBottom: "0.5rem" }}
        >
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          className="form-input"
          placeholder="Tell me about your role, timeline, or project details."
          style={{ resize: "vertical" }}
        />
        {errors.message ? (
          <p style={{ marginTop: "0.375rem", fontSize: "0.75rem", color: "#f87171" }}>
            {errors.message.message}
          </p>
        ) : null}
      </div>

      {/* Result message */}
      {resultMessage ? (
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--surface-raised)",
          }}
        >
          {resultMessage}
        </p>
      ) : null}

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary"
          style={{ opacity: isPending ? 0.6 : 1, cursor: isPending ? "not-allowed" : "pointer" }}
        >
          {isPending ? "Sending…" : "Send Message"}
        </button>
      </div>

    </form>
  );
}
