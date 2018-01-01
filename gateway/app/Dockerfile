FROM node:7.10-alpine

WORKDIR /usr/src/app
ADD . .

RUN npm install

EXPOSE 3000
CMD ["node", "index.js"]