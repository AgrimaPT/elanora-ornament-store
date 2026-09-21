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
* [x] Automatic Access Token Refresh

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
* [x] Cart
* [x] Orders
* [x] Order Details
* [x] Checkout Foundation

## Remaining Pages

* [ ] Checkout Finalization

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
* [x] Product Variant Selection
* [x] Variant-Specific Pricing
* [x] Variant-Specific Stock
* [x] Luxury Product Styling

### Authentication UI

* [x] Login Page
* [x] Register Page
* [x] Profile Page
* [x] Edit Profile
* [x] Change Password
* [x] Logout
* [x] Automatic JWT Token Refresh

### Cart UI

* [x] Cart Page
* [x] Cart Item Display
* [x] Variant Display
* [x] Variant-Specific Pricing
* [x] Unit Price Display
* [x] Quantity Controls
* [x] Stock-Based Quantity Limit
* [x] Remove Item
* [x] Cart Summary
* [x] Empty Cart State
* [x] Cart API Integration
* [x] Product Detail → Cart Integration
* [x] Cart Frontend Testing
* [x] Luxury Cart Styling

### Orders UI

* [x] Orders Page
* [x] Order History Loading
* [x] Order Card Rendering
* [x] Order Details Page
* [x] Order Item Display
* [x] Variant Display
* [x] Order Summary
* [x] Shipping Address Display
* [x] Order Status Display
* [x] Payment Status Display
* [x] Order Cancellation UI
* [x] Cancellation Confirmation
* [x] Order Refresh After Cancellation
* [x] Loading State
* [x] Empty State
* [x] Error State
* [x] Responsive Orders Layout
* [x] Luxury Orders Styling
* [x] Orders Frontend Testing

### Checkout UI

* [x] Checkout Page Foundation
* [x] Address Loading
* [x] Address Selection
* [x] Default Address Selection
* [x] Add Address from Checkout
* [x] Cart Loading
* [x] Order Summary Foundation
* [x] Checkout Validation Foundation

---

# Phase 5 — Shopping Cart

**Status: ✅ Completed**

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
* [x] Product Variant Support
* [x] Variant-Specific Pricing
* [x] Unit Price
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
* [x] Cart API Integration
* [x] Variant Display
* [x] Variant Pricing
* [x] Variant Stock Handling
* [x] Cart Frontend Testing
* [x] Luxury Cart Styling

---

# Phase 6 — Checkout

**Status: 🟡 In Progress**

## Address

* [x] Address Model
* [x] Address CRUD
* [x] Address Ownership Protection
* [x] Default Address Logic
* [x] Address API Testing

## Checkout

* [x] Checkout Page Foundation
* [x] Address Loading
* [x] Address Selection
* [x] Add Address from Checkout
* [x] Cart Loading
* [x] Order Summary Foundation
* [x] Checkout Validation Foundation
* [x] Shipping Information
* [x] Order Creation
* [x] Final Order Summary
* [x] Place Order
* [x] Inventory Validation During Order Creation
* [x] Cart Clearing After Order Creation
* [ ] Final Checkout UI Polish
* [ ] Final Success State
* [ ] Final Error State
* [ ] End-to-End Checkout Testing

---

# Phase 7 — Orders

**Status: 🟡 Core Backend + Frontend Completed — Final Commit Pending**

## Models

* [x] Order
* [x] Order Item
* [x] Order Status
* [x] Payment Status
* [x] Shipping Address Snapshot
* [x] Purchase-Time Unit Price
* [x] Purchase-Time Subtotal
* [x] Product Variant Support

## Order Creation

* [x] Place Order API
* [x] Address Ownership Validation
* [x] Empty Cart Validation
* [x] Stock Validation
* [x] Variant Stock Validation
* [x] Purchase-Time Price Calculation
* [x] Order Creation
* [x] Order Item Creation
* [x] Inventory Reduction
* [x] Cart Clearing
* [x] Atomic Transaction
* [x] Inventory Row Locking
* [x] Postman Testing

## APIs

* [x] `POST /api/orders/`
* [x] `GET /api/orders/history/`
* [x] `GET /api/orders/{id}/`
* [x] `POST /api/orders/{id}/cancel/`
* [x] `PATCH /api/orders/{id}/status/`

## Order History

* [x] Customer Order History
* [x] User Ownership Protection
* [x] Newest-First Ordering
* [x] Authentication Protection
* [x] Postman Testing

## Order Detail

* [x] Customer Order Detail
* [x] User Ownership Protection
* [x] Invalid Order Handling
* [x] Authentication Protection
* [x] Postman Testing

## Order Cancellation

* [x] Customer Cancellation API
* [x] PENDING Cancellation
* [x] CONFIRMED Cancellation
* [x] Stock Restoration
* [x] Variant Stock Restoration
* [x] Mixed Product + Variant Stock Restoration
* [x] Double-Cancellation Protection
* [x] Invalid Status Protection
* [x] Ownership Protection
* [x] Authentication Protection
* [x] Transaction Safety
* [x] Edge-Case Testing

## Order Status / Tracking

* [x] Admin Order Status API
* [x] Admin Permission Protection
* [x] PENDING → CONFIRMED
* [x] CONFIRMED → PROCESSING
* [x] PROCESSING → SHIPPED
* [x] SHIPPED → DELIVERED
* [x] Invalid Transition Protection
* [x] Terminal Status Protection
* [x] Customer Status-Update Protection
* [x] Postman Testing

## Orders Frontend

* [x] Orders Page
* [x] Order History API Integration
* [x] Order Cards
* [x] Order Details Page
* [x] Order Details API Integration
* [x] Order Items
* [x] Variant Display
* [x] Order Total
* [x] Payment Status
* [x] Shipping Address
* [x] Cancellation UI
* [x] Cancellation Confirmation
* [x] Refresh After Cancellation
* [x] Loading State
* [x] Empty State
* [x] Error State
* [x] Ownership Protection Testing
* [x] Invalid Order Testing
* [x] Responsive Design
* [x] Luxury Orders Styling
* [x] Shared `orders.css` for Orders and Order Details
* [x] Full Orders Frontend Testing

## Admin

* [x] Order Admin
* [x] Order Item Inline
* [x] Order Status Management
* [x] Payment Status Display
* [x] Customer Order Details

## Remaining Stage

* [ ] Final Git Commit
* [ ] Final Roadmap Commit Update

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

**Status: ✅ Completed**

### Completed

* [x] `GET /api/cart/`
* [x] `POST /api/cart/add/`
* [x] `PATCH /api/cart/items/{item_id}/`
* [x] `DELETE /api/cart/items/{item_id}/`
* [x] `DELETE /api/cart/`

### Frontend

* [x] Cart Page
* [x] Cart API Integration
* [x] Product Detail → Cart Integration
* [x] Variant Display
* [x] Variant Pricing
* [x] Variant Stock Handling
* [x] Cart Testing

---

# Checkout

**Status: 🟡 In Progress**

### Completed

* [x] Address Management
* [x] Address Ownership Protection
* [x] Default Address Logic
* [x] Checkout Page Foundation
* [x] Address Selection
* [x] Cart Loading
* [x] Order Summary Foundation
* [x] Order Creation
* [x] Inventory Validation
* [x] Cart Clearing

### Remaining

* [ ] Final Checkout UI Polish
* [ ] Final Success State
* [ ] Final Error State
* [ ] End-to-End Checkout Testing

---

# Orders

**Status: 🟡 Core Backend + Frontend Completed — Final Commit Pending**

### Completed APIs

* [x] `POST /api/orders/`
* [x] `GET /api/orders/history/`
* [x] `GET /api/orders/{id}/`
* [x] `POST /api/orders/{id}/cancel/`
* [x] `PATCH /api/orders/{id}/status/`

### Order Features

* [x] Order Creation
* [x] Order History
* [x] Order Detail
* [x] Order Cancellation
* [x] Stock Restoration
* [x] Variant Stock Restoration
* [x] Order Status Transitions
* [x] Ownership Protection
* [x] Authentication Protection
* [x] Inventory Validation
* [x] Atomic Transactions
* [x] Order Admin
* [x] Orders Frontend
* [x] Order Details Frontend
* [x] Cancellation UI
* [x] Responsive/Luxury Styling
* [x] Full Orders Frontend Testing

### Remaining

* [ ] Final Git Commit
* [ ] Roadmap Commit Update

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
* [ ] Order Status Management
* [ ] Order Cancellation
* [ ] Inventory Restoration
* [ ] Transaction Management
* [ ] Shipping Address Snapshots

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
Phase 5  — Shopping Cart              ✅ Completed
Phase 6  — Checkout                   🟡 IN PROGRESS
Phase 7  — Orders                     🟡 Core Completed
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
3. [x] Contact page
4. [x] Login page
5. [x] Register page
6. [x] Profile page
7. [x] Automatic JWT Token Refresh
8. [x] Error pages
9. [x] Cart Page
10. [x] Product Detail → Cart Integration
11. [x] Cart API Integration
12. [x] Cart Variant Support
13. [x] Cart Pricing / Unit Price
14. [x] Orders Backend
15. [x] Orders Frontend
16. [ ] Final Orders Git Commit
17. [ ] Final Checkout UI Polish
18. [ ] Final Checkout Success/Error States
19. [ ] End-to-End Checkout Testing
20. [ ] Razorpay
21. [ ] AI Jewellery Assistant
22. [ ] Natural Language Search
23. [ ] Admin Dashboard
24. [ ] Deployment
25. [ ] React Migration
26. [ ] Production Improvements

```

This now reflects the actual project state much more accurately: **Orders are built and tested; only the final Orders commit remains.** After that, we can finish the remaining Checkout work before moving into Payments.
```
