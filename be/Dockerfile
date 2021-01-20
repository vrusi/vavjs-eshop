FROM node:latest
COPY . app
WORKDIR /app
RUN npm install && npm install -g mocha

ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

EXPOSE 8000
ENV APP_PORT 8000
CMD ["npm", "run", "start-dev"]