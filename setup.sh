#!/bin/bash

# E-Commerce Platform Automated Setup Script
# This script automates database migrations, data import, and Elasticsearch indexing

set -e  # Exit on any error

echo "=========================================="
echo "  E-Commerce Platform Setup Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if containers are running
if ! docker ps | grep -q "ecommerce_backend"; then
    print_warning "Backend container not running. Starting Docker Compose..."
    docker-compose up -d
    
    # Wait for containers to be ready
    print_info "Waiting for containers to start..."
    sleep 10
fi

# Function to wait for MySQL to be ready
wait_for_mysql() {
    print_info "Waiting for MySQL to be ready..."
    for i in {1..30}; do
        if docker exec ecommerce_db mysqladmin ping -h localhost --silent 2>/dev/null; then
            print_info "MySQL is ready!"
            return 0
        fi
        echo -n "."
        sleep 2
    done
    print_error "MySQL did not become ready in time"
    return 1
}

# Function to wait for Elasticsearch to be ready
wait_for_elasticsearch() {
    print_info "Waiting for Elasticsearch to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:9201/_cluster/health | grep -q "status"; then
            print_info "Elasticsearch is ready!"
            return 0
        fi
        echo -n "."
        sleep 2
    done
    print_error "Elasticsearch did not become ready in time"
    return 1
}

# Wait for services
wait_for_mysql
wait_for_elasticsearch

echo ""
print_info "Running Django migrations..."
docker exec -it ecommerce_backend python manage.py migrate

echo ""
print_info "Creating app migrations..."
docker exec -it ecommerce_backend python manage.py makemigrations authentication

echo ""
print_info "Applying app migrations..."
docker exec -it ecommerce_backend python manage.py migrate

echo ""
print_info "Importing sample data..."
docker exec -it ecommerce_backend python import_data.py

echo ""
print_info "Indexing data in Elasticsearch..."
docker exec -it ecommerce_backend python manage.py index_elasticsearch

echo ""
print_info "Creating superuser (optional)..."
read -p "Do you want to create a superuser? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker exec -it ecommerce_backend python manage.py createsuperuser
fi

echo ""
echo "=========================================="
print_info "Setup completed successfully!"
echo "=========================================="
echo ""
echo "Your application is ready:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  Admin:    http://localhost:8000/admin"
echo ""
