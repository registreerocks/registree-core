FROM node:current-alpine
WORKDIR /app
COPY ./package.json ./
COPY ./dist ./dist
COPY ./.yarn ./.yarn
COPY ./.pnp.js ./
COPY ./yarn.lock ./
EXPOSE 3000
CMD [ "yarn", "start:prod" ]
