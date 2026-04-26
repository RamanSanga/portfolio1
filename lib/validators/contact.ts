import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  email: z.string().trim().email("Valid email required."),
  subject: z.string().trim().min(4, "Subject is too short."),
  message: z.string().trim().min(12, "Message must be at least 12 characters."),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
