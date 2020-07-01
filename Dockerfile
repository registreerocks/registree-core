FROM node:current-alpine
WORKDIR /app
COPY ./node_modules ./node_modules
COPY ./package.json ./
COPY ./dist ./dist
EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]