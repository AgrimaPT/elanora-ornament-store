# Ornament Store — Project Context

## Project Overview

I am building a portfolio-quality full-stack e-commerce web application for selling ornaments/jewellery.

The project is being developed using Django and Django REST Framework with an API-first architecture.

The development approach is:

* Backend-first development
* API-first architecture
* Django Templates for Phase 1 frontend
* React migration in Phase 2
* Reuse the same DRF APIs for React
* Learn concepts before using shortcuts
* Write clean, modular, production-quality code
* Test APIs using Postman
* Commit after completing features

The main goal is to build a project that I can confidently explain in technical interviews rather than simply copying tutorial code.

---

# Project Rules

* [x] Backend-first development
* [x] API-first architecture
* [x] Django Templates in Phase 1
* [x] React migration planned for Phase 2
* [x] Reuse the same DRF APIs for React
* [x] Learn concepts before using shortcuts
* [x] Write clean, modular code
* [x] Follow Django best practices
* [x] Test APIs using Postman
* [x] Commit after completed features

---

# Development Style

While building this project:

* [x] Explain every concept before coding
* [x] Avoid copying large code blocks without explanation
* [x] Explain why each file exists
* [x] Explain why a particular approach is chosen
* [x] Follow professional folder structure
* [x] Build production-quality code instead of tutorial code
* [x] Build features incrementally
* [x] Test each feature before moving forward
* [x] Keep backend and frontend responsibilities separated

---

# Tech Stack

## Backend

* Python
* Django
* Django REST Framework
* Simple JWT

## Frontend — Phase 1

* Django Templates
* HTML
* CSS
* Bootstrap 5
* JavaScript

## Frontend — Phase 2

* React
* Axios
* React Router

## Database

Development:

* SQLite

Production:

* PostgreSQL

## Deployment

* AWS EC2
* Gunicorn
* Nginx
* SSL / HTTPS

## Payments

* Razorpay

## Future AI

* AI Jewellery Shopping Assistant
* Natural Language Product Search
* Product Recommendations
* LLM/API integration

---

# Architecture

## Backend

```text
Client
   ↓
REST API
   ↓
Views
   ↓
Serializers
   ↓
Models
   ↓
Database
```

## Phase 1 Frontend

```text
Django Template
      ↓
JavaScript
      ↓
REST API
      ↓
Django REST Framework
      ↓
Database
```

## Phase 2 Frontend

```text
React
  ↓
Axios
  ↓
REST API
  ↓
Django REST Framework
  ↓
Database
```

---

# Project Structure

```text
ornament_store/

├── accounts/
├── cart/
├── config/
├── core/
├── orders/
├── products/
├── media/
├── static/
├── templates/
├── manage.py
├── requirements.txt
├── PROJECT_CONTEXT.md
├── PROJECT_ROADMAP.md
└── .gitignore
```

---

# Current Development Phase

## Phase 4 — Frontend UI

**Status: In Progress**

The backend foundations and core product module are already completed.

We are currently completing the main customer-facing frontend pages before moving into the Shopping Cart backend.

---

# Completed Work

## Project Setup

* [x] Django Project
* [x] Virtual Environment
* [x] Git Repository
* [x] Django Apps
* [x] Project Structure
* [x] Static Files
* [x] Media Configuration
* [x] Templates Setup

---

# Authentication

## Custom User

* [x] Custom User Model
* [x] Custom User Admin
* [x] Email as Primary Login Field
* [x] Username Generated Internally
* [x] `AUTH_USER_MODEL` Configuration
* [x] Database Migration

## Registration

* [x] Register Serializer
* [x] Register API
* [x] Password Hashing
* [x] Custom Validation
* [x] User List API

## JWT Authentication

* [x] Simple JWT Installation
* [x] JWT Configuration
* [x] JWT Testing
* [x] Login Serializer
* [x] Login API
* [x] Access Token
* [x] Refresh Token
* [x] Refresh Token API
* [x] JWT Blacklisting
* [x] Logout API

## Profile

* [x] Profile API
* [x] Update Profile API
* [x] Change Password API

## Remaining Authentication

* [ ] Forgot Password
* [ ] Email Verification

---

# Product Module

## Models

* [x] Category Model
* [x] Product Model
* [x] Product Image Model
* [x] Product Variant Model
* [x] Product Inventory Model

## Admin

* [x] Category Admin
* [x] Product Admin
* [x] Product Image Inline
* [x] Product Variant Admin
* [x] Inventory Admin

## APIs

* [x] Category API
* [x] Product List API
* [x] Product Detail API
* [x] Product Variant API
* [x] Inventory API

## Product Features

* [x] Product Search
* [x] Category Filtering
* [x] Minimum Price Filtering
* [x] Maximum Price Filtering
* [x] Combined Filtering
* [x] Filter Validation
* [x] Product Sorting
* [x] Pagination
* [x] Page Number Pagination
* [x] Search + Pagination
* [x] Filters + Pagination
* [x] API Testing

---

# Current Frontend Progress

## Home

* [x] Home Page
* [x] Home Styling

## Shop

* [x] Shop Page
* [x] Dynamic Product Loading
* [x] Dynamic Categories
* [x] Category Filtering
* [x] Product Search
* [x] Price Filtering
* [x] Product Sorting
* [x] Dynamic Product Count
* [x] Empty Product State
* [x] Clear All Filters
* [x] Responsive Layout
* [x] Product Card Styling

## Product Details

* [x] Product Detail Route
* [x] Product Detail Template
* [x] Product API Integration
* [x] Dynamic Product Information
* [x] Product Image Gallery
* [x] Image Thumbnails
* [x] Thumbnail Switching
* [x] Responsive Product Layout
* [x] Quantity Selector
* [x] Stock-Based Quantity Limit
* [x] Out-of-Stock State
* [x] Product Not Found State
* [x] Luxury Product Styling

## Register

* [x] Register Page
* [x] Register Form
* [x] Register API Integration

---

# Current Frontend Tasks

These are the remaining major frontend pages:

* [ ] About Page
* [ ] Contact Page
* [ ] Login Page
* [ ] Profile Page
* [ ] Orders Page
* [ ] Cart Page
* [ ] Checkout Page
* [ ] Error Pages

The immediate next task is:

* [ ] About Page

---

# Important Product Detail Decision

The Product Detail page currently has an **Add to Cart** button as UI only.

It should **not** be connected to a real cart API yet because the Cart backend has not been implemented.

Current flow:

```text
Product Detail
      ↓
Add to Cart Button
      ↓
UI Only
```

After Cart backend is implemented:

```text
Product Detail
      ↓
Add to Cart
      ↓
Cart API
      ↓
Cart
      ↓
Cart Item
```

---

# Shopping Cart

**Status: Not Started**

The `cart` Django app exists, but the Cart feature itself has not yet been implemented.

## Backend

* [ ] Cart Model
* [ ] Cart Item Model
* [ ] Cart Relationships
* [ ] Cart Validation
* [ ] Cart Price Handling

## APIs

* [ ] Add to Cart
* [ ] View Cart
* [ ] Update Quantity
* [ ] Remove Item
* [ ] Cart Summary
* [ ] Cart Total

## Frontend

* [ ] Cart Page
* [ ] Cart Item Display
* [ ] Quantity Controls
* [ ] Remove Item
* [ ] Cart Summary
* [ ] Empty Cart State
* [ ] Product Detail → Cart Integration

---

# Git Workflow

Every feature follows this workflow:

```text
Plan
  ↓
Understand the Concept
  ↓
Implement
  ↓
Test
  ↓
Fix Issues
  ↓
Git Commit
  ↓
Update PROJECT_ROADMAP.md
  ↓
Update PROJECT_CONTEXT.md if necessary
```

---

# Architecture Decisions

## Authentication

* [x] Email is the primary login field
* [x] Username is generated internally
* [x] Passwords are always hashed
* [x] JWT authentication is used
* [x] Access and refresh tokens are used
* [x] JWT blacklisting is used for logout
* [x] React will consume the same authentication APIs later

## Frontend

### Phase 1

```text
Django Templates
+
HTML
+
CSS
+
Bootstrap
+
JavaScript
```

### Phase 2

```text
React
+
Axios
+
React Router
```

The Django REST APIs should remain reusable during the React migration.

## Database

### Development

```text
SQLite
```

### Production

```text
PostgreSQL
```

## Deployment

```text
AWS EC2
   ↓
Nginx
   ↓
Gunicorn
   ↓
Django
```

---

# Important API Endpoints

## Authentication

```text
POST /api/auth/register/
POST /api/auth/login/
POST /api/token/refresh/
POST /api/auth/logout/
GET  /api/auth/users/
GET  /api/auth/profile/
PUT  /api/auth/profile/
PUT  /api/auth/change-password/
```

Remaining:

```text
Forgot Password API
Email Verification API
```

## Products

```text
GET /api/products/
GET /api/products/{slug}/
GET /api/products/categories/
GET /api/products/{product_id}/variants/
GET /api/products/{pk}/inventory/
```

---

# Important Development Notes

## Product Detail API

The Product Detail API uses the product slug:

```text
/api/products/{slug}/
```

Example:

```text
/api/products/gold-rings/
```

The frontend product detail URL also uses the slug:

```text
/product/<slug>/
```

Example:

```text
/product/gold-rings/
```

---

# Frontend Data Flow

## Shop

```text
Shop Template
      ↓
JavaScript
      ↓
GET /api/products/
      ↓
DRF
      ↓
Product Serializer
      ↓
Product Model
      ↓
Database
      ↓
JSON
      ↓
JavaScript
      ↓
Product Cards
```

## Product Details

```text
/product/<slug>/
      ↓
Django View
      ↓
Product Detail Template
      ↓
JavaScript
      ↓
GET /api/products/<slug>/
      ↓
DRF
      ↓
Product Detail Serializer
      ↓
Database
      ↓
JSON
      ↓
Product Detail UI
```

---

# Known Current Issues / Pending Improvements

* [ ] Connect Shop product cards to Product Detail URLs
* [ ] Implement About page
* [ ] Implement Contact page
* [ ] Implement Login page
* [ ] Implement Profile page
* [ ] Implement Orders page
* [ ] Implement Error pages
* [ ] Implement Shopping Cart backend
* [ ] Connect Product Detail Add to Cart button after Cart API exists

---

# Future Development Order

```text
Current
   ↓
About
   ↓
Contact
   ↓
Login
   ↓
Profile
   ↓
Orders
   ↓
Error Pages
   ↓
Shopping Cart
   ↓
Checkout
   ↓
Orders Backend
   ↓
Razorpay
   ↓
AI Jewellery Assistant
   ↓
Natural Language Search
   ↓
Admin Dashboard
   ↓
Deployment
   ↓
React Migration
   ↓
Production Improvements
```

---

# Long-Term Goal

The final application should demonstrate:

* [x] Django fundamentals
* [x] Django REST Framework
* [x] Custom authentication
* [x] JWT authentication
* [x] Database relationships
* [x] Product management
* [x] Search
* [x] Filtering
* [x] Sorting
* [x] Pagination
* [x] Django Templates
* [x] JavaScript API integration
* [ ] Shopping Cart
* [ ] Checkout
* [ ] Order Management
* [ ] Payment Integration
* [ ] AI Integration
* [ ] Natural Language Search
* [ ] Admin Dashboard
* [ ] AWS Deployment
* [ ] React Migration

---

# Main Learning Goal

I do not want to simply finish the project.

I want to understand **why the code works**, why a particular architecture is chosen, how Django and DRF work internally, and how the different parts of an e-commerce application communicate with each other.

The project should therefore be built incrementally and explained like a professional development project rather than a copy-paste tutorial.

---

# Current Position

```text
Project Setup          ✅
Authentication         🟢 Core Completed
Product Module         🟢 Core Completed
Frontend UI             🟡 CURRENT
Shopping Cart           ⏳
Checkout                ⏳
Orders                  ⏳
Payments                ⏳
AI Integration          ⏳
Admin Dashboard         ⏳
Deployment              ⏳
React Migration         ⏳
Production Improvements ⏳
```

## Immediate Next Task

* [ ] Build About Page

```

### One thing to change from your old context

Your old document says:

> **Current Feature: Building Custom Login API**

That should definitely be removed. We're **far beyond that point now**.

Your two files should now have different jobs:

- **`PROJECT_CONTEXT.md`** → explains the project's architecture, decisions, current state, and important development context.
- **`PROJECT_ROADMAP.md`** → tracks the complete feature-by-feature checklist.

That separation will make it much easier for us to continue the project without the context file becoming messy.
```



"We're continuing my Ornament Store project. Here's my PROJECT_CONTEXT.md and PROJECT_ROADMAP.md. Continue exactly from where we left off."


One thing I can promise

From the conversations we've had, I understand your broader goal:

You're aiming to become job-ready as a Python/Django developer.
You want to understand concepts deeply, not just copy code.
You want to build a portfolio-quality e-commerce project that you can confidently explain in interviews.
You plan to start with Django templates and later migrate the frontend to React while keeping the same DRF APIs.