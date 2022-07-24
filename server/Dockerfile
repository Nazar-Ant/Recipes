FROM node

WORKDIR /server

COPY package*.json .

RUN npm install
RUN npm install nodemon --global

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]
