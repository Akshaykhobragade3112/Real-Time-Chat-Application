#!/bin/sh
set -e

# wait for dependent services (optional, simple sleep or use wait-for-it)
# sleep 1

# apply database migrations
echo "Running migrations..."
python manage.py migrate --noinput

# collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# create superuser? (optionally use env var to auto create)

# start daphne
echo "Starting Daphne..."
daphne -b 0.0.0.0 -p 8000 chat_backend.asgi:application
