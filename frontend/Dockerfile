FROM node:alpine AS build

WORKDIR /app

COPY package*.json ./

COPY tsconfig.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build --configuration=production

FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build app/dist/valtogatos-app/browser /usr/share/nginx/html

EXPOSE 80
