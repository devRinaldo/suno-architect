import { NextRequest, NextResponse } from 'next/server'
import { generateFromPrompt } from './service'
import { createRequestLogger } from '../../libs/logger'
import { ZodError } from 'zod'

// Prompt do sistema - instrui a IA a agir como produtor musical especialista
const SYSTEM_PROMPT = `Você é um produtor musical especialista e consultor criativo para a plataforma Suno AI.
Sua missão é transformar pedidos musicais em linguagem natural em outputs otimizados:

1. **title**: Um nome criativo e marcante para a música (no idioma do pedido)

2. **style** (SEMPRE EM INGLÊS): Uma descrição técnica do estilo musical contendo:
   - Gênero(s) principal(is) e subgêneros
   - Instrumentos específicos (ex: acoustic guitar, synth bass, 808 drums)
   - Mood/vibe (ex: melancholic, uplifting, energetic)
   - Características vocais (ex: male vocals, falsetto, raspy voice)
   - BPM aproximado se relevante
   - Máximo de 200 caracteres para compatibilidade com Suno

3. **lyrics**: Uma letra original e criativa que:
   - Está no MESMO IDIOMA do pedido do usuário
   - Usa tags de estrutura: [Intro], [Verse], [Pre-Chorus], [Chorus], [Bridge], [Outro]
   - Tem rimas naturais e fluxo melódico
   - Tem entre 2-3 versos e 1-2 refrões

4. **tagsYoutube**: 15-20 hashtags otimizadas para YouTube (em português e inglês misturados, relevantes para o gênero e tema)

5. **tagsReels**: 15-20 hashtags otimizadas para Instagram Reels (mais curtas, trending, mix de português e inglês)

6. **tagsTiktok**: 15-20 hashtags otimizadas para TikTok (virais, trending, mix de português e inglês)

7. **imagePrompt**: Um prompt visual OTIMIZADO EM INGLÊS para geradores de imagem (Midjourney/DALL-E). Deve incluir:
   - Cena central (o que está acontecendo)
   - Estilo artístico específico (ex: cyberpunk, oil painting, 3d render, photography, surrealism)
   - Iluminação e Atmosfera (ex: neon lights, golden hour, cinematic lighting, dark moody)
   - Paleta de cores
   - Modificadores de qualidade OBRIGATÓRIOS: "8k resolution, masterpiece, highly detailed, trending on artstation, sharp focus"

8. **videoPrompts**: Uma lista (array) de prompts para IA de vídeo (Runway/Pika/Sora).
   - CRÍTICO: Gere EXATAMENTE um prompt para CADA seção da letra ([Intro], [Verse], [Chorus], etc).
   - Se a letra tem 8 seções, o array DEVE ter 8 prompts.
   - Siga a ordem exata da letra.
   - Cada prompt deve descrever uma cena cinematográfica em INGLÊS que combine com o mood daquela parte específica.
   - Inclua movimentos de câmera (ex: "slow pan", "zoom in", "drone shot").

REGRAS CRÍTICAS:
- Responda APENAS com um objeto JSON válido, sem texto adicional
- O JSON deve ter este formato: {"title": "...", "style": "...", "lyrics": "...", "tagsYoutube": "...", "tagsReels": "...", "tagsTiktok": "...", "imagePrompt": "...", "videoPrompts": ["prompt1", "prompt2", ...]}
- Não inclua markdown, explicações ou qualquer texto fora do JSON
- O style DEVE estar em inglês
- O imagePrompt e videoPrompts DEVEM estar em inglês
- A letra e título DEVEM estar no idioma do pedido original
- As tags devem começar com # e ser separadas por espaço`

// Interface para tipagem da resposta
interface GenerateResponse {
  title: string
  style: string
  lyrics: string
  tagsYoutube: string
  tagsReels: string
  tagsTiktok: string
  imagePrompt: string
  videoPrompts: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { status, body: payload } = await handleGenerateRequestBody(body)
    return NextResponse.json(payload, { status })
  } catch (error: unknown) {
    console.error('Erro na geração:', error)

    if (error instanceof Error) {
      if (error.message === 'INVALID_JSON') {
        return NextResponse.json(
          { error: 'Resposta da IA inválida (não é um JSON). Tente novamente.' },
          { status: 502 }
        )
      }
      if (error.message === 'GROQ_API_KEY_MISSING') {
        return NextResponse.json(
          { error: 'API Key da Groq não configurada. Verifique o arquivo .env.local' },
          { status: 500 }
        )
      }
      if (error instanceof ZodError || (error as any).name === 'ZodError') {
        const details = (error as ZodError).errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ')
        return NextResponse.json(
          { error: `Resposta da IA não passou validação do schema: ${details}` },
          { status: 422 }
        )
      }
      if (error.message.includes('401')) {
        return NextResponse.json(
          { error: 'API Key inválida. Verifique suas credenciais.' },
          { status: 401 }
        )
      }
      if (error.message.includes('429')) {
        return NextResponse.json(
          { error: 'Limite de requisições excedido. Aguarde um momento.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor. Tente novamente.' },
      { status: 500 }
    )
  }
}

// Helper that contains the core logic and returns a plain payload and status code
export async function handleGenerateRequestBody(body: any): Promise<{ status: number; body: any }> {
  // create request id and logger for traceability
  const requestId = (globalThis as any).crypto?.randomUUID?.() || `req-${Date.now()}`
  const logger = createRequestLogger(requestId)

  // Verifica se a API key está configurada
  if (!process.env.GROQ_API_KEY) {
    return { status: 500, body: { error: 'API Key da Groq não configurada. Verifique o arquivo .env.local' } }
  }

  const { prompt } = body || {}

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return { status: 400, body: { error: 'Por favor, descreva a música que você quer criar.' } }
  }

  if (prompt.length > 1000) {
    return { status: 400, body: { error: 'Descrição muito longa. Máximo de 1000 caracteres.' } }
  }

  try {
    logger.info('Handling generate request', { promptLength: String(prompt).length })
    const started = Date.now()

    const result = await generateFromPrompt([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ], requestId)

    if (!result.style || !result.lyrics || !result.title) {
      return { status: 500, body: { error: 'Resposta incompleta da IA. Tente novamente.' } }
    }

    // Ensure imagePrompt is present (backwards compatibility if model fails)
    if (!result.imagePrompt) {
      result.imagePrompt = `Abstract album cover art for a ${result.style} song titled "${result.title}", high quality, 4k`
    }

    logger.info('Generate success', { durationMs: Date.now() - started })
    return { status: 200, body: result }
  } catch (error: unknown) {
    // bubble up as an Error to be handled by caller
    throw error
  }
}
