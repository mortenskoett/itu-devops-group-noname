FROM node:10-alpine

WORKDIR /minitwit

COPY package*.json ./
COPY server ./server
COPY static ./static
COPY views ./views

RUN npm install

EXPOSE 5000
EXPOSE 5001

WORKDIR /minitwit/server

ENTRYPOINT ["npm", "start"]
