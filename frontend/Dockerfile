FROM node:14.8.0-alpine3.10

WORKDIR /frontend

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 80
CMD [ "npm", "start" ]
