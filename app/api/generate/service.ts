import Groq from 'groq-sdk'
import { validateGenerateResponse, GenerateResponse } from './schema'
import { createRequestLogger } from '../../libs/logger'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function generateFromPrompt(messages: { role: string; content: string }[], requestId?: string): Promise<GenerateResponse> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY_MISSING')
  }

  const logger = createRequestLogger(requestId ?? 'no-id')
  logger.info('Calling Groq completions', { messageCount: messages.length })
  const started = Date.now()

  // call Groq
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages,
    temperature: 0.8,
    max_tokens: 1500,
    response_format: { type: 'json_object' },
  })

  const content = completion.choices?.[0]?.message?.content
  if (!content) {
    logger.error('No content received from Groq')
    throw new Error('NO_CONTENT')
  }

  let parsed
  try {
    parsed = JSON.parse(content)
  } catch (err) {
    const e = new Error('INVALID_JSON')
    ;(e as any).cause = err
    logger.error('Invalid JSON from Groq', { cause: String(err) })
    throw e
  }

  const result = validateGenerateResponse(parsed)
  logger.info('Groq response validated', { durationMs: Date.now() - started })
  return result
}
