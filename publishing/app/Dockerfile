FROM node:7.10

WORKDIR /usr/src/app
COPY . .

RUN npm install
RUN yarn install

EXPOSE 1337
CMD ["yarn", "start"]