FROM node:alpine AS build

WORKDIR /app

COPY package*.json ./

COPY tsconfig*.json ./

RUN npm --verbose install -g @angular/cli

RUN npm install

COPY . .

RUN sed -i 's/allowedHosts: \[\]/allowedHosts: \["viewer.norbif.hu"\]/' Frontend/vite.config.js

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]
