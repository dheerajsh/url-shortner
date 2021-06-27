FROM node:14.16-buster as dev-build
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md

USER root
COPY *.json /app/
COPY .eslintrc.js /app/
COPY src/ /app/src/
COPY test/ /app/test/

WORKDIR /app
RUN npm ci
RUN npm test
RUN npm run lint
RUN npm run build

FROM dev-build as pre-prod
RUN npm ci --production

FROM node:14.16-buster-slim as production-build
COPY --from=pre-prod --chown=10001:root /app/node_modules /app/node_modules
COPY --from=pre-prod --chown=10001:root /app/dist/ /app/

ENV NODE_ENV=production
USER 10001
EXPOSE ${APP_PORT}

WORKDIR /app
ENTRYPOINT ["node", "main.js", "${APP_PORT}"]
