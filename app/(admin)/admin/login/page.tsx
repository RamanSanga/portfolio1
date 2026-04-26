import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { AdminLoginForm } from "@/components/forms/admin-login-form";
import { authOptions } from "@/lib/auth";

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/admin/projects");
  }

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-6">
      <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Admin Sign In</h1>
        <p className="mt-2 text-sm text-zinc-400">Use your admin credentials to access the CMS dashboard.</p>
        <AdminLoginForm />
      </div>
    </section>
  );
}
