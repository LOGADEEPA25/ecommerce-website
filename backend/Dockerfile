# ── Backend Dockerfile ──────────────────────────────────────────────
FROM python:3.11-slim

# System dependencies required by mysqlclient
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps first (layer-caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project source
COPY . .

EXPOSE 8000

# Run dev server (swap for gunicorn in production)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
