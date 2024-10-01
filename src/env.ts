import z from "zod";

const envSchema = z.object({
  SECRET_KEY: z.string(),
  DIRECT_URL: z.string(),
  DATABASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);
