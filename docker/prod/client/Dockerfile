# Étape 1 : Construire l'application
FROM node:20-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY ./frontend/package.json ./frontend/package-lock.json ./

# Installer les dépendances
RUN npm ci

# Copier le reste du code source
COPY ./frontend .

# Construire l'application Next.js
RUN npm run build

# Étape 2 : Préparer l'image de production
FROM node:20-alpine AS production

# Définir le répertoire de travail
WORKDIR /app

# Installer uniquement les dépendances de production
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm ci --only=production

# Copier le dossier de build et les fichiers nécessaires depuis le builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/node_modules ./node_modules

# Exposer le port sur lequel l'application va tourner
EXPOSE 3001

# Démarrer l'application Next.js en mode production
CMD ["npm", "run", "start"]
