FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install


COPY . .

# Generate the Prisma client
RUN npx prisma generate


ENTRYPOINT [ "node", "server.js" ]