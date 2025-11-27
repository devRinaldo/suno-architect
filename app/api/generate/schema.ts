import { z } from 'zod'

export const GenerateResponseSchema = z.object({
  title: z.string().min(1).max(120),
  // style must be in English / ASCII friendly - we automatically strip accents/non-ascii to prevent errors
  style: z.string().min(1).max(200)
    .transform((val) => {
      // Normalize to NFD (decomposes accents) and remove diacritics
      let s = val.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      // Remove any remaining non-ASCII characters
      s = s.replace(/[^\x00-\x7F]/g, "")
      return s.trim()
    })
    .refine((s) => s.length > 0, { message: 'style must not be empty after sanitization' }),
  lyrics: z.string().min(10).max(5000),
  // tags are a space separated string of hashtags; we use transform to be lenient with AI output (commas, missing #, etc)
  tagsYoutube: z.string().optional().default('').transform((t) => {
    return t.split(/[\s,]+/).filter(Boolean).map(tag => tag.startsWith('#') ? tag : `#${tag}`).slice(0, 30).join(' ')
  }),
  tagsReels: z.string().optional().default('').transform((t) => {
    return t.split(/[\s,]+/).filter(Boolean).map(tag => tag.startsWith('#') ? tag : `#${tag}`).slice(0, 30).join(' ')
  }),
  tagsTiktok: z.string().optional().default('').transform((t) => {
    return t.split(/[\s,]+/).filter(Boolean).map(tag => tag.startsWith('#') ? tag : `#${tag}`).slice(0, 30).join(' ')
  }),
  // Prompt for image generation (Midjourney/DALL-E) - optional to prevent failures if AI omits it
  imagePrompt: z.string().optional(),
  // Video prompts for each section of the song
  videoPrompts: z.array(z.string()).optional().default([]),
})

export type GenerateResponse = z.infer<typeof GenerateResponseSchema>

// helper: validate parsed JSON and return typed object or throw
export function validateGenerateResponse(obj: unknown): GenerateResponse {
  return GenerateResponseSchema.parse(obj)
}
