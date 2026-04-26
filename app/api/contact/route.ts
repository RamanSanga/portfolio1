import { NextResponse } from "next/server";
import { isContactRateLimited } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { contactMessageSchema } from "@/lib/validators/contact";

export const runtime = "nodejs";

function getClientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Avoid grouping all unknown clients into one key.
  const ua = request.headers.get("user-agent")?.slice(0, 120) ?? "na";
  return `unknown:${ua}`;
}

export async function POST(request: Request) {
  const key = getClientKey(request);

  if (await isContactRateLimited(key)) {
    return NextResponse.json({ message: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const payload = await request.json();
  const parsed = contactMessageSchema.safeParse(payload);

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid input.";
    return NextResponse.json({ message }, { status: 400 });
  }

  await prisma.contactMessage.create({
    data: parsed.data,
  });

  return NextResponse.json({ message: "Message received successfully." }, { status: 201 });
}
