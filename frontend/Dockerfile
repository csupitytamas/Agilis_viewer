FROM node:23.5-alpine AS build

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig*.json .


RUN npm install

USER node

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "node", "app.js" ]
