import { z } from 'zod'

export const GenerateResponseSchema = z.object({
  title: z.string(),
  style: z.string(),
  lyrics: z.string(),
  tagsYoutube: z.string(),
  tagsReels: z.string(),
  tagsTiktok: z.string(),
  imagePrompt: z.string(),
  videoPrompts: z.array(z.string()),
})

export type GenerateResponse = z.infer<typeof GenerateResponseSchema>

export function validateGenerateResponse(data: unknown): GenerateResponse {
  return GenerateResponseSchema.parse(data)
}
