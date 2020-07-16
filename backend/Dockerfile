# build: latest verison of vampire from the master branch
FROM gcc AS vampire_build
RUN git clone https://github.com/vprover/vampire.git
RUN git clone https://github.com/Z3Prover/z3.git

WORKDIR /z3
RUN git checkout bba9d11fba618629c0c3953c3fbcbbe54b743e79
RUN mkdir -p /app/z3
RUN python scripts/mk_make.py --prefix=/app/z3 --staticlib
WORKDIR /z3/build
RUN make

WORKDIR /vampire
RUN mkdir ./include/
RUN cp -r /z3/build/* /vampire/include/
RUN make vampire_z3_rel_static

# production: pack server and vampire executables
FROM node:10
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY --from=vampire_build /vampire/vampire_z3_rel* ./vampire-executables/vampire_latest
COPY . .
# RUN wget -P ./vampire-executables https://vprover.github.io/bin/vampire4.2.2

EXPOSE 8080
CMD [ "node", "./src/index.js"]