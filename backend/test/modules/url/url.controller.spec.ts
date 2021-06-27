import { LoggerService } from '@logger/logger.service'
import { UrlController } from '@modules/url/url.controller'
import { UrlCreateDto } from '@modules/url/url.create.dto'
import { UrlService } from '@modules/url/url.service'
import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'

describe('UrlController', () => {

  /* eslint-disable functional/no-let */
  let urlController: UrlController
  let urlService: UrlService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: {
            createUrl: jest.fn(() => {
              return []
            }),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            getLogger: jest.fn(() => {
              return 'LoggerService'
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => {
              return 'test config service'
            }),
          },
        },
      ],
    }).compile()
    urlService = moduleRef.get<UrlService>(UrlService)
    urlController = moduleRef.get<UrlController>(UrlController)
  })
  describe('createUrl', () => {
    it('it should return the short url', async () => {
      const result = 'ZTAxiYjU'
      const serviceOutput = 'ZTAxiYjU'
      const mockRequest = {
        originalUrl: 'https://testurl.com',
        userId: 'test_user',
      } as UrlCreateDto

      jest
        .spyOn(urlService, 'createUrl')
        .mockImplementation(async () => {
          return Promise.resolve(serviceOutput)
        })

      expect(
        await urlController.createUrl(
          mockRequest,
        ),
      ).toEqual(result)
    })
  })
})

