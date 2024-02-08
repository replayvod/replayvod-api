FROM node:20.7.0-alpine as base

ENV NODE_ENV=production \
    PORT=8080 \
    LOG_DIR=/app/logs \
    PUBLIC_DIR=/app/public \ 
    DATA_DIR=/app/data \
    SECRET-DIR=/app/secret

WORKDIR /app

RUN apk add --update python3 py3-pip && \
    python3 -m ensurepip && \
    pip3 install --upgrade pip setuptools

RUN python3 --version && pip3 --version

COPY package*.json ./

COPY ./prisma ./prisma

RUN npm install && npm cache clean --force

RUN npm ci --only=production

RUN apk add --update ffmpeg

COPY ./dist ./
COPY ./bin ./bin
COPY entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE $PORT

VOLUME ["/app/logs", "/app/public", "/app/data", "/app/bin", "/app/secret"]

CMD ["npm", "run", "prod"]

