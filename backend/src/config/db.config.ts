import { registerAs } from '@nestjs/config'
import { ConfigFactory } from '@nestjs/config/dist/interfaces'

// eslint-disable-next-line complexity
export default registerAs<ConfigFactory<IDatabaseConfig>>('database', () => {
  return {
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEPUT, 10) || 2000,// eslint-disable-line no-magic-numbers
    db: process.env.DB_NAME || 'url_shortner',
    host: process.env.DB_HOST || 'localhost',
    pass: process.env.DB_PASS || '',
    poolSize: parseInt(process.env.DB_POOL_SIZE, 10) || 2,// eslint-disable-line no-magic-numbers
    port: parseInt(process.env.DB_PORT, 10) || 27013,  // eslint-disable-line no-magic-numbers
    queryTimeout: parseInt(process.env.DB_QUERY_TIMEPUT, 10) || 2000,// eslint-disable-line no-magic-numbers
    reconnectInterval: parseInt(process.env.DB_RECONNECT_INTERVAL, 10) || 1000,// eslint-disable-line no-magic-numbers
    reconnectTry: parseInt(process.env.DB_RECONNECT_INTERVAL, 10) || 86400,// eslint-disable-line no-magic-numbers
    user: process.env.DB_USER || '',
  }
})

export interface IDatabaseConfig {
  readonly db: string
  readonly port: number
  readonly host: string
  readonly user: string
  readonly pass: string
  readonly connectionTimeout: number
  readonly queryTimeout: number
  readonly reconnectInterval: number
  readonly reconnectTry: number
  readonly poolSize: number
}

