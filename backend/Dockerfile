FROM node:10

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY . .
#RUN wget -P ./vampire-executables https://vprover.github.io/bin/vampire4.2.2

EXPOSE 8080
CMD [ "node", "./src/index.js"]