FROM node:10-alpine

WORKDIR /minitwit

COPY package*.json ./
COPY .eslintrc.js ./
COPY server ./server
COPY static ./static
COPY views ./views

RUN npm install

WORKDIR /minitwit/server

ENTRYPOINT ["npm", "run", "pretest"]