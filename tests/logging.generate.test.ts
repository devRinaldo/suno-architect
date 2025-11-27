const OLD_ENV = process.env

let createRequestLoggerMock: any = null

beforeEach(() => {
  jest.resetModules()
  process.env = { ...OLD_ENV }

  // setup a fresh logger mock before requiring modules
  jest.doMock('../app/libs/logger', () => {
    const createRequestLogger = jest.fn()
    ;(createRequestLogger as any).instances = []
    createRequestLogger.mockImplementation((id: string) => {
      const logger = {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
      }
      ;(createRequestLogger as any).instances.push(logger)
      return logger
    })
    return { createRequestLogger }
  })

  // basic groq-sdk default
  jest.doMock('groq-sdk', () => {
    return jest.fn().mockImplementation(() => ({
      chat: { completions: { create: jest.fn(async () => ({ choices: [{ message: { content: JSON.stringify({ title: 'Song', style: 'upbeat', lyrics: 'some sample lyrics', tagsYoutube: '#a', tagsReels: '#a', tagsTiktok: '#a', imagePrompt: 'A beautiful album cover', videoPrompts: ['Scene 1'] }) } }] })) } }
    }))
  })
})

afterAll(() => {
  process.env = OLD_ENV
})

test('route and service create loggers on success', async () => {
  process.env.GROQ_API_KEY = 'fake'

  // require mocked logger after doMock
  createRequestLoggerMock = require('../app/libs/logger').createRequestLogger

  const route = require('../app/api/generate/route')
  const res = await route.handleGenerateRequestBody({ prompt: 'Make me a song' })
  expect(res.status).toBe(200)

  // createRequestLogger should have been called at least once (route and/or service)
  expect(createRequestLoggerMock).toHaveBeenCalled()
  expect((createRequestLoggerMock as any).instances.length).toBeGreaterThanOrEqual(1)

  // ensure info was called on at least one logger instance
  const anyInfoCalls = (createRequestLoggerMock as any).instances.some((l: any) => l.info.mock.calls.length > 0)
  expect(anyInfoCalls).toBe(true)
})

test('invalid JSON from Groq triggers error logging', async () => {
  process.env.GROQ_API_KEY = 'fake'

  const Groq = require('groq-sdk')
  Groq.mockImplementationOnce(() => ({ chat: { completions: { create: jest.fn(async () => ({ choices: [{ message: { content: 'not-a-json' } }] })) } } }))

  createRequestLoggerMock = require('../app/libs/logger').createRequestLogger

  const route = require('../app/api/generate/route')
  await expect(route.handleGenerateRequestBody({ prompt: 'hello' })).rejects.toThrow('INVALID_JSON')

  // check that error was logged in at least one instance
  const anyError = (createRequestLoggerMock as any).instances.some((l: any) => l.error.mock.calls.length > 0)
  expect(anyError).toBe(true)
})
