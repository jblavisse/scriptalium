# Utiliser l'image Python comme base
FROM python:3.12-slim

# Définir le répertoire de travail
WORKDIR /app

# Installer les dépendances nécessaires pour l'installation des packages
RUN apt-get update && \
    apt-get install -y build-essential libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Copier les dépendances et installer avec pip sans cache
COPY ./backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste du projet
COPY ./backend .

# Créer un utilisateur non-root pour exécuter l'application
RUN useradd -m appuser && chown -R appuser /app
USER appuser

# Démarrer le serveur Django avec gunicorn en production
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "scriptalium.wsgi:application", "--workers", "3"]
