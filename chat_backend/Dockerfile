# chat_backend/Dockerfile
FROM mirror.gcr.io/library/python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /code

# system deps for some python packages (adjust if you need libpq-dev for Postgres)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libffi-dev \
    wget \
  && rm -rf /var/lib/apt/lists/*

# copy requirement file and install
COPY ./requirements.txt /code/requirements.txt
RUN pip install --upgrade pip
RUN pip install -r /code/requirements.txt

# copy project
COPY . /code/

# entrypoint
COPY ./entrypoint.sh /code/entrypoint.sh
RUN chmod +x /code/entrypoint.sh

# expose daphne port
EXPOSE 8000

CMD ["/code/entrypoint.sh"]
