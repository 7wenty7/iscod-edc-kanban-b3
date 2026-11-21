FROM node:20-alpine

WORKDIR /app

# pas besoin du MongoDB des tests dans l'image
ENV MONGOMS_DISABLE_POSTINSTALL=1

# on installe les dépendances
COPY package*.json ./
RUN npm ci

# on copie le code, on compile et on enlève les dépendances de dev
COPY . .
RUN npm run build && npm prune --omit=dev

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
