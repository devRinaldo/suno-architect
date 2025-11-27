// Lightweight structured logger wrapper used across the API handlers
// Keeps logging consistent and easy to mock in tests.

export type RequestLogger = {
  info: (...args: any[]) => void
  warn: (...args: any[]) => void
  error: (...args: any[]) => void
  debug?: (...args: any[]) => void
}

export function createRequestLogger(requestId: string): RequestLogger {
  const prefix = `[req:${requestId}]`

  function safeArgs(args: any[]) {
    try {
      return args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a)))
    } catch {
      return args
    }
  }

  return {
    info: (...args: any[]) => console.log(prefix, 'INFO', ...safeArgs(args)),
    warn: (...args: any[]) => console.warn(prefix, 'WARN', ...safeArgs(args)),
    error: (...args: any[]) => console.error(prefix, 'ERROR', ...safeArgs(args)),
    debug: (...args: any[]) => console.debug(prefix, 'DEBUG', ...safeArgs(args)),
  }
}

export function globalLogger() {
  return createRequestLogger('global')
}
