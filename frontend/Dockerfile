FROM node:alpine AS build

WORKDIR /app

COPY package*.json ./

COPY tsconfig*.json ./

RUN npm --verbose install -g @angular/cli

RUN npm install

COPY . .

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]
