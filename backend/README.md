
## Description
### This is the Backend API's for the url shortning service
URL shortening is used to create shorter aliases for long URLs. We call these shortened aliases “short links.” Users are redirected to the original URL when they hit these short links. Short links save a lot of space when displayed, printed, messaged, or tweeted. Additionally, users are less likely to mistype shorter URLs.

For example, if we shorten this page through TinyURL:

https://www.confluence.io/collection/page/5668639101419520/5649050225344512/5668600916475904/

We would get:

http://tinyurl.com/jlg8zpc

The shortened URL is nearly one-third the size of the actual URL.

URL shortening is used to optimize links across devices, track individual links to analyze audience, measure ad campaigns’ performance, or hide affiliated original URLs.

## Installation local

```bash
# using docker
$ docker-compose build

# without using docker
$ npm install
$ npm run build
```

## Running the app local

```bash
# development using docker compose
$ docker-compose up

# development without using docker compose
$ npm run start

# watch mode
$ npm run start:dev
```

## Production Environment (Make sure you have mongodb cluster running and updated environment files to connect it)

```bash
# production mode with docker
$ docker build -t urlShortnerApi:prod .
$ docker run -p4000:4000 -t urlShortnerApi:prod
```
### API Documentation is available through SWAGGER
Swagger api documentation can be access of http://localhost:4000/docs once the application is started
## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

```

## Database
### This service uses Mongo DB for storing/reteriving data. Please install and start mongo DB on local if you are not using docker compose before running the application. If you are using docker compose then no need to do this.
1. start the mongodb service on your local
2. Optional: create a DB name `url_shortner` if it's not there. [How to create a DB](https://www.mongodb.com/basics/create-database)
3. switch to the DB `url_shortner` you can use ```use url_shortner` from mongo shell.
4. Optional: create a user ```db.createUser(
{
user:"rabbit",
pwd: "rabbit123",
roles: [{role: "readWrite", db: "url_shortner"}]
}
)```
5. Update the .env file to use the mongo credentials from local.
## Encoding actual URL
We can compute a unique hash (e.g., MD5 or SHA256, etc.) of the given URL. The hash can then be encoded for display. This encoding could be base36 ([a-z ,0-9]) or base62 ([A-Z, a-z, 0-9]) and if we add ‘+’ and ‘/’ we can use Base64 encoding. A reasonable question would be, what should be the length of the short key? 6, 8, or 10 characters?

Using base64 encoding, a 6 letters long key would result in 64^6 = ~68.7 billion possible strings.
Using base64 encoding, an 8 letters long key would result in 64^8 = ~281 trillion possible strings.

With 68.7B unique strings, let’s assume six letter keys would suffice for our system.

If we use the MD5 algorithm as our hash function, it will produce a 128-bit hash value. After base64 encoding, we’ll get a string having more than 21 characters (since each base64 character encodes 6 bits of the hash value). Now we only have space for 6 (or 8) characters per short key; how will we choose our key then? We can take the first 6 (or 8) letters for the key. This could result in key duplication; to resolve that, we can choose some other characters out of the encoding string or swap some characters.

### What are the different issues with our solution? We have the following couple of problems with our encoding scheme:

If multiple users enter the same URL, they can get the same shortened URL, which is not acceptable.
What if parts of the URL are URL-encoded? e.g., http://www.localhost.com/distributed.html?id=design, and http://www.localhost.com/distributed.html%3Fid%3Ddesign are identical except for the URL encoding.
Workaround for the issues: We can append an increasing sequence number to each input URL to make it unique and then generate its hash. We don’t need to store this sequence number in the databases, though. Possible problems with this approach could be an ever-increasing sequence number. Can it overflow? Appending an increasing sequence number will also impact the performance of the service.

Another solution could be to append the user id (which should be unique) to the input URL. However, if the user has not signed in, we would have to ask the user to choose a uniqueness key. Even after this, if we have a conflict, we have to keep generating a key until we get a unique one

## Solution suggested and implemented
We can use the [random generated unique id](https://docs.mongodb.com/manual/reference/bson-types/#std-label-objectid), since it
will always be unique and we won't require a unique userId from user we will have a different hash every time.
The only downside for this approach is First we have to save the url record to the DB so the unique _id can be generated and then we will have to update the record again with generated hash.

## Stay in touch
Please reach out to [Dheeraj](https://github.com/dheerajsh)
## License

This is [MIT licensed](LICENSE).
