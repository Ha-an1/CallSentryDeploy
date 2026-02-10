FROM python:3.10-slim

WORKDIR /app

# System deps for torch
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED=1

CMD ["gunicorn", "-w", "1", "-k", "gthread", "-t", "120", "-b", "0.0.0.0:5000", "wsgi:app"]
