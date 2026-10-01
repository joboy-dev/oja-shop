import { z } from "zod"

export const fileBaseSchema = z.object({
  file: z.instanceof(FileList),
  file_name: z.string().optional().nullable(),
  model_id: z.string().optional().nullable(),
  model_name: z.string().transform(v => typeof v === "string" ? v.trim().toLowerCase() : v),
  url: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  label: z.string().optional().nullable().transform(v => typeof v === "string" ? v.trim().toLowerCase() : v),
})

export const updateFileSchema = z.object({
  // file: z.instanceof(FileList).optional().nullable(),
  file_name: z.string().optional().nullable(),
  // url: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  label: z.string().optional().nullable().transform(v => typeof v === "string" ? v.trim().toLowerCase() : v),
  position: z.number().int().optional().nullable(),
})

export const bulkUploadFileSchema = z.object({
  files: z.instanceof(FileList),
  model_id: z.string().optional().nullable(),
  model_name: z.string().transform(v => typeof v === "string" ? v.trim().toLowerCase() : v),
});


export type FileBaseFormData = z.infer<typeof fileBaseSchema>
export type UpdateFileFormData = z.infer<typeof updateFileSchema>
export type BulkUploadFileFormData = z.infer<typeof bulkUploadFileSchema>
