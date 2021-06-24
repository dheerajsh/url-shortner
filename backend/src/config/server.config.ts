import { registerAs } from '@nestjs/config'
import { ConfigFactory } from '@nestjs/config/dist/interfaces'

export default registerAs<ConfigFactory<IServerConfig>>('server', () => {
  return {
    port: parseInt(process.env.APP_PORT, 10) || 3000,  // eslint-disable-line no-magic-numbers
    logLevel: process.env.LOG_LEVEL,
    logTransport: process.env.LOG_TRANSPORT,
  }
})

export interface IServerConfig {
  readonly port: number
  readonly logLevel: string
  readonly logTransport: string
}

