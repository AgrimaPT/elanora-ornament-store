# Ornament Store

## Project Overview

A full-stack e-commerce web application for selling ornaments.

The project follows an API-first architecture using Django and Django REST Framework (DRF). During Phase 1, the frontend is built with Django Templates, HTML, CSS, Bootstrap, and JavaScript. In a later phase, the frontend will be migrated to React while reusing the same REST APIs.

The project is being developed following professional software engineering practices including:

* REST API architecture
* Authentication and authorization
* Secure payment processing
* Inventory management
* Order management
* AI-powered product discovery
* Responsive UI/UX
* Git/GitHub version control
* Production deployment
* Cloud infrastructure
* Security best practices

---

# Technology Stack

## Backend

* Python 3.11+
* Django 5.2.16
* Django REST Framework 3.17.1
* Simple JWT
* SQLite for development
* PostgreSQL for production

## Frontend

### Current

* Django Templates
* HTML5
* CSS3
* Bootstrap 5
* JavaScript ES6
* Font Awesome
* Bootstrap Icons

### Future

* React
* Axios
* React Router

## Payment

* Razorpay
* Razorpay Checkout
* Razorpay Webhooks

## AI

* Google Gemini API
* `google-genai`
* Gemini model: `gemini-3.5-flash-lite`
* Controlled Django product catalogue tools

## Deployment

* AWS EC2
* Gunicorn
* Nginx
* SSL / HTTPS
* Let's Encrypt
* AWS S3 for media
* PostgreSQL

## Development Tools

* VS Code
* Git
* GitHub
* Postman
* PowerShell
* Python Virtual Environment

---

# Project Architecture


Customer
    ↓
Frontend
    ↓
REST API
    ↓
Django REST Framework
    ↓
Views
    ↓
Serializers
    ↓
Models
    ↓
Database


### Current Frontend Architecture


Django Templates
        ↓
JavaScript
        ↓
REST API
        ↓
Django REST Framework
        ↓
Database


### Future React Architecture


React
  ↓
Axios
  ↓
REST API
  ↓
Django REST Framework
  ↓
Database


### AI Architecture


Customer
    ↓
AI Chat UI
    ↓
AI Chat API
    ↓
Gemini
    ↓
Controlled Catalogue Tools
    ↓
Django Product Database
    ↓
Catalogue Results
    ↓
Gemini
    ↓
AI Response + Product Cards


---

# Project Folder Structure


ornament_store/
│
├── accounts/
│   ├── migrations/
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py
│
├── ai/
│   ├── migrations/
│   ├── gemini_service.py
│   ├── services.py
│   ├── urls.py
│   └── views.py
├── cart/
│   ├── migrations/
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py
│
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── core/
│   ├── migrations/
│   ├── models.py
│   ├── urls.py
│   └── views.py
│
├── orders/
│   ├── migrations/
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py
│
├── payments/
│   ├── migrations/
│   ├── management/
│   ├── models.py
│   ├── serializers.py
│   ├── services.py
│   ├── urls.py
│   └── views.py
│
├── products/
│   ├── migrations/
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py
│
├── media/
│
├── static/
│
├── templates/
│
├── manage.py
├── requirements.txt
├── PROJECT_ROADMAP.md
└── .gitignore


---

# Phase 1 — Project Setup

## Environment Setup

* [x] Install Python
* [x] Create project directory
* [x] Create virtual environment
* [x] Activate virtual environment
* [x] Install Django
* [x] Install Django REST Framework
* [x] Install Pillow
* [x] Install Simple JWT
* [x] Install required dependencies
* [x] Create `requirements.txt`

## Django Project

* [x] Create Django project
* [x] Configure `settings.py`
* [x] Configure installed applications
* [x] Configure templates
* [x] Configure static files
* [x] Configure media files
* [x] Configure database
* [x] Configure REST Framework
* [x] Configure JWT authentication
* [x] Configure environment variables

## Django Applications

* [x] Create `accounts` app
* [x] Create `products` app
* [x] Create `cart` app
* [x] Create `orders` app
* [x] Create `payments` app
* [x] Create `core` app
* [x] Create `ai` app

## Version Control

* [x] Initialize Git
* [x] Create `.gitignore`
* [x] Connect GitHub repository
* [x] Create initial project commit

**Status: Completed**

---

# Phase 2 — Authentication & User Management

## Custom User Model

* [x] Create custom user model using `AbstractUser`
* [x] Add email authentication
* [x] Make email unique
* [x] Add unique phone number
* [x] Add profile image
* [x] Add timestamps
* [x] Configure custom user model in settings
* [x] Create and apply migrations

## Registration

* [x] Create registration serializer
* [x] Create registration API
* [x] Validate email
* [x] Validate password
* [x] Validate phone number
* [x] Hash passwords
* [x] Test registration API

## Login

* [x] Implement JWT authentication
* [x] Create login API
* [x] Generate access token
* [x] Generate refresh token
* [x] Test login API
* [x] Handle invalid credentials

## Token Management

* [x] Configure access token
* [x] Configure refresh token
* [x] Configure token rotation
* [x] Configure token blacklist
* [x] Implement automatic token refresh
* [x] Implement logout
* [x] Blacklist refresh token on logout

## Profile

* [x] Create profile API
* [x] Get profile
* [x] Update profile
* [x] Update profile image
* [x] Change password

## Frontend Authentication

* [x] Login page
* [x] Registration page
* [x] Profile page
* [x] Logout functionality
* [x] JWT handling
* [x] Automatic token refresh
* [x] Protected pages
* [x] Authentication error handling

## Remaining Authentication

* [ ] Forgot password
* [ ] Password reset email
* [ ] Email verification

**Status: Core Authentication Completed**

---

# Phase 3 — Product Module

## Category

* [x] Create Category model
* [x] Category name
* [x] Category slug
* [x] Category description
* [x] Category image
* [x] Active/inactive status

## Product

* [x] Create Product model
* [x] Product name
* [x] Product slug
* [x] Product description
* [x] Product category
* [x] Product base price
* [x] Product active status
* [x] Product timestamps

## Product Images

* [x] Create ProductImage model
* [x] Multiple images per product
* [x] Main image
* [x] Image upload
* [x] Image management

## Product Variants

* [x] Create product variant system
* [x] Variant name
* [x] Variant price
* [x] Variant stock
* [x] Variant active status
* [x] Variant-specific pricing
* [x] Variant-specific inventory

## Inventory

* [x] Track product stock
* [x] Track variant stock
* [x] Validate stock availability
* [x] Prevent purchasing unavailable products
* [x] Handle stock changes

## Product API

* [x] Product serializer
* [x] Category serializer
* [x] Product image serializer
* [x] Variant serializer
* [x] Product list API
* [x] Product detail API
* [x] Category API
* [x] Search API
* [x] Filtering
* [x] Sorting
* [x] Pagination

## Product Features

* [x] Search by product name
* [x] Search by description
* [x] Category filtering
* [x] Price filtering
* [x] Availability filtering
* [x] Sorting
* [x] Pagination

**Status: Core Product Module Completed**

---

# Phase 4 — Frontend UI

## Shared Layout

* [x] Base template
* [x] Navbar
* [x] Footer
* [x] Responsive layout
* [x] Bootstrap integration
* [x] Font Awesome integration

## Pages

* [x] Home
* [x] Shop
* [x] Product Details
* [x] About
* [x] Contact
* [x] Login
* [x] Register
* [x] Profile
* [x] Cart
* [x] Orders
* [x] Order Details
* [x] Checkout
* [x] Error pages

## UI/UX

* [x] Luxury jewellery theme
* [x] Ivory / champagne / gold colour palette
* [x] Responsive design
* [x] Product cards
* [x] Product image galleries
* [x] Stock indicators
* [x] Variant selection
* [x] Quantity controls
* [x] Loading states
* [x] Error states
* [x] Empty states
* [x] Mobile responsiveness

## Visual Direction

* [x] Classic elegant appearance
* [x] Professional ecommerce styling
* [x] Consistent typography
* [x] Consistent buttons
* [x] Consistent spacing
* [x] Luxury navigation
* [x] Professional footer
* [x] Product-focused layouts

**Status: Core Frontend Completed**

---

# Phase 5 — Shopping Cart

## Cart Backend

* [x] Create Cart model
* [x] Create CartItem model
* [x] Add product to cart
* [x] Add product variant to cart
* [x] Update quantity
* [x] Remove item
* [x] Clear cart
* [x] Calculate item price
* [x] Calculate cart total
* [x] Validate stock

## Cart API

* [x] `GET /api/cart/`
* [x] `POST /api/cart/add/`
* [x] `PATCH /api/cart/<id>/`
* [x] `DELETE /api/cart/<id>/`
* [x] Clear cart API

## Cart Frontend

* [x] Cart page
* [x] Product information
* [x] Variant information
* [x] Quantity controls
* [x] Remove item
* [x] Clear cart
* [x] Cart total
* [x] Stock validation
* [x] Cart count in navbar

**Status: Completed**

---

# Phase 6 — Checkout

## Address Management

* [x] Create address model
* [x] Add shipping address
* [x] Update address
* [x] Delete address
* [x] Select checkout address

## Order Creation

* [x] Create order from cart
* [x] Create order items
* [x] Store product information snapshot
* [x] Store price snapshot
* [x] Store shipping information
* [x] Calculate order total

## Inventory Reservation

* [x] Validate inventory
* [x] Reserve stock during order creation
* [x] Prevent overselling
* [x] Handle insufficient stock

## Checkout Frontend

* [x] Address selection
* [x] Order summary
* [x] Product summary
* [x] Price calculation
* [x] Shipping information
* [x] Payment initiation
* [x] Success state
* [x] Failure state

**Status: Completed**

---

# Phase 7 — Orders

## Order Management

* [x] Create Order model
* [x] Create OrderItem model
* [x] Order number
* [x] Order status
* [x] Payment status
* [x] Shipping snapshot
* [x] Order timestamps

## Order Status

* [x] Pending
* [x] Confirmed
* [x] Processing
* [x] Shipped
* [x] Delivered
* [x] Cancelled

## Order API

* [x] Order history API
* [x] Order detail API
* [x] Cancel order API
* [x] Order status API
* [x] Admin order management API

## Cancellation

* [x] Cancel order
* [x] Restore inventory
* [x] Update payment status
* [x] Prevent invalid cancellation

## Frontend

* [x] Orders page
* [x] Order details page
* [x] Order status display
* [x] Cancel order
* [x] Order item details

**Status: Core Orders Completed**

---

# Phase 8 — Payments / Razorpay

## Razorpay Setup

* [x] Create Razorpay account
* [x] Configure Test Mode
* [x] Generate Razorpay test credentials
* [x] Add Razorpay credentials to `.env`
* [x] Add webhook secret to `.env`
* [x] Protect credentials from Git

## Payment Model

* [x] Create Payment model
* [x] Link payment with order
* [x] Store Razorpay order ID
* [x] Store Razorpay payment ID
* [x] Store payment amount
* [x] Store payment status
* [x] Store payment timestamps
* [x] Store expiration time

## Payment Service

* [x] Create Razorpay order
* [x] Create payment record
* [x] Validate payment amount
* [x] Handle payment expiry
* [x] Update payment status
* [x] Handle successful payment
* [x] Handle failed payment

## Payment APIs

* [x] Create payment API
* [x] Verify payment API
* [x] Webhook API
* [x] Payment error handling
* [x] Authentication and authorization

## Payment Verification

* [x] Verify Razorpay signature
* [x] Validate Razorpay order ID
* [x] Validate payment amount
* [x] Prevent price manipulation
* [x] Prevent duplicate payment processing
* [x] Update order after successful payment
* [x] Update payment status

## Payment Expiration

* [x] Create payment expiration logic
* [x] Detect expired payments
* [x] Cancel expired orders
* [x] Restore reserved inventory
* [x] Update payment status
* [x] Create `expire_payments` management command

## Razorpay Webhook

* [x] Create webhook endpoint
* [x] Configure Razorpay Dashboard webhook
* [x] Configure webhook secret
* [x] Enable `payment.captured` event
* [x] Test webhook delivery
* [x] Verify webhook signature
* [x] Handle webhook event
* [x] Return `200 OK`
* [x] Confirm real webhook request through ngrok
* [x] Confirm `GET /api/payment/webhook/` correctly returns `405 Method Not Allowed`
* [x] Remove temporary debug logging

## End-to-End Payment Testing

* [x] Create checkout order
* [x] Initiate Razorpay payment
* [x] Complete successful test payment
* [x] Verify payment
* [x] Confirm order status
* [x] Confirm payment status
* [x] Confirm inventory handling
* [x] Test webhook
* [x] Test payment failure
* [x] Test expired payment flow
* [x] Run Django system check
* [x] Verify Git status
* [x] Confirm `.env` is ignored
* [x] Confirm no debug files are committed

## Final Payment Integration

* [x] Review payment models
* [x] Review serializers
* [x] Review views
* [x] Review payment services
* [x] Review URLs
* [x] Review expiration command
* [x] Final system check passed
* [x] Working tree clean
* [x] Commit Razorpay integration

### Git Commit


26b3f0a feat: complete Razorpay payment integration


**Status: Completed**

---

# Phase 9 — AI Jewellery Assistant

## AI Architecture

* [x] Define AI assistant architecture
* [x] Define AI request/response flow
* [x] Define controlled product catalogue access
* [x] Define AI tool-calling architecture
* [x] Prevent unrestricted database access

## Gemini Setup

* [x] Create Gemini API integration
* [x] Install `google-genai`
* [x] Configure Gemini API key
* [x] Store Gemini API key in `.env`
* [x] Configure Gemini model
* [x] Test Gemini connection
* [x] Test Gemini responses

## Product Context

* [x] Prepare product catalogue context
* [x] Define product search tool
* [x] Define product detail tool
* [x] Connect AI tools with Django product database

## Controlled Catalogue Tools

### `search_products`

* [x] Search product name
* [x] Search product description
* [x] Filter by category
* [x] Filter by minimum price
* [x] Filter by maximum price
* [x] Filter by availability
* [x] Support product aliases
* [x] Support variant-aware price
* [x] Support variant-aware stock
* [x] Return product image
* [x] Return only active products

### `get_product_details`

* [x] Exact product lookup
* [x] Return product name
* [x] Return price
* [x] Return category
* [x] Return description
* [x] Return stock
* [x] Return variants
* [x] Return image
* [x] Return only valid catalogue products

## AI Chat API

* [x] Create AI chat endpoint
* [x] Create request serializer
* [x] Validate user input
* [x] Connect Gemini API
* [x] Implement tool calling
* [x] Execute catalogue tools
* [x] Send catalogue results back to Gemini
* [x] Generate final AI response
* [x] Implement error handling
* [x] Implement session-based conversation context

### API


POST /api/ai/chat/


## Product Recommendations

* [x] Natural-language product discovery
* [x] Budget-based recommendations
* [x] Jewellery type recommendations
* [x] Category recommendations
* [x] Product-name recommendations
* [x] Description-based recommendations
* [x] Availability-aware recommendations
* [x] Variant-aware recommendations
* [x] No-result handling
* [x] Prevent recommending unavailable products
* [x] Prevent hallucinated products
* [x] Prevent hallucinated prices
* [x] Prevent hallucinated stock
* [x] Prevent hallucinated variants

## Conversation Context

* [x] Maintain conversation context
* [x] Support multi-turn conversation
* [x] Handle follow-up questions
* [x] Support product detail follow-up
* [x] Support budget follow-up
* [x] Support category follow-up
* [x] Support vague queries

## AI Safety

* [x] Prompt injection protection
* [x] Protect internal tools
* [x] Prevent database exposure
* [x] Protect Gemini API key
* [x] Catalogue-only recommendations
* [x] Validate product data before returning results
* [x] Handle invalid AI requests
* [x] Handle Gemini API errors
* [x] Handle empty catalogue results

## AI Frontend

* [x] Create floating AI chat widget
* [x] Create chat interface
* [x] Display user messages
* [x] Display AI messages
* [x] Add typing indicator
* [x] Responsive chat interface
* [x] Product recommendation cards
* [x] Product images
* [x] Product names
* [x] Product prices
* [x] Product variants
* [x] Clickable product navigation
* [x] Handle API errors
* [x] Handle no-result responses

## AI Testing

* [x] Test greeting
* [x] Test product search
* [x] Test category search
* [x] Test budget search
* [x] Test variant search
* [x] Test no-result search
* [x] Test vague query
* [x] Test multi-turn conversation
* [x] Test product follow-up
* [x] Test product navigation
* [x] Test prompt injection
* [x] Test API error handling
* [x] Test unavailable products
* [x] Test price accuracy
* [x] Test stock accuracy

## AI Example Queries


"Show me simple gold earrings under ₹2,000"

"I need something for a wedding"

"Show me necklaces below ₹5,000"

"Do you have anything cheaper?"

"Tell me more about the second product"


## Current AI Limitation

The current product database does not yet contain dedicated structured attributes for:

* Material
* Colour
* Style
* Occasion
* Design type

Therefore, recommendations for these attributes depend on information available in the product name and description.

Structured jewellery attributes can be added later for more advanced AI recommendations.

**Status: Completed**

---

# Phase 10 — Admin Dashboard

## Product Management

* [ ] Category management
* [ ] Product management
* [ ] Product image management
* [ ] Product variant management
* [ ] Inventory management
* [ ] Activate/deactivate products
* [ ] Activate/deactivate categories

## Order Management

* [ ] View all orders
* [ ] Search orders
* [ ] Filter orders
* [ ] View order details
* [ ] Update order status
* [ ] View payment status
* [ ] Handle cancellations
* [ ] Track inventory changes

## Customer Management

* [ ] View customers
* [ ] Search customers
* [ ] View customer details
* [ ] View customer orders
* [ ] Activate/deactivate users

## Dashboard

* [ ] Dashboard overview
* [ ] Total orders
* [ ] Total sales
* [ ] Pending orders
* [ ] Completed orders
* [ ] Product count
* [ ] Customer count
* [ ] Inventory overview

**Status: Not Started**

---

# Phase 11 — Deployment

## Production Database

* [ ] Configure PostgreSQL
* [ ] Create production database
* [ ] Configure database environment variables
* [ ] Test migrations
* [ ] Migrate SQLite data if required

## AWS

* [ ] Create AWS EC2 instance
* [ ] Configure security groups
* [ ] Configure SSH
* [ ] Install Python
* [ ] Install dependencies
* [ ] Clone GitHub repository
* [ ] Configure production `.env`

## Gunicorn

* [ ] Install Gunicorn
* [ ] Configure Gunicorn
* [ ] Create systemd service
* [ ] Test Gunicorn

## Nginx

* [ ] Install Nginx
* [ ] Configure reverse proxy
* [ ] Configure static files
* [ ] Configure media files
* [ ] Test Nginx

## HTTPS

* [ ] Configure domain
* [ ] Configure DNS
* [ ] Install SSL
* [ ] Configure HTTPS
* [ ] Configure automatic certificate renewal

## AWS S3

* [ ] Create S3 bucket
* [ ] Configure bucket permissions
* [ ] Configure Django storage
* [ ] Upload media to S3
* [ ] Test image loading

## Production Security

* [ ] Set `DEBUG=False`
* [ ] Configure `ALLOWED_HOSTS`
* [ ] Configure CSRF trusted origins
* [ ] Secure cookies
* [ ] Configure HTTPS redirects
* [ ] Secure secret keys
* [ ] Review CORS
* [ ] Review permissions
* [ ] Remove development-only settings
* [ ] Run Django deployment checks

## Scheduled Tasks

* [ ] Schedule `expire_payments`
* [ ] Configure cron/systemd timer
* [ ] Test automatic payment expiration

**Status: Not Started**

---

# Phase 12 — AI → React Preparation

## API Readiness

* [ ] Review all REST APIs
* [ ] Standardize API responses
* [ ] Review authentication flow
* [ ] Review JWT refresh flow
* [ ] Review error responses
* [ ] Review pagination
* [ ] Review filtering
* [ ] Review API documentation

## AI API

* [ ] Review AI chat API
* [ ] Verify AI API is frontend-independent
* [ ] Verify product cards can be rendered by React
* [ ] Verify conversation context behaviour
* [ ] Verify authentication requirements

## React Preparation

* [ ] Create React project
* [ ] Configure Axios
* [ ] Configure React Router
* [ ] Configure environment variables
* [ ] Create API service layer
* [ ] Create authentication context
* [ ] Create reusable components

**Status: Not Started**

---

# Phase 13 — React Migration

## Core

* [ ] Create React application
* [ ] Configure routing
* [ ] Configure Axios
* [ ] Configure authentication
* [ ] Configure JWT storage
* [ ] Configure token refresh

## Pages

* [ ] Home
* [ ] Shop
* [ ] Product Details
* [ ] About
* [ ] Contact
* [ ] Login
* [ ] Register
* [ ] Profile
* [ ] Cart
* [ ] Checkout
* [ ] Orders
* [ ] Order Details

## Ecommerce Features

* [ ] Product search
* [ ] Filtering
* [ ] Sorting
* [ ] Pagination
* [ ] Cart management
* [ ] Checkout
* [ ] Razorpay integration
* [ ] Order management
* [ ] Inventory handling

## AI

* [ ] React AI chat interface
* [ ] Connect AI API
* [ ] Product recommendation cards
* [ ] Multi-turn conversation
* [ ] Product navigation
* [ ] Loading states
* [ ] Error handling

## UI/UX

* [ ] Recreate luxury design
* [ ] Responsive design
* [ ] Mobile navigation
* [ ] Reusable components
* [ ] Loading skeletons
* [ ] Empty states
* [ ] Error states
* [ ] Toast notifications

**Status: Not Started**

---

# Phase 14 — Production Improvements

## Performance

* [ ] Database query optimization
* [ ] Add database indexes
* [ ] Optimize API queries
* [ ] Optimize images
* [ ] Implement caching
* [ ] Improve frontend performance
* [ ] Lazy loading

## Security

* [ ] Security audit
* [ ] API permission review
* [ ] Authentication audit
* [ ] Payment security review
* [ ] Input validation review
* [ ] File upload security
* [ ] Rate limiting
* [ ] Production secret management

## Monitoring

* [ ] Application logging
* [ ] Error monitoring
* [ ] Payment monitoring
* [ ] API monitoring
* [ ] Server monitoring
* [ ] Database monitoring

## Testing

* [ ] Unit tests
* [ ] Serializer tests
* [ ] API tests
* [ ] Authentication tests
* [ ] Cart tests
* [ ] Checkout tests
* [ ] Order tests
* [ ] Payment tests
* [ ] Webhook tests
* [ ] AI tests
* [ ] Frontend tests
* [ ] End-to-end testing

---

# API Documentation

## Authentication


POST /api/accounts/register/
POST /api/accounts/login/
POST /api/accounts/token/refresh/
GET  /api/accounts/profile/
PUT  /api/accounts/profile/
POST /api/accounts/change-password/
POST /api/accounts/logout/


## Products


GET /api/products/
GET /api/products/<id>/
GET /api/products/categories/


## Cart


GET    /api/cart/
POST   /api/cart/add/
PATCH  /api/cart/<id>/
DELETE /api/cart/<id>/


## Orders


GET  /api/orders/
GET  /api/orders/<id>/
POST /api/orders/<id>/cancel/


## Payments


POST /api/payment/create/
POST /api/payment/verify/
POST /api/payment/webhook/


## AI


POST /api/ai/chat/


---

# Database Relationships


User
 │
 ├── Cart
 │    └── CartItem
 │          ├── Product
 │          └── ProductVariant
 │
 ├── Order
 │    ├── OrderItem
 │    │     ├── Product
 │    │     └── ProductVariant
 │    │
 │    └── Payment
 │
Product
 │
 ├── Category
 ├── ProductImage
 └── ProductVariant


---

# Payment Flow


Customer
    ↓
Checkout
    ↓
Create Order
    ↓
Reserve Inventory
    ↓
Create Razorpay Order
    ↓
Razorpay Checkout
    ↓
Payment
    ↓
Verify Signature
    ↓
Payment Successful
    ↓
Update Payment
    ↓
Update Order
    ↓
Keep Inventory Deducted


### Failed / Expired Payment


Payment
    ↓
Failed / Expired
    ↓
Cancel Order
    ↓
Restore Inventory
    ↓
Update Payment Status


### Webhook Flow


Razorpay
    ↓
payment.captured
    ↓
Webhook API
    ↓
Verify Webhook Signature
    ↓
Find Payment
    ↓
Update Payment
    ↓
Update Order
    ↓
Return 200 OK


---

# AI Product Discovery Flow


Customer:
"Show me gold earrings under ₹2,000"
            ↓
       AI Chat API
            ↓
         Gemini
            ↓
   search_products tool
            ↓
     Django Product DB
            ↓
   Matching Products
            ↓
         Gemini
            ↓
 AI Response + Product Cards


---

# Git Commit History

| Date       | Commit    | Description                                    |
| ---------- | --------- | ---------------------------------------------- |
| 2026-10-03 | `26b3f0a` | `feat: complete Razorpay payment integration`  |
| 2026-10-08 | TBD       | Complete AI Jewellery Assistant implementation |

---

# Current Project Status

| Phase                              | Status           |
| ---------------------------------- | ---------------- |
| Phase 1 — Project Setup            | * Completed      |
| Phase 2 — Authentication           | * Core Completed |
| Phase 3 — Product Module           | * Core Completed |
| Phase 4 — Frontend UI              | * Core Completed |
| Phase 5 — Shopping Cart            | * Completed      |
| Phase 6 — Checkout                 | * Completed      |
| Phase 7 — Orders                   | * Core Completed |
| Phase 8 — Payments / Razorpay      | * Completed      |
| Phase 9 — AI Jewellery Assistant   | * Completed      |
| Phase 10 — Admin Dashboard         | * Not Started    |
| Phase 11 — Deployment              | * Not Started    |
| Phase 12 — AI → React Preparation  | * Not Started    |
| Phase 13 — React Migration         | * Not Started    |
| Phase 14 — Production Improvements | * Not Started    |

---

# Current Immediate Next Tasks

## 1. Authentication Completion

* [ ] Forgot password
* [ ] Password reset email
* [ ] Email verification

## 2. Admin Dashboard

* [ ] Product management
* [ ] Category management
* [ ] Inventory management
* [ ] Order management
* [ ] Customer management
* [ ] Dashboard statistics

## 3. Production Preparation

* [ ] PostgreSQL setup
* [ ] Production settings
* [ ] Environment configuration
* [ ] Security review
* [ ] Production testing

## 4. Deployment

* [ ] AWS EC2
* [ ] Gunicorn
* [ ] Nginx
* [ ] HTTPS
* [ ] AWS S3
* [ ] Scheduled payment expiration

## 5. React Preparation

* [ ] Review REST APIs
* [ ] Standardize API responses
* [ ] Prepare Axios service layer
* [ ] Prepare authentication flow
* [ ] Prepare AI API integration

## 6. React Migration

* [ ] Create React frontend
* [ ] Migrate pages
* [ ] Migrate ecommerce functionality
* [ ] Migrate AI assistant
* [ ] Preserve luxury UI/UX

## 7. Final Production Improvements

* [ ] Automated tests
* [ ] Performance optimization
* [ ] Security audit
* [ ] Monitoring
* [ ] Documentation

---

# Known Limitations

## Authentication

* Forgot password is not implemented yet.
* Email verification is not implemented yet.

## AI

* Material is not currently a structured product attribute.
* Colour is not currently a structured product attribute.
* Style is not currently a structured product attribute.
* Occasion is not currently a structured product attribute.
* Design type is not currently a structured product attribute.

Therefore, AI recommendations for these characteristics depend on information available in product names and descriptions.

## Deployment

* Project is currently in development environment.
* SQLite is currently used for development.
* AWS deployment is not completed.
* PostgreSQL production setup is pending.
* S3 media storage is pending.
* Production HTTPS setup is pending.

---

# Future AI Improvements

* [ ] Structured jewellery attributes
* [ ] Material filtering
* [ ] Colour filtering
* [ ] Style filtering
* [ ] Occasion filtering
* [ ] Design type filtering
* [ ] More advanced recommendation ranking
* [ ] User preference learning
* [ ] Personalised recommendations
* [ ] Recently viewed products
* [ ] Wishlist-aware recommendations
* [ ] Cart-aware recommendations

---

# Future Ecommerce Improvements

* [ ] Wishlist
* [ ] Product reviews
* [ ] Ratings
* [ ] Coupon system
* [ ] Discount system
* [ ] Shipping integration
* [ ] Email notifications
* [ ] Order tracking
* [ ] Invoice generation
* [ ] Refund management
* [ ] Customer support
* [ ] Analytics dashboard

---

# Learning Progress

## Django

* [x] Django project structure
* [x] Django apps
* [x] Models
* [x] Migrations
* [x] Relationships
* [x] QuerySets
* [x] Django REST Framework
* [x] Serializers
* [x] APIViews
* [x] Authentication
* [x] JWT
* [x] Permissions
* [x] File uploads
* [x] Inventory management
* [x] Order management
* [x] Payment integration
* [x] Webhooks
* [x] Management commands
* [x] AI API integration
* [x] Controlled AI tools

## Frontend

* [x] HTML
* [x] CSS
* [x] Bootstrap
* [x] JavaScript
* [x] REST API integration
* [x] JWT frontend handling
* [x] Dynamic product rendering
* [x] Cart interactions
* [x] Checkout interactions
* [x] Razorpay Checkout
* [x] AI chat UI

## Still Learning

* [ ] Advanced Django architecture
* [ ] PostgreSQL
* [ ] AWS
* [ ] Docker
* [ ] Automated testing
* [ ] React
* [ ] Advanced JavaScript
* [ ] TypeScript
* [ ] CI/CD
* [ ] Production monitoring
* [ ] Advanced AI integrations

---

# Project Completion Goal

The final goal is to turn Ornament Store into a professional portfolio-level full-stack ecommerce application demonstrating:

* Python
* Django
* Django REST Framework
* JWT authentication
* Database design
* REST APIs
* Ecommerce architecture
* Inventory management
* Shopping cart
* Checkout
* Razorpay payments
* Webhooks
* AI integration
* Gemini
* AI tool calling
* Natural-language product discovery
* Responsive frontend
* React
* PostgreSQL
* AWS
* Gunicorn
* Nginx
* HTTPS
* Git/GitHub
* Production deployment
* Security
* Testing
* Professional UI/UX

The project should ultimately demonstrate the ability to build, deploy, and maintain a real-world full-stack ecommerce application rather than only a basic CRUD project.

---

# Daily Progress

## 2026-10-03

* [x] Completed Razorpay payment integration
* [x] Completed payment verification
* [x] Completed payment expiration handling
* [x] Completed Razorpay webhook integration
* [x] Tested webhook delivery successfully
* [x] Removed temporary debug logging
* [x] Completed final payment system check
* [x] Committed payment integration

## 2026-10-08

* [x] Completed AI Jewellery Assistant
* [x] Integrated Gemini API
* [x] Implemented controlled product catalogue tools
* [x] Implemented natural-language product discovery
* [x] Implemented budget-based recommendations
* [x] Implemented category/product recommendations
* [x] Implemented multi-turn conversation
* [x] Implemented product detail follow-up
* [x] Implemented AI safety protections
* [x] Implemented AI error handling
* [x] Completed AI chat frontend
* [x] Completed AI product recommendation cards
* [x] Completed AI testing
* [x] Completed Phase 9

---

# Overall Progress


Phase 1   ████████████████████ 100%
Phase 2   ██████████████████░░  90%
Phase 3   ████████████████████ 100%
Phase 4   ████████████████████ 100%
Phase 5   ████████████████████ 100%
Phase 6   ████████████████████ 100%
Phase 7   ████████████████████ 100%
Phase 8   ████████████████████ 100%
Phase 9   ████████████████████ 100%
Phase 10  ░░░░░░░░░░░░░░░░░░░░   0%
Phase 11  ░░░░░░░░░░░░░░░░░░░░   0%
Phase 12  ░░░░░░░░░░░░░░░░░░░░   0%
Phase 13  ░░░░░░░░░░░░░░░░░░░░   0%
Phase 14  ░░░░░░░░░░░░░░░░░░░░   0%


### Major Milestones Completed

* [x] Django project setup
* [x] Custom authentication
* [x] Product catalogue
* [x] Product search/filtering
* [x] Professional frontend
* [x] Shopping cart
* [x] Checkout
* [x] Order management
* [x] Inventory reservation
* [x] Razorpay integration
* [x] Razorpay payment verification
* [x] Razorpay webhook
* [x] Payment expiration handling
* [x] Gemini AI integration
* [x] Controlled AI product search
* [x] AI product recommendations
* [x] AI multi-turn conversation
* [x] AI chat frontend

**Current milestone: Phase 9 completed.**

**Next major milestone: Admin Dashboard → Production Deployment → React Migration.**
