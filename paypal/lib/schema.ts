import { z } from "zod";
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const librarySchema = z.object({
  name: z
    .string()
    .min(3, { message: "Library name must be at least 3 characters long" })
    .max(16, { message: "Library name must be at most 16 characters long" })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Library name can only contain letters and numbers",
    }),
  description: z.string().nonempty({ message: "Description is required" }),
  thumbnail: z
    .instanceof(File)
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Invalid image format. Only JPEG, PNG, and WebP are accepted.",
    }),
});

export type LibraryFormData = z.infer<typeof librarySchema>;
