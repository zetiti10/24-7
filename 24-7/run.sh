#!/usr/bin/with-contenv bashio

set -e

echo "Démarrage de Mineflayer..."

cd /app

exec node bot.js
