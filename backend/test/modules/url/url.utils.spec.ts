import { createUniqueShortKey } from '@modules/url/url.utils'

describe('UrlUtils', () => {
  describe('createUniqueShortKeys', () => {
    it('it should be string and have a fix length', async () => {
      const result = await createUniqueShortKey('http://testurl.com', 'test_unique_id_1')
      // eslint-disable-next-line no-magic-numbers
      expect(result.length).toEqual(8)

    })
    it('it should be different for same url and different unique key', async () => {
      const result1 = await createUniqueShortKey('http://testurl.com', 'test_unique_id_1')
      const result2 = await createUniqueShortKey('http://testurl.com', 'test_unique_id_2')
      expect(result1).not.toEqual(result2)

    })
    it('it should be different for different url and different unique key', async () => {
      const result1 = await createUniqueShortKey('http://testurl1.com', 'test_unique_id_1')
      const result2 = await createUniqueShortKey('http://testurl2.com', 'test_unique_id_2')
      expect(result1).not.toEqual(result2)

    })
  })
})
