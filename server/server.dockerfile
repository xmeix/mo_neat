# Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY prisma ./prisma
RUN yarn prisma generate

#copy everything from our source folder into docker folder (container)
COPY . . 

EXPOSE 3002

CMD [ "yarn","dev" ]
