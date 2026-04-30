"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminLoginSchema, type AdminLoginInput } from "@/lib/validators/auth";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    setErrorMessage(null);
    const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/projects";

    startTransition(async () => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl,
      });

      if (!result || result.error) {
        setErrorMessage("Invalid credentials. Please try again.");
        return;
      }

      router.replace(result.url ?? callbackUrl);
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
      <div>
        <label htmlFor="email" className="admin-field-label">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="form-input"
          placeholder="admin@portfolio.dev"
          {...register("email")}
        />
        {errors.email ? (
          <p style={{ marginTop: "0.375rem", fontSize: "0.75rem", color: "#f87171" }}>
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className="admin-field-label">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="form-input"
          placeholder="Enter password"
          {...register("password")}
        />
        {errors.password ? (
          <p style={{ marginTop: "0.375rem", fontSize: "0.75rem", color: "#f87171" }}>
            {errors.password.message}
          </p>
        ) : null}
      </div>

      {errorMessage ? (
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
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary"
        style={{
          width: "100%",
          marginTop: "0.375rem",
          opacity: isPending ? 0.6 : 1,
          cursor: isPending ? "not-allowed" : "pointer",
        }}
      >
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
