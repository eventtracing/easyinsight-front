FROM node:16.9 AS origin_builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn run build

FROM ruisin/spa-webserver:0.8.0-beta2-onbuild as runtime
COPY --from=origin_builder /app/dist/ ./dist/public
RUN mv ./dist/public/index.html ./dist

FROM scratch
COPY --from=runtime /app /