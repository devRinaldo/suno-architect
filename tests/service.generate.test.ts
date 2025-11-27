// We'll require the service inside tests so jest.resetModules() can re-load with the current module mocks

jest.mock('groq-sdk', () => {
  // mocked class
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(async (opts: any) => {
          // default behaviour can be overridden in tests via mockImplementationOnce
          return {
            choices: [
              { message: { content: JSON.stringify({ title: 'X', style: 'upbeat', lyrics: 'lyrics here', tagsYoutube: '#test', tagsReels: '#r', tagsTiktok: '#t', imagePrompt: 'A beautiful album cover', videoPrompts: ['Scene 1'] }) } }
            ]
          }
        }),
      },
    },
  }))
})

describe('generateFromPrompt', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  test('throws when API key missing', async () => {
    delete process.env.GROQ_API_KEY
    const { generateFromPrompt } = require('../app/api/generate/service')
    await expect(generateFromPrompt([{ role: 'user', content: 'hello' } as any])).rejects.toThrow('GROQ_API_KEY_MISSING')
  })

  test('throws on invalid JSON response', async () => {
    process.env.GROQ_API_KEY = 'fake'

    // arrange the module mock so the next Groq instance returns invalid json
    const Groq = require('groq-sdk')
    Groq.mockImplementationOnce(() => ({
      chat: { completions: { create: jest.fn(async () => ({ choices: [{ message: { content: 'not-a-json' } }] })) } },
    }))

    const { generateFromPrompt } = require('../app/api/generate/service')
    await expect(generateFromPrompt([{ role: 'user', content: 'hello' } as any])).rejects.toThrow('INVALID_JSON')
  })

  test('returns parsed object on success', async () => {
    process.env.GROQ_API_KEY = 'fake'
    const { generateFromPrompt } = require('../app/api/generate/service')
    const resp = await generateFromPrompt([{ role: 'user', content: 'hello' } as any])

    expect(resp).toHaveProperty('title')
    expect(resp).toHaveProperty('style')
    expect(resp).toHaveProperty('lyrics')
  })
})
