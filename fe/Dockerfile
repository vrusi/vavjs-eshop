FROM node:latest
WORKDIR /app
COPY package*.json ./
ENV NODE_ENV development
RUN npm install
RUN npm install -g @vue/cli
COPY . app
EXPOSE 8080
CMD ["npm", "run", "serve"]