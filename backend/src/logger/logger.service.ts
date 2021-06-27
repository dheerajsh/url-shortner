import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TransformableInfo } from 'logform'
import moment from 'moment'
import { createLogger, format, Logger, transports } from 'winston'
import Transport from 'winston-transport'
import { LogInfo, LogLevel } from './logger.interfaces'

@Injectable()
export class LoggerService {
  private readonly loggerMap: Map<string, Logger> // eslint-disable-line functional/prefer-readonly-type
  private readonly logger: Logger

  constructor(private readonly configService: ConfigService) {
    this.logger = createLogger()

    this.loggerMap = new Map()
    this.loggerMap.set(LoggerService.name, this.logger)
    this.configure(
      this.logger,
      this.configService.get<string>('LOG_LEVEL', LogLevel.info),
      this.configService.get<string>('LOG_TRANSPORT'),
    )

  }

  public readonly getLogger = (className?: string): Logger => {
    if (className) {
      const classLogger = this.loggerMap.get(className)
      if (classLogger) {
        return classLogger
      }

      const childLogger = this.logger.child({ label: className })
      this.loggerMap.set(className, childLogger)

      return childLogger
    }

    return this.logger
  }

  public readonly configure = (
    logger: Logger,
    logLevel: string,
    outputType?: string,
  ): void => {
    const transportInstance = this.getTransport(outputType)

    logger.configure({
      exitOnError: false,
      level: logLevel,
      transports: [transportInstance],
    })
  }

  // eslint-disable-next-line complexity
  private format(options: TransformableInfo): string {
    const time = moment().format()

    const log = `[${time}]: ${options.level} - [${options.label}] - ${(options.message ? options.message : '')} ${(options.meta && Object.keys(options.meta).length) ? `\n${JSON.stringify(options.meta)}` : ''}`

    // Lets display important for us meta information from error
    if (options.level === LogLevel.error && options.data) return `${log}\n${JSON.stringify(options.data)}`

    return log
  }

  /**
   * Formatter for kibana
   *
   * @private
   * @param {TransformableInfo} info
   * @returns {string}
   * @memberof LogService
   */
  private kibanaFormatter(info: TransformableInfo): string {
    const date = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
    const customFields = this.createCustomFields(info)
    const log = {
      log_level: info.level.toUpperCase(),
      log_time: `[${date}]`,
      message: this.createMessage(info),
      ...{
        custom_fields: customFields,
        label: info.label,
        request: info.request,
        response: info.response,
      },
    }

    return JSON.stringify(log)
  }

  /**
   * Create message
   *
   * @private
   * @param {TransformableInfo} info
   * @returns {string}
   * @memberof LogService
   */
  private createMessage(info: TransformableInfo): string {
    const className = info.class ? `[${info.class}] ` : ''

    return `${className}${info.message.replace(className, '')}`
  }

  // eslint-disable cyclomatic-complexity no-unsafe-any no-object-mutation no-any
  /**
   * Create custom_fields for kibana.
   *
   * @private
   * @param {TransformableInfo} info
   * @returns {Object}
   * @memberof LogService
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private createCustomFields(info: TransformableInfo): any {
    const metaInfo = info.meta && info.meta instanceof LogInfo ? info.meta : {}
    const customFields = {
      ...(info.custom_fields ? info.custom_fields : Object),
      ...metaInfo,
    }
    // Convert any fields value to be string.
    // Ref: https://stackoverflow.com/a/14810722
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.keys(customFields).reduce((result: any, key) => {
      result[key] = customFields[key] // eslint-disable-line functional/immutable-data
      if (typeof result[key] !== 'string') {
        result[key] = JSON.stringify(result[key]) // eslint-disable-line functional/immutable-data
      }

      return result
    }, {})

    // eslint-disable-next-line no-magic-numbers
    return Object.keys(customFields).length > 0 ? customFields : null
  }

  // eslint-enable cyclomatic-complexity no-unsafe-any no-object-mutation no-any
  private getTransport(outputType?: string): Transport {
    switch (outputType) {
    case 'kibana':
      return new transports.Console({
        format: format.printf(this.kibanaFormatter.bind(this)),
      })

    case 'logstash':
      return new transports.Console({
        format: format.logstash(),
      })

    default:
      return new transports.Console({
        handleExceptions: true,
        format: format.combine(
          format.printf(this.format),
          format.colorize({ all: true }),
        ),
      })
    }
  }
}
// tslint:disable:cyclomatic-complexity no-unsafe-any no-object-mutation no-any
