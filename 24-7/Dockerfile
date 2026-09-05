FROM ghcr.io/home-assistant/base:latest

RUN apk add --no-cache \
    nodejs \
    npm \
    openjdk21-jre-headless

WORKDIR /app

COPY package.json /app/package.json
RUN npm install --omit=dev

COPY src/ /app/src/
COPY run.sh /run.sh

ENV NODE_ENV=production

RUN chmod +x /run.sh

CMD ["/run.sh"]
