import z from "zod";

const envSchema = z.object({
  SECRET_KEY: z.string(),
  API_BASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);
