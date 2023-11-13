FROM node:18.15.0-alpine

RUN apk add --no-cache bash && \
    npm i -g typescript ts-node

ARG ENV_FILE
ENV ENV_FILE=$ENV_FILE

COPY package*.json /tmp/app/
RUN cd /tmp/app && npm install

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app
RUN echo "$ENV_FILE" | base64 -d > /usr/src/app/.env
WORKDIR /usr/src/app
RUN npm run build

EXPOSE 8080
CMD ["npm", "run", "start:prod"]
