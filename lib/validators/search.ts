import { z } from "zod";

export const searchQuerySchema = z.string().trim().min(2).max(80);
