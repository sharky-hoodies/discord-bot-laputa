FROM node:16.19.0-bullseye-slim

WORKDIR /root
COPY package*.json ./
RUN npm install

COPY . .
CMD [ "node", "index.js" ]
EXPOSE 8080
