# Ornament Store

## Project Overview

A full-stack e-commerce web application for selling ornaments.

The project follows an API-first architecture using Django and Django REST Framework (DRF). During Phase 1, the frontend will be built with Django Templates, HTML, CSS, Bootstrap, and JavaScript. In a later phase, the frontend will be migrated to React while reusing the same REST APIs.

The project is being developed following professional software engineering practices including Git version control, modular application architecture, API testing with Postman, clean code principles, incremental feature development, and learning concepts before using shortcuts.

---

# Project Objectives

* Build a production-style e-commerce application
* Learn professional Django architecture
* Master Django REST Framework
* Learn JWT Authentication
* Build reusable REST APIs
* Integrate Razorpay payment gateway
* Deploy on AWS with Nginx and Gunicorn
* Build an AI-powered jewellery shopping assistant
* Implement natural-language product search
* Replace the Django frontend with React without changing the backend APIs

---

# Tech Stack

## Backend

* Python 3.11+
* Django 5
* Django REST Framework
* Simple JWT

## Frontend — Phase 1

* HTML5
* CSS3
* Bootstrap 5
* JavaScript (ES6)
* Django Templates

## Frontend — Phase 2

* React
* Axios
* React Router

## Database

### Development

* SQLite

### Production

* PostgreSQL

## Storage

* Local Media
* AWS S3 — Future

## Deployment

* AWS EC2
* Gunicorn
* Nginx
* SSL — Let's Encrypt

## Payments

* Razorpay

## Version Control

* Git
* GitHub

## API Testing

* Postman

## AI — Future Phase

* AI Jewellery Shopping Assistant
* Natural Language Product Search
* Product Recommendation Logic
* LLM/API integration

---

# Folder Structure

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
├── PROJECT_ROADMAP.md
└── .gitignore
```

---

# Project Architecture

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

For Phase 1 frontend pages:

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

For the future React frontend:

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

# Development Phases

## Phase 1 — Project Setup

**Status: ✅ Completed**

### Tasks

* [x] Django Project
* [x] Git
* [x] Virtual Environment
* [x] Django Apps
* [x] Folder Structure
* [x] Static Files
* [x] Templates
* [x] Media Configuration

---

# Phase 2 — Authentication

**Status: 🟢 Core Authentication Completed**

## Custom User

* [x] Custom User Model
* [x] Custom User Admin
* [x] Email Login Design
* [x] AUTH_USER_MODEL Configuration
* [x] Database Migration

## Registration

* [x] Register Serializer
* [x] Register API
* [x] Password Hashing
* [x] Custom Validation
* [x] Register Frontend

## JWT Authentication

* [x] JWT Configuration
* [x] JWT Testing
* [x] Login Serializer
* [x] Login API
* [x] Login Frontend
* [x] Access Token
* [x] Refresh Token
* [x] Refresh Access Token
* [x] JWT Blacklist Setup
* [x] Logout API
* [x] Logout Frontend
* [ ] Automatic Access Token Refresh

## Profile

* [x] Profile API
* [x] Profile Frontend
* [x] Display User Information
* [x] Update Profile API
* [x] Edit Profile UI
* [x] Change Password API
* [x] Change Password UI
* [x] Logout

## Remaining Authentication

* [ ] Forgot Password
* [ ] Email Verification

---

# Phase 3 — Product Module

**Status: 🟢 Core Product Module Completed**

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
* [x] Search API
* [x] Product Ordering / Sorting
* [x] Product Variant API
* [x] Inventory API

## Filtering

* [x] Category Filtering
* [x] Minimum Price Filtering
* [x] Maximum Price Filtering
* [x] Combined Filtering
* [x] Filter Validation

## Pagination

* [x] Product Pagination
* [x] Page Number Pagination
* [x] Pagination + Search
* [x] Pagination + Filters
* [x] Pagination Testing

---

# Phase 4 — Frontend UI

**Status: 🟡 In Progress**

## Completed Pages

* [x] Home
* [x] Shop
* [x] Product Details
* [x] About
* [x] Login
* [x] Register
* [x] Profile
* [x] Contact
* [x] Error Pages

## Remaining Pages

* [ ] Orders
* [x] Cart
* [ ] Checkout


## Frontend Features Completed

### Shop

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

### Product Details

* [x] Dynamic Product Loading
* [x] Product Information
* [x] Product Image Gallery
* [x] Image Thumbnails
* [x] Thumbnail Switching
* [x] Responsive Product Layout
* [x] Quantity Selector
* [x] Stock-Based Quantity Limit
* [x] Out-of-Stock State
* [x] Product Not Found State
* [x] Luxury Product Styling

### Authentication UI

* [x] Login Page
* [x] Register Page
* [x] Profile Page
* [x] Edit Profile
* [x] Change Password
* [x] Logout
* [x] Automatic JWT Token Refresh

---

# Phase 5 — Shopping Cart

**Status: 🟡 Backend Completed — Frontend Pending**

## Backend

* [x] Cart Model
* [x] Cart Item Model
* [x] Cart Relationships
* [x] Cart Validation
* [x] Cart Price Handling
* [x] Cart Admin
* [x] CartItem Serializer
* [x] Cart Serializer
* [x] Add to Cart API
* [x] View Cart API
* [x] Update Quantity API
* [x] Remove Item API
* [x] Clear Cart API
* [x] JWT Authentication
* [x] Stock Validation
* [x] User Ownership Protection
* [x] Postman Testing

## APIs

* [x] `GET /api/cart/`
* [x] `POST /api/cart/add/`
* [x] `PATCH /api/cart/items/{item_id}/`
* [x] `DELETE /api/cart/items/{item_id}/`
* [x] `DELETE /api/cart/`

## Frontend

* [x] Cart Page
* [x] Cart Item Display
* [x] Quantity Controls
* [x] Remove Item
* [x] Cart Summary
* [x] Empty Cart State
* [x] Product Detail → Cart Integration
* [ ] Cart API Integration

---

# Phase 6 — Checkout

**Status: ⏳ Not Started**

* [x] Address Model
* [x] Address CRUD
* [x] Address Ownership Protection
* [x] Default Address Logic
* [ ] Shipping Information
* [ ] Order Summary
* [ ] Checkout Page
* [ ] Address Selection
* [ ] Checkout Validation

---

# Phase 7 — Orders

**Status: ⏳ Not Started**

## Models

* [ ] Order
* [ ] Order Item

## APIs

* [ ] Place Order
* [ ] Order History
* [ ] Order Detail
* [ ] Cancel Order
* [ ] Order Tracking

## Frontend

* [ ] Orders Page
* [ ] Order Detail Page
* [ ] Order Status
* [ ] Cancel Order UI
* [ ] Order Tracking UI

## Admin

* [ ] Order Management
* [ ] Order Status Management
* [ ] Customer Order Details

---

# Phase 8 — Payments

**Status: ⏳ Not Started**

## Razorpay

* [ ] Razorpay Integration
* [ ] Create Payment Order
* [ ] Payment Verification
* [ ] Payment Model
* [ ] Payment Success
* [ ] Payment Failure
* [ ] Payment Webhook Handling

---

# Phase 9 — AI Jewellery Assistant

**Status: ⏳ Planned**

## AI Shopping Assistant

* [ ] Define AI Assistant Architecture
* [ ] Product Context Preparation
* [ ] AI API Integration
* [ ] Jewellery Recommendation Logic
* [ ] User Preference Understanding
* [ ] Budget-Based Recommendations
* [ ] Occasion-Based Recommendations
* [ ] Jewellery Type Recommendations
* [ ] Conversation Context

## Natural Language Search

* [ ] Natural Language Search Architecture
* [ ] Query Understanding
* [ ] Product Attribute Extraction
* [ ] Category Detection
* [ ] Price/Budget Detection
* [ ] Jewellery Type Detection
* [ ] Search Result Ranking
* [ ] AI Search API
* [ ] Search UI

## Example Queries

```text
"Show me gold rings under ₹20,000"

"I need a simple necklace for a wedding"

"Find something elegant for everyday wear"

"Show me earrings under ₹5,000"
```

## AI Frontend

* [ ] AI Assistant UI
* [ ] Chat Interface
* [ ] Suggested Queries
* [ ] Natural Language Search Box
* [ ] AI Product Recommendations
* [ ] Product Result Cards

---

# Phase 10 — Admin Dashboard

**Status: ⏳ Not Started**

* [ ] Dashboard
* [ ] Analytics
* [ ] Customers
* [ ] Orders
* [ ] Sales
* [ ] Products
* [ ] Inventory
* [ ] Low Stock Alerts
* [ ] Revenue Summary

---

# Phase 11 — Deployment

**Status: ⏳ Not Started**

## Database

* [ ] PostgreSQL
* [ ] Production Database Configuration

## Environment

* [ ] Environment Variables
* [ ] Secret Key Configuration
* [ ] Production Settings

## Server

* [ ] Gunicorn
* [ ] Nginx
* [ ] AWS EC2

## Domain

* [ ] Domain Configuration
* [ ] SSL
* [ ] HTTPS

## Production

* [ ] Static Files
* [ ] Media Files
* [ ] Production Testing
* [ ] Error Monitoring
* [ ] Security Configuration

---

# Phase 12 — AI → React Preparation

**Status: ⏳ Planned**

The existing Django REST APIs will remain unchanged.

---

# Phase 13 — React Migration

**Status: ⏳ Planned**

## React Setup

* [ ] React Setup
* [ ] Project Structure
* [ ] React Router
* [ ] Axios
* [ ] Environment Configuration

## Authentication

* [ ] Login
* [ ] Register
* [ ] JWT Handling
* [ ] Token Refresh
* [ ] Logout
* [ ] Protected Routes

## Product

* [ ] Home
* [ ] Shop
* [ ] Product Details
* [ ] Search
* [ ] Filtering
* [ ] Pagination

## Shopping

* [ ] Cart
* [ ] Checkout
* [ ] Orders
* [ ] Payments

## User

* [ ] Profile
* [ ] Addresses
* [ ] Order History

---

# Phase 14 — Production Improvements

**Status: ⏳ Planned**

* [ ] Wishlist
* [ ] Coupons
* [ ] Reviews
* [ ] Ratings
* [ ] Advanced Inventory Management
* [ ] Email Notifications
* [ ] PDF Invoice
* [ ] Admin Reports
* [ ] SEO
* [ ] Performance Optimization
* [ ] Caching
* [ ] Logging
* [ ] Error Monitoring
* [ ] Security Hardening

---

# API Documentation

## Authentication

### Completed

* [x] `POST /api/auth/register/`
* [x] `POST /api/auth/login/`
* [x] `POST /api/token/refresh/`
* [x] `POST /api/auth/logout/`
* [x] `GET /api/auth/users/`
* [x] `GET /api/auth/profile/`
* [x] `PUT /api/auth/profile/update/`
* [x] `PUT /api/auth/change-password/`

### Remaining

* [ ] Forgot Password API
* [ ] Email Verification API
* [ ] Automatic Token Refresh Handling

---

# Products

### Completed

* [x] `GET /api/products/`
* [x] `GET /api/products/{slug}/`
* [x] `GET /api/products/categories/`
* [x] `GET /api/products/{product_id}/variants/`
* [x] `GET /api/products/{pk}/inventory/`

### Product Features

* [x] Search
* [x] Filtering
* [x] Sorting
* [x] Pagination
* [x] Product Variants
* [x] Inventory

---

# Cart

**Status: 🟡 Backend Completed — Frontend Pending**

### Completed

* [x] `GET /api/cart/`
* [x] `POST /api/cart/add/`
* [x] `PATCH /api/cart/items/{item_id}/`
* [x] `DELETE /api/cart/items/{item_id}/`
* [x] `DELETE /api/cart/`

### Frontend

* [x] Cart Page
* [ ] Cart API Integration
* [ ] Product Detail → Cart Integration

---

# Orders

**Status: ⏳ Not Started**

* [ ] `POST /api/orders/`
* [ ] `GET /api/orders/`
* [ ] `GET /api/orders/{id}/`
* [ ] `PATCH /api/orders/{id}/`
* [ ] `DELETE /api/orders/{id}/`

---

# Payments

**Status: ⏳ Not Started**

* [ ] `POST /api/payment/create/`
* [ ] `POST /api/payment/verify/`
* [ ] Payment Webhook

---

# AI

**Status: ⏳ Planned**

* [ ] AI Assistant API
* [ ] Natural Language Search API
* [ ] Product Recommendation API
* [ ] AI Search Integration
* [ ] AI Assistant Integration

---

# Git Commit History

| Date | Commit | Description |
| ---- | ------ | ----------- |
|      |        |             |
|      |        |             |

> Add entries after each completed feature or milestone.

---

# Learning Notes

Document important concepts learned during development.

## Django

* [ ] Custom User Model
* [ ] Model Relationships
* [ ] ForeignKey
* [ ] QuerySets
* [ ] Model Validation
* [ ] Database Migrations
* [ ] Admin Customization

## Django REST Framework

* [ ] ModelSerializer vs Serializer
* [ ] Serializer Validation
* [ ] `serializer.is_valid()`
* [ ] `serializer.validated_data`
* [ ] `serializer.data`
* [ ] `serializer.save()`
* [ ] `create()` vs `update()`
* [ ] APIView
* [ ] Generic Views
* [ ] Permissions
* [ ] Authentication
* [ ] Pagination
* [ ] Filtering
* [ ] Search
* [ ] Ordering
* [ ] Query Optimization

## Authentication

* [ ] Authentication vs Authorization
* [ ] JWT
* [ ] Access Token vs Refresh Token
* [ ] Token Blacklisting
* [ ] Protected APIs
* [ ] Automatic Token Refresh

## Frontend

* [ ] Django Templates
* [ ] JavaScript DOM Manipulation
* [ ] Fetch API
* [ ] Async/Await
* [ ] Dynamic Rendering
* [ ] Responsive Design
* [ ] API → Frontend Integration
* [ ] Reusable API Helper Functions

## E-commerce

* [ ] Cart Architecture
* [ ] CartItem Relationships
* [ ] Inventory Management
* [ ] Order Lifecycle
* [ ] Payment Lifecycle
* [ ] Payment Verification

## AI

* [ ] LLM Fundamentals
* [ ] Prompt Engineering
* [ ] Natural Language Search
* [ ] Product Recommendation Systems
* [ ] Context / Product Data
* [ ] AI API Integration

---

# Daily Progress

## Date

YYYY-MM-DD

## Completed

* [ ]

## Challenges

* [ ]

## Solutions

* [ ]

## Next Task

* [ ]

---

# Known Issues

Document bugs and pending fixes.

| Issue | Status | Solution |
| ----- | ------ | -------- |
|       |        |          |

---

# Future Ideas

* Product Recommendations
* AI Jewellery Shopping Assistant
* Natural Language Search
* Chat Support
* Inventory Alerts
* Admin Analytics
* Wishlist
* Dark Mode
* Multi Vendor Support
* Mobile App

---

# Database Relationships

```text
User
├── Address
├── Order
└── Cart
    └── CartItem

Category
└── Product
    ├── ProductImage
    ├── ProductVariant
    ├── ProductInventory
    └── CartItem

Order
├── OrderItem
└── Payment
```

---

# Current Project Status

```text
Phase 1  — Project Setup             ✅ Completed
Phase 2  — Authentication            🟢 Core Completed
Phase 3  — Product Module             🟢 Core Completed
Phase 4  — Frontend UI                🟡 CURRENT
Phase 5  — Shopping Cart              🟡 Backend Completed
Phase 6  — Checkout                   ⏳ Not Started
Phase 7  — Orders                     ⏳ Not Started
Phase 8  — Payments                   ⏳ Not Started
Phase 9  — AI Integration             ⏳ Planned
Phase 10 — Admin Dashboard            ⏳ Not Started
Phase 11 — Deployment                 ⏳ Not Started
Phase 12 — AI → React Preparation     ⏳ Planned
Phase 13 — React Migration            ⏳ Planned
Phase 14 — Production Improvements    ⏳ Planned
```

## Immediate Next Tasks

1. [x] Product Detail page
2. [x] About page
3. [ ] Contact page
4. [x] Login page
5. [x] Register page
6. [x] Profile page
7. [ ] Automatic JWT Token Refresh
8. [ ] Orders page
9. [ ] Error pages
10. [x] Cart Page
11. [ ] Product Detail → Cart Integration
12. [ ] Checkout
13. [ ] Orders Backend
14. [ ] Razorpay
15. [ ] AI Jewellery Assistant
16. [ ] Natural Language Search
17. [ ] Admin Dashboard
18. [ ] Deployment
19. [ ] React Migration
20. [ ] Production Improvements

```

**This is the version I would use as the current `PROJECT_ROADMAP.md`.**

One important change in the plan: **we are not treating the Cart backend as unfinished anymore.** You've already built and tested the core Cart APIs. The remaining Cart work is primarily the **frontend integration**.

And our immediate next technical task remains **automatic JWT token refresh**, then we'll continue Phase 4.
```
