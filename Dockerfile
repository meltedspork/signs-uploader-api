FROM node:12.21.0

RUN mkdir /src

WORKDIR /src
ADD ./package.json /src/package.json
RUN npm install

EXPOSE 3000

CMD npm run start:dev