in order to test the server open the terminal and type:

1. yarn --> to install all package.json deps
2. create .env file and put the info for database
3. docker compose up
4. yarn prisma migrate dev --name init //take prisma schema and generate sql code ---> yarn prisma studio ( to see tables )

test using this postman collection:
postman collection: link here

FOR DEVS/
yarn prisma init
touch .dockerignore server.dockerfile ==> to create two dockerfiles with different names
to run container:

- docker compose build
  docker compose -p evento-admin-app up -d
  docker compose build && docker compose -p moneat-app up -d
- docker compose up -d backend
- docker ps -a [to check]
- docker exec -it moneat_db psql -U xmeix -d moneat-db [ to get into the database]
- docker exec -it moneat_server yarn prisma migrate dev --name init [ to create migration on backend service using docker] --> to check - \dt
  -docker logs moneat_server //in case of crash
  docker-compose down
  docker-compose build
  docker-compose up -d

docker exec -it moneat_server bash

docker exec -it moneat_db psql -U xmeix -d moneat-db

yarn add --dev prisma@latest │
│ yarn add @prisma/client@latest



docker cp ./prisma/schema.prisma moneat_server:/app/prisma/schema.prisma
npx prisma generate
npx prisma migrate dev --name v1.2

