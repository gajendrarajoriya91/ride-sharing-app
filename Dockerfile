FROM node:20

WORKDIR /app

COPY package*.json ./


RUN npm install


COPY . .

RUN npm run build

EXPOSE 10000


CMD ["sh", "-c", "npm run build; npm run start"]

