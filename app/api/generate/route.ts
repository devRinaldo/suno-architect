import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

// Inicializa o cliente Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

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

REGRAS CRÍTICAS:
- Responda APENAS com um objeto JSON válido, sem texto adicional
- O JSON deve ter este formato: {"title": "...", "style": "...", "lyrics": "...", "tagsYoutube": "...", "tagsReels": "...", "tagsTiktok": "..."}
- Não inclua markdown, explicações ou qualquer texto fora do JSON
- O style DEVE estar em inglês
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
}

export async function POST(request: NextRequest) {
  try {
    // Verifica se a API key está configurada
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'API Key da Groq não configurada. Verifique o arquivo .env.local' },
        { status: 500 }
      )
    }

    // Extrai o prompt do corpo da requisição
    const body = await request.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Por favor, descreva a música que você quer criar.' },
        { status: 400 }
      )
    }

    // Limita o tamanho do prompt para evitar abusos
    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: 'Descrição muito longa. Máximo de 1000 caracteres.' },
        { status: 400 }
      )
    }

    // Faz a chamada para a Groq (usando Llama 3)
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    })

    // Extrai o conteúdo da resposta
    const content = completion.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { error: 'Não foi possível gerar o conteúdo. Tente novamente.' },
        { status: 500 }
      )
    }

    // Parse do JSON retornado
    const result: GenerateResponse = JSON.parse(content)

    // Valida se os campos necessários existem
    if (!result.style || !result.lyrics || !result.title) {
      return NextResponse.json(
        { error: 'Resposta incompleta da IA. Tente novamente.' },
        { status: 500 }
      )
    }

    return NextResponse.json(result)

  } catch (error: unknown) {
    console.error('Erro na geração:', error)
    
    // Tratamento de erros
    if (error instanceof Error) {
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
