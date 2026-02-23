# E-Commerce Platform - Complete Manual

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture](#3-architecture)
4. [Installation & Setup](#4-installation--setup)
5. [API Documentation](#5-api-documentation)
6. [Frontend Components](#6-frontend-components)
7. [Database Schema](#7-database-schema)
8. [Search Functionality](#8-search-functionality)
9. [Authentication Flow](#9-authentication-flow)
10. [Common Issues & Solutions](#10-common-issues--solutions)

---

## 1. Project Overview

This is a full-stack e-commerce platform with user authentication, product catalog, and Elasticsearch-powered search functionality.

### Features
- User Registration & Login (JWT-based authentication)
- Product Catalog with Categories
- Elasticsearch-powered Search with filters
- User Profile Management
- Password Change Functionality
- Protected Routes

---

## 2. Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Django | 4.2.x | Web framework |
| Django REST Framework | 3.14+ | API development |
| djangorestframework-simplejwt | 5.3+ | JWT authentication |
| MySQL | 8.0 | Database |
| Elasticsearch | 8.12.0 | Search engine |
| django-elasticsearch-dsl | 7.3+ | Elasticsearch integration |
| django-cors-headers | 4.3+ | CORS handling |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 16.14.0 | UI library |
| React Router DOM | 5.3.4 | Routing |
| Axios | 1.13.5 | HTTP client |
| React Bootstrap | 2.10.10 | UI components |
| Webpack | 4.47.0 | Module bundler |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                               │
│                   (React Frontend)                          │
│                      Port: 3000                             │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP Requests
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                       BACKEND                               │
│                  (Django REST API)                          │
│                      Port: 8000                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Auth Views  │  │ Search Views │  │    Models    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────┬───────────────────────────────┬─────────────────┘
            │                               │
            ▼                               ▼
┌──────────────────────┐      ┌──────────────────────────┐
│       MySQL          │      │    Elasticsearch         │
│   Port: 3307         │      │    Port: 9201            │
│   Database:          │      │    Indices:              │
│   ecommerce_project  │      │    - categories          │
└──────────────────────┘      │    - products            │
                              └──────────────────────────┘
```

---

## 4. Installation & Setup

### Prerequisites
- Docker & Docker Compose installed
- Git (optional)

### Step 1: Clone/Navigate to Project
```bash
cd /home/dell/Music/ecommerce
```

### Step 2: Start All Services
```bash
docker-compose up -d
```

### Step 3: Run Database Migrations
```bash
# Django auth migrations
docker exec -it ecommerce_backend python manage.py migrate

# Create app migrations
docker exec -it ecommerce_backend python manage.py makemigrations authentication

# Apply app migrations
docker exec -it ecommerce_backend python manage.py migrate
```

### Step 4: Import Sample Data
```bash
docker exec -it ecommerce_backend python import_data.py
```

### Step 5: Index Data in Elasticsearch
```bash
docker exec -it ecommerce_backend python manage.py index_elasticsearch
```

### Access Points
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Django Admin | http://localhost:8000/admin/ |
| Elasticsearch | http://localhost:9201 |

---

## 5. API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register/
Content-Type: application/json

{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "password2": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe"
}
```

**Response:**
```json
{
    "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "date_joined": "2026-02-23T10:07:56.205491Z"
    },
    "refresh": "eyJhbGciOiJIUzI1NiIs...",
    "access": "eyJhbGciOiJIUzI1NiIs...",
    "message": "User registered successfully"
}
```

#### Login
```http
POST /api/auth/login/
Content-Type: application/json

{
    "username": "johndoe",
    "password": "SecurePass123!"
}
```

**Response:**
```json
{
    "user": { ... },
    "refresh": "eyJhbGciOiJIUzI1NiIs...",
    "access": "eyJhbGciOiJIUzI1NiIs...",
    "message": "Login successful"
}
```

#### Logout
```http
POST /api/auth/logout/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "refresh": "<refresh_token>"
}
```

#### Get Profile
```http
GET /api/auth/profile/
Authorization: Bearer <access_token>
```

#### Update Profile
```http
PUT /api/auth/profile/update/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "first_name": "John",
    "last_name": "Smith",
    "email": "john.smith@example.com"
}
```

#### Change Password
```http
POST /api/auth/change-password/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "old_password": "OldPass123!",
    "new_password": "NewPass123!",
    "new_password2": "NewPass123!"
}
```

### Search Endpoints

#### Search Products & Categories
```http
GET /api/auth/search/?q=laptop&min_price=100&max_price=1000
Authorization: Bearer <access_token>
```

**Response:**
```json
{
    "categories": [
        {
            "id": 1,
            "name": "Electronics",
            "description": "Latest gadgets...",
            "image": "https://...",
            "score": 2.0384378
        }
    ],
    "products": [
        {
            "id": 4,
            "name": "Gaming Laptop RTX 4070",
            "description": "High-performance gaming...",
            "price": 1299.99,
            "image": "https://...",
            "category_id": 1,
            "category_name": "Electronics",
            "score": 12.6360035
        }
    ],
    "total": 3
}
```

#### Search Suggestions
```http
GET /api/auth/search/suggestions/?q=lap
Authorization: Bearer <access_token>
```

**Response:**
```json
{
    "suggestions": [
        {
            "type": "category",
            "id": 1,
            "name": "Laptops",
            "description": "..."
        },
        {
            "type": "product",
            "id": 4,
            "name": "Gaming Laptop RTX 4070",
            "category": "Electronics",
            "price": 1299.99
        }
    ]
}
```

### Token Refresh
```http
POST /api/auth/refresh/
Content-Type: application/json

{
    "refresh": "<refresh_token>"
}
```

---

## 6. Frontend Components

### Component Structure
```
src/
├── components/
│   ├── CategoryProducts.js    # Display products by category
│   ├── Dashboard.js           # User dashboard
│   ├── EcommerceNav.js        # Navigation bar
│   ├── HomePage.js            # Landing page
│   ├── Login.js               # Login form
│   ├── Navigation.js          # Navigation wrapper
│   ├── PrivateRoute.js        # Protected route component
│   ├── Products.js            # Product listing
│   ├── Register.js            # Registration form
│   └── SearchResults.js       # Search results display
├── context/
│   └── AuthContext.js         # Authentication context
├── services/
│   └── api.js                 # API service layer
├── App.js                     # Main app component
└── index.js                   # Entry point
```

### Authentication Context
The `AuthContext` provides:
- `user` - Current user object
- `login(credentials)` - Login function
- `register(userData)` - Registration function
- `logout()` - Logout function
- `updateUser(user)` - Update user data
- `isAuthenticated` - Boolean auth state

### API Service Layer
The `api.js` service provides:
- Automatic JWT token attachment
- Automatic token refresh on 401 errors
- Methods: `register`, `login`, `logout`, `getProfile`, `updateProfile`, `changePassword`

---

## 7. Database Schema

### User Table (Django Auth)
| Field | Type | Description |
|-------|------|-------------|
| id | INT (PK) | Auto-increment ID |
| username | VARCHAR(150) | Unique username |
| email | VARCHAR(254) | Unique email |
| password | VARCHAR(128) | Hashed password |
| first_name | VARCHAR(150) | First name |
| last_name | VARCHAR(150) | Last name |
| is_active | BOOLEAN | Account status |
| date_joined | DATETIME | Registration date |

### Categories Table
| Field | Type | Description |
|-------|------|-------------|
| category_id | INT (PK) | Auto-increment ID |
| category_name | VARCHAR(100) | Category name |
| description | TEXT | Category description |
| image | VARCHAR(500) | Image URL |
| inserted_date | DATETIME | Creation date |

### Products Table
| Field | Type | Description |
|-------|------|-------------|
| product_id | INT (PK) | Auto-increment ID |
| product_name | VARCHAR(200) | Product name |
| category_id | INT (FK) | Reference to categories |
| description | TEXT | Product description |
| image | VARCHAR(500) | Image URL |
| price | DECIMAL(10,2) | Product price |
| inserted_date | DATETIME | Creation date |

---

## 8. Search Functionality

### Elasticsearch Indices

#### Categories Index
```json
{
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0
    },
    "mappings": {
        "properties": {
            "category_id": { "type": "integer" },
            "category_name": { "type": "text" },
            "description": { "type": "text" },
            "image": { "type": "keyword" },
            "inserted_date": { "type": "date" }
        }
    }
}
```

#### Products Index
```json
{
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0
    },
    "mappings": {
        "properties": {
            "product_id": { "type": "integer" },
            "product_name": { "type": "text" },
            "description": { "type": "text" },
            "price": { "type": "float" },
            "category_id": { "type": "integer" },
            "category_name": { "type": "text" },
            "image": { "type": "keyword" }
        }
    }
}
```

### Search Features
1. **Full-text search** - Search in product names, descriptions, and category names
2. **Fuzzy matching** - Handles typos with AUTO fuzziness
3. **Price filtering** - Filter by price range
4. **Natural language price queries**:
   - "laptop under 1000"
   - "phone above 500"
   - "watch 100-500"
5. **Search suggestions** - Auto-complete functionality

---

## 9. Authentication Flow

### JWT Token Flow
```
┌─────────┐                                    ┌─────────┐
│  Client │ ─────── Register/Login ───────────▶│ Backend │
└─────────┘                                    └────┬────┘
     │                                               │
     │◀────────── Access + Refresh Tokens ──────────┤
     │                                               │
     │────── API Request (with Access Token) ───────▶│
     │                                               │
     │◀────────────── Protected Data ───────────────┤
     │                                               │
     │────── Request (Expired Token) ───────────────▶│
     │                                               │
     │◀────────────── 401 Unauthorized ─────────────┤
     │                                               │
     │──────── Refresh Token Request ───────────────▶│
     │                                               │
     │◀────────── New Access Token ─────────────────┤
     │                                               │
     │────── Retry Original Request ────────────────▶│
     │                                               │
     │◀────────────── Protected Data ───────────────┤
```

### Token Lifetimes
- **Access Token**: 60 minutes
- **Refresh Token**: 1 day

---

## 10. Common Issues & Solutions

### Issue 1: Database Tables Don't Exist
**Error:** `Table 'ecommerce_project.auth_user' doesn't exist`

**Solution:**
```bash
docker exec -it ecommerce_backend python manage.py migrate
docker exec -it ecommerce_backend python manage.py makemigrations authentication
docker exec -it ecommerce_backend python manage.py migrate
```

### Issue 2: Search Returns Empty Results
**Error:** "Failed to perform search"

**Solution:**
```bash
# Index data in Elasticsearch
docker exec -it ecommerce_backend python manage.py index_elasticsearch
```

### Issue 3: CORS Errors
**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:** Check `CORS_ALLOWED_ORIGINS` in `settings.py` includes your frontend URL.

### Issue 4: Elasticsearch Connection Failed
**Solution:**
```bash
# Check Elasticsearch status
curl http://localhost:9201/_cluster/health

# Restart if needed
docker-compose restart elasticsearch
```

### Issue 5: Container Won't Start
**Solution:**
```bash
# Rebuild containers
docker-compose down
docker-compose up -d --build
```

---

## Quick Reference Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Backend shell
docker exec -it ecommerce_backend bash

# Database shell
docker exec -it ecommerce_db mysql -u root -p

# Rebuild containers
docker-compose up -d --build

# Run migrations
docker exec -it ecommerce_backend python manage.py migrate

# Create superuser
docker exec -it ecommerce_backend python manage.py createsuperuser

# Index Elasticsearch
docker exec -it ecommerce_backend python manage.py index_elasticsearch

# Import data
docker exec -it ecommerce_backend python import_data.py
```

---

## Environment Variables

### Backend (.env)
```bash
DB_NAME=ecommerce_project
DB_USER=root
DB_PASSWORD=Root@123
DB_HOST=localhost
DB_PORT=3306
SECRET_KEY=django-insecure-...
DEBUG=True
ELASTICSEARCH_HOST=http://localhost:9201
```

### Docker Compose Environment
| Variable | Value | Description |
|----------|-------|-------------|
| DB_HOST | db | MySQL service name |
| DB_PORT | 3306 | MySQL internal port |
| ELASTICSEARCH_HOST | http://elasticsearch:9200 | ES service URL |

---

## File Structure

```
ecommerce/
├── backend/
│   ├── auth_project/          # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── authentication/        # Main Django app
│   │   ├── models.py          # User, Category, Product models
│   │   ├── views.py           # Auth API views
│   │   ├── search_views.py    # Search API views
│   │   ├── serializers.py     # DRF serializers
│   │   ├── documents.py       # Elasticsearch documents
│   │   ├── urls.py            # App URL routes
│   │   └── management/
│   │       └── commands/
│   │           └── index_elasticsearch.py
│   ├── import_data.py         # Data import script
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/           # Auth context
│   │   ├── services/          # API services
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml         # Docker orchestration
└── MANUAL.md                  # This document
```

---

**Last Updated:** February 23, 2026
**Version:** 1.0
