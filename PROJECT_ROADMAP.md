# Ornament Store

## Project Overview

A full-stack e-commerce web application for selling ornaments.

The project follows an API-first architecture using Django and Django REST Framework (DRF). During Phase 1, the frontend is built with Django Templates, HTML, CSS, Bootstrap, and JavaScript. In a later phase, the frontend will be migrated to React while reusing the same REST APIs.

The project is being developed following professional software engineering practices including Git version control, modular application architecture, API testing with Postman, clean code principles, incremental feature development, and learning concepts before using shortcuts.

---

# Project Objectives

* Build a production-style e-commerce application
* Learn professional Django architecture
* Master Django REST Framework
* Learn JWT Authentication
* Build reusable REST APIs
* Integrate Razorpay payment gateway
* Implement secure payment verification and webhooks
* Implement inventory reservation and restoration
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
├── payments/
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

**Status: 🟢 Core Frontend Completed**

## Completed Pages

* [x] Home
* [x] Shop
* [x] Product Details
* [x] About
* [x] Contact
* [x] Login
* [x] Register
* [x] Profile
* [x] Error Pages
* [x] Cart
* [x] Orders
* [x] Order Details
* [x] Checkout
* [x] Checkout Success State

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
* [x] Product Detail → Cart Integration

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

* [x] Checkout Page
* [x] Address Loading
* [x] Address Selection
* [x] Default Address Selection
* [x] Add Address from Checkout
* [x] Cart Loading
* [x] Order Summary
* [x] Checkout Validation
* [x] Shipping Information
* [x] Place Order
* [x] Razorpay Checkout Integration
* [x] Payment Success State
* [x] Payment Failure Handling
* [x] Checkout Success Page

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
* [x] Variant-Specific Stock
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

**Status: ✅ Completed**

## Address

* [x] Address Model
* [x] Address CRUD
* [x] Address Ownership Protection
* [x] Default Address Logic
* [x] Address API Testing

## Checkout

* [x] Checkout Page
* [x] Address Loading
* [x] Address Selection
* [x] Add Address from Checkout
* [x] Cart Loading
* [x] Order Summary
* [x] Checkout Validation
* [x] Shipping Information
* [x] Order Creation
* [x] Final Order Summary
* [x] Place Order
* [x] Inventory Validation During Order Creation
* [x] Inventory Reservation
* [x] Checkout Success State
* [x] Checkout Error Handling
* [x] End-to-End Checkout Testing

---

# Phase 7 — Orders

**Status: 🟢 Core Orders Completed**

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
* [x] Inventory Reservation / Reduction
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
* [x] Shared `orders.css`
* [x] Full Orders Frontend Testing

## Admin

* [x] Order Admin
* [x] Order Item Inline
* [x] Order Status Management
* [x] Payment Status Display
* [x] Customer Order Details

---

# Phase 8 — Payments / Razorpay

**Status: 🟡 Core Payment Integration Completed — Webhook Configuration Pending**

## Razorpay Setup

* [x] Razorpay SDK Installed
* [x] `payments` Django App Created
* [x] Razorpay Test Credentials Configured Through `.env`
* [x] Razorpay Key ID Configuration
* [x] Razorpay API Secret Configuration
* [x] Webhook Secret Configuration
* [x] Payment Expiry Configuration
* [x] `SECURE_CROSS_ORIGIN_OPENER_POLICY` Configuration

## Payment Model

* [x] Payment Model
* [x] One-to-One Order Relationship
* [x] Razorpay Order ID
* [x] Razorpay Payment ID
* [x] Razorpay Signature
* [x] Payment Amount
* [x] Payment Status
* [x] Payment Expiration
* [x] Payment Timestamps
* [x] Payment Admin
* [x] Payment Migration

## Create Payment

* [x] Create Payment API
* [x] Razorpay Order Creation
* [x] Amount → Paise Conversion
* [x] Payment Record Creation
* [x] Payment Expiration Timestamp
* [x] Existing Payment Handling
* [x] Order Ownership Validation
* [x] Cancelled Order Protection
* [x] Already-Paid Order Protection

## Payment Checkout

* [x] Razorpay Checkout Integration
* [x] Razorpay Key Configuration
* [x] Razorpay Order ID
* [x] Amount Handling
* [x] Payment Success Handler
* [x] Payment Failure Handler
* [x] Checkout Dismissal Handling
* [x] Successful Test Payment

## Payment Verification

* [x] Payment Verification API
* [x] Razorpay Signature Verification
* [x] Payment Ownership Validation
* [x] Duplicate Payment Protection
* [x] Payment → PAID
* [x] Order Payment Status → PAID
* [x] Order Status → CONFIRMED
* [x] Cart Cleanup After Successful Payment
* [x] No Double Inventory Deduction During Verification

## Inventory / Payment Lifecycle

### Stock Reservation

* [x] Stock Reserved During Order Creation
* [x] Product Stock Validation
* [x] Variant Stock Validation
* [x] Transaction-Safe Inventory Handling
* [x] Inventory Row Locking

### Successful Payment

```text
Order Created
      ↓
Stock Reserved
      ↓
Payment Successful
      ↓
Stock Remains Deducted
      ↓
Product Is Sold
```

* [x] Successful Payment Does Not Restore Reserved Stock

### Failed / Abandoned Payment

```text
Order Created
      ↓
Stock Reserved
      ↓
Payment Not Completed
      ↓
Payment Expires
      ↓
expire_payments
      ↓
Order Cancelled
      ↓
Stock Restored
```

* [x] Payment Expiration
* [x] Expired Payment Detection
* [x] Payment → EXPIRED
* [x] Order → CANCELLED
* [x] Reserved Stock Restoration
* [x] `expire_payments` Management Command
* [x] Expiration Testing

> During development, `expire_payments` is run manually. During production deployment, it must be scheduled automatically.

## Payment Webhook

### Django Webhook Implementation

* [x] Webhook Endpoint
* [x] POST-Only Webhook Handling
* [x] CSRF Exemption
* [x] Webhook Secret Support
* [x] HMAC Signature Verification
* [x] `payment.captured` Handling
* [x] Amount Validation
* [x] Webhook Event ID Handling
* [x] Webhook Idempotency
* [x] Cart Cleanup After Captured Payment
* [x] Manual Signed Webhook Test

### Webhook Configuration

* [ ] Configure Webhook in Razorpay Dashboard
* [ ] Configure `payment.captured` Event
* [ ] Confirm Webhook Secret Matches `.env`
* [ ] Test Real Razorpay → Django Webhook Delivery
* [ ] Confirm `POST /api/payment/webhook/` Receives `200 OK`

> `GET /api/payment/webhook/` returning `405 Method Not Allowed` with `Allow: POST, OPTIONS` is expected because Razorpay webhooks use POST.

## Payment Expiration

* [x] `expire_payments` Management Command
* [x] Expired Payment Detection
* [x] Order Cancellation
* [x] Reserved Stock Restoration
* [x] Expiration Testing

## Price Mismatch Protection

* [x] Current Cart Signature
* [x] Product Matching
* [x] Variant Matching
* [x] Quantity Matching
* [x] Effective Price Matching
* [x] Prevent Reuse of Incorrect Old Pending Payment
* [x] Exact Retry Reuse
* [x] Price-Mismatch Testing

## End-to-End Payment Test

Successfully tested:

```text
Customer
   ↓
Checkout
   ↓
Django Order
   ↓
Razorpay Order
   ↓
Razorpay Checkout
   ↓
Payment Captured
   ↓
Django Verification
   ↓
Payment = PAID
   ↓
Order = CONFIRMED
```

Successful test evidence:

* Razorpay Payment ID: `pay_Tj8RwfGGWS4J6Y`
* Razorpay Order ID: `order_Tj8LeJTwN0C3BG`
* Amount: ₹149.99
* Razorpay Status: Captured
* Django Order: `ORD-5C8F6C13`
* Django Payment Status: Paid

## Remaining Phase 8 Work

* [ ] Configure Razorpay Dashboard Webhook
* [ ] Test Real Razorpay Webhook Delivery
* [ ] Remove Temporary Razorpay Debug Logging
* [ ] Final Payment Code Review
* [ ] Final `python manage.py check`
* [ ] Review `git status`
* [ ] Review `git diff`
* [ ] Update Roadmap After Final Webhook Test
* [ ] Final Razorpay Git Commit

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

## Scheduled Tasks

* [ ] Automatically Schedule `expire_payments`
* [ ] Verify Expired Payment Cleanup in Production
* [ ] Configure Scheduled Maintenance Tasks

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

* [ ] Review Existing REST API Architecture
* [ ] Standardize API Response Patterns
* [ ] Review Authentication Flow
* [ ] Review Token Refresh Flow
* [ ] Prepare API Documentation
* [ ] Identify React Data Requirements
* [ ] Prepare Frontend API Helper Architecture

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
* [ ] Product Variants

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
* [ ] HTML Injection / XSS Hardening
* [ ] Payment Security Review
* [ ] Inventory Concurrency Review

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

**Status: ✅ Completed**

### Completed

* [x] Address Management
* [x] Address Ownership Protection
* [x] Default Address Logic
* [x] Checkout Page
* [x] Address Selection
* [x] Cart Loading
* [x] Order Summary
* [x] Order Creation
* [x] Inventory Validation
* [x] Inventory Reservation
* [x] Payment Flow Integration
* [x] Checkout Success State
* [x] Checkout Error Handling
* [x] End-to-End Checkout Testing

---

# Orders

**Status: 🟢 Completed**

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
* [x] Inventory Row Locking
* [x] Order Admin
* [x] Orders Frontend
* [x] Order Details Frontend
* [x] Cancellation UI
* [x] Responsive/Luxury Styling
* [x] Full Orders Frontend Testing

---

# Payments

**Status: 🟡 Core Completed — Webhook Configuration Pending**

### Completed

* [x] `POST /api/payment/create/`
* [x] `POST /api/payment/verify/`
* [x] `POST /api/payment/webhook/`
* [x] Payment Expiration Command
* [x] Razorpay Checkout
* [x] Payment Verification
* [x] Payment Status Handling
* [x] Inventory Reservation
* [x] Inventory Restoration After Expiration
* [x] Webhook Signature Verification
* [x] Webhook Idempotency

### Remaining

* [ ] Configure Razorpay Dashboard Webhook
* [ ] Test Real Razorpay Webhook Delivery
* [ ] Final Payment Cleanup
* [ ] Final Git Commit

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
* [ ] Transactions
* [ ] `select_for_update()`
* [ ] Management Commands

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
* [ ] Webhook APIs

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
* [ ] Payment Checkout Integration

## E-commerce

* [ ] Cart Architecture
* [ ] CartItem Relationships
* [ ] Inventory Management
* [ ] Inventory Reservation
* [ ] Inventory Restoration
* [ ] Order Lifecycle
* [ ] Payment Lifecycle
* [ ] Payment Verification
* [ ] Payment Webhooks
* [ ] Order Status Management
* [ ] Order Cancellation
* [ ] Transaction Management
* [ ] Shipping Address Snapshots
* [ ] Purchase-Time Price Snapshots
* [ ] Payment Expiration

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

| Issue                                                         | Status          | Solution                                     |
| ------------------------------------------------------------- | --------------- | -------------------------------------------- |
| Razorpay Dashboard webhook not configured                     | Pending         | Configure webhook and test real delivery     |
| Payment expiration requires manual command during development | Expected        | Schedule `expire_payments` during deployment |
| Temporary Razorpay debug logging                              | Pending cleanup | Remove before final payment commit           |

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
Phase 4  — Frontend UI                🟢 Core Completed
Phase 5  — Shopping Cart              ✅ Completed
Phase 6  — Checkout                   ✅ Completed
Phase 7  — Orders                     🟢 Core Completed
Phase 8  — Payments / Razorpay       🟡 Core Completed
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
16. [x] Checkout Backend
17. [x] Checkout Frontend
18. [x] Razorpay Payment Creation
19. [x] Razorpay Checkout
20. [x] Razorpay Payment Verification
21. [x] Payment Expiration
22. [x] Inventory Restoration After Expiration
23. [x] Webhook Backend Implementation
24. [ ] Configure Razorpay Dashboard Webhook
25. [ ] Test Real Razorpay Webhook Delivery
26. [ ] Remove Temporary Payment Debug Logs
27. [ ] Final Razorpay Code Review
28. [ ] Final Razorpay Git Commit
29. [ ] AI Jewellery Assistant
30. [ ] Natural Language Search
31. [ ] Admin Dashboard
32. [ ] Deployment
33. [ ] React Migration
34. [ ] Production Improvements

---
