#!/bin/bash
VERSION=${1:-"latest"}

docker login -u vladene -p vampire

docker build --tag vladene/vampire-frontend:$VERSION ./frontend
docker push vladene/vampire-frontend:$VERSION

docker build --tag vladene/vampire-backend:$VERSION ./backend
docker push vladene/vampire-backend:$VERSION

scp ./docker-compose.yml vampire@130.88.192.143:~/vampire-online

ssh vampire@130.88.192.143 << EOF
  cd ~/vampire-online
  export VAMPIRE_VERSION=$VERSION
  docker-compose down --rmi all
  docker-compose up -d
  exit
EOF
