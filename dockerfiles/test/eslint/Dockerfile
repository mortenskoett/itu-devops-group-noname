FROM node:10-alpine

WORKDIR /minitwit

COPY package*.json ./
COPY .eslintrc ./
COPY .eslint.json ./
COPY .gitignore ./
COPY server ./server
COPY static ./static
COPY views ./views

RUN npm install

WORKDIR /minitwit/server

ENTRYPOINT ["npm", "run", "pretest"]