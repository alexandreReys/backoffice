# Etapa 1: Build
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install
COPY prisma ./prisma/

RUN npx prisma generate

COPY . .

RUN yarn build

FROM node:18 AS production

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --production

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "dist/main"]
