export class LogInfo {
  readonly jwtIssuer: string
  readonly status: number
  readonly body: object
  readonly resource: string
}

export enum LogLevel {
  error = 'error',
  warn = 'warn',
  info = 'info',
  verbose = 'verbose',
  debug = 'debug',
}
