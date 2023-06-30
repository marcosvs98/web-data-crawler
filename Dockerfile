FROM node:16.13

WORKDIR /app

ADD package.json /app

RUN npm install

ADD . /app

CMD ["npm", "run", "dev"]