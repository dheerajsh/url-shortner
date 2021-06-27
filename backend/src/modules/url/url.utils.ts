import { createHash } from 'crypto'

/**
     * returns a unique short key for the url
     * @param url
     * @returns unique short key
     */
export const createUniqueShortKey = async (originalUrl: string, uniqueId: string): Promise<string> => {
  // create md2 hash from original url and unique object id of the DB.
  const hash = createHash('md5').update(originalUrl).update(uniqueId)

  const hashValue = hash.digest('hex')

  const base64Value = Buffer.from(hashValue).toString('base64')

  return base64Value.substr(0, 4) + base64Value.substr(base64Value.length - 5, 4) // eslint-disable-line no-magic-numbers
}
