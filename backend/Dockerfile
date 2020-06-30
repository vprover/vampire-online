# build: latest verison of vampire from the master branch
FROM gcc AS vampire_build
RUN git clone https://github.com/vprover/vampire.git
WORKDIR /vampire
RUN make vampire_rel

# production: pack server and vampire executables
FROM node:10
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY --from=vampire_build /vampire/vampire_rel* ./vampire-executables/vampire_latest
COPY . .
#RUN wget -P ./vampire-executables https://vprover.github.io/bin/vampire4.2.2

EXPOSE 8080
CMD [ "node", "./src/index.js"]