#!/usr/bin/with-contenv bashio

set -e

echo "Démarrage de Mineflayer..."

cd /app/src/

exec node 24-7.js
