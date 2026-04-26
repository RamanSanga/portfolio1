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
    const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

    startTransition(async () => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!result || result.error) {
        setErrorMessage("Invalid credentials. Please try again.");
        return;
      }

      router.push("/admin/projects");
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-zinc-500">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
          placeholder="admin@portfolio.dev"
          {...register("email")}
        />
        {errors.email ? <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p> : null}
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-zinc-500">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
          placeholder="Enter password"
          {...register("password")}
        />
        {errors.password ? <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p> : null}
      </div>

      {errorMessage ? <p className="text-xs text-red-400">{errorMessage}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-md bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-white disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
