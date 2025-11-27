jest.mock('groq-sdk', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(async (opts: any) => ({
          choices: [
            { message: { content: JSON.stringify({ title: 'Song', style: 'upbeat pop', lyrics: 'Some sample lyrics', tagsYoutube: '#a #b #c', tagsReels: '#a #b', tagsTiktok: '#a', imagePrompt: 'A beautiful album cover with neon lights', videoPrompts: ['Scene 1', 'Scene 2'] }) } }
          ]
        })),
      },
    },
  }))
})

const OLD_ENV = process.env

describe('POST /api/generate route', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  test('returns 400 when no prompt provided', async () => {
    process.env.GROQ_API_KEY = 'fake'
    const route = require('../app/api/generate/route')

    const res = await route.handleGenerateRequestBody({})
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  test('returns 400 when prompt too long', async () => {
    process.env.GROQ_API_KEY = 'fake'
    const route = require('../app/api/generate/route')

    const longPrompt = 'x'.repeat(1001)
    const res = await route.handleGenerateRequestBody({ prompt: longPrompt })
    expect(res.status).toBe(400)
  })

  test('returns 200 for successful generation', async () => {
    process.env.GROQ_API_KEY = 'fake'
    const route = require('../app/api/generate/route')

    const res = await route.handleGenerateRequestBody({ prompt: 'Make me a song' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('title')
    expect(res.body).toHaveProperty('style')
    expect(res.body).toHaveProperty('lyrics')
  })

  test('returns 502 when Groq returns invalid JSON', async () => {
    process.env.GROQ_API_KEY = 'fake'
    const Groq = require('groq-sdk')
    // mock the next instance to return non-json content
    Groq.mockImplementationOnce(() => ({ chat: { completions: { create: jest.fn(async () => ({ choices: [{ message: { content: 'not-a-json' } }] })) } } }))

    const route = require('../app/api/generate/route')
    await expect(route.handleGenerateRequestBody({ prompt: 'hello' })).rejects.toThrow('INVALID_JSON')
  })

  test('fixes malformed tags automatically', async () => {
    process.env.GROQ_API_KEY = 'fake'
    const Groq = require('groq-sdk')
    // return tags that don't start with # or use commas
    Groq.mockImplementationOnce(() => ({
      chat: {
        completions: {
          create: jest.fn(async () => ({ choices: [{ message: { content: JSON.stringify({ title: 'X', style: 'upbeat', lyrics: 'lyrics here', tagsYoutube: 'badtag1, badtag2', tagsReels: 'nohash', tagsTiktok: '#ok', imagePrompt: 'A beautiful album cover', videoPrompts: ['Scene 1'] }) } }] }))
        }
      }
    }))

    const route = require('../app/api/generate/route')
    const res = await route.handleGenerateRequestBody({ prompt: 'hello' })
    
    expect(res.status).toBe(200)
    // Should have added # and removed commas
    expect(res.body.tagsYoutube).toContain('#badtag1')
    expect(res.body.tagsYoutube).toContain('#badtag2')
    expect(res.body.tagsReels).toContain('#nohash')
  })
})
