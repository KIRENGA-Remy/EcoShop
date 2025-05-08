# E-Commerce Platform with Dual Payment System

# Overview
A full-stack e-commerce solution featuring traditional (Stripe) and cryptocurrency (Bitcoin) payment options. This platform provides complete product management, user authentication, and order processing capabilities.

Key Features
# Core Functionality
User Authentication: Secure signup, login, and profile management

Product Catalog: Browse, search, and filter products with pagination

Shopping Cart: Persistent cart functionality across sessions

Order Management: Complete order tracking and history

# Payment System
Dual Payment Options:

Traditional payments via Stripe (USD)

Cryptocurrency payments via blockchain integration (BTC)

Real-time Notifications: Instant payment confirmation

Admin Capabilities
Dashboard: Comprehensive analytics and overview

Product Management: CRUD operations for products

User Management: View and manage customer accounts

Order Processing: Update order status and track fulfillment

Technology Stack
# Frontend
Framework: React.js (Vite)

UI: Tailwind CSS + Headless UI

State Management: Zustand

Routing: React Router

Form Handling: React Hook Form

Payment Integration: Stripe.js, Bitcoin payment processor

# Backend
Framework: Node.js with Express

Database: MongoDB (Mongoose ODM)

Authentication: JWT with HTTP-only cookies

API: RESTful design with Basic Authentication

Payments: Stripe API, Blockchain payment processor

Real-time: WebSocket for payment notifications

Installation
Prerequisites
Node.js v18+

PstgresSQL using sequelize

Stripe API keys

Bitcoin payment processor credentials

# Backend Setup
Clone the repository

Navigate to backend directory:

cd backend
Install dependencies:

npm install
Create .env file:

env

DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
BTC_PAYMENT_API_KEY=your_bitcoin_api_key
PORT=4321
Start the server:

npm run dev
Frontend Setup
Navigate to frontend directory:

cd frontend
Install dependencies:

npm install
Create .env file:

env

VITE_API_BASE_URL=http://localhost:4321/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_BTC_PAYMENT_ID=your_bitcoin_payment_id
Start the development server:

npm run dev

# API Documentation
Authentication
POST /api/auth/register - User registration

POST /api/auth/login - User login

GET /api/auth/profile - Get user profile (protected)

Products
GET /api/products - Get all products (paginated)

GET /api/products/:id - Get single product

POST /api/products - Create product (admin)

PUT /api/products/:id - Update product (admin)

DELETE /api/products/:id - Delete product (admin)

Orders
POST /api/orders - Create new order

GET /api/orders - Get user orders

GET /api/orders/:id - Get order details

PUT /api/orders/:id/pay - Update payment status

GET /api/orders/all - Get all orders (admin)

Payment
POST /api/payment/stripe - Process Stripe payment

POST /api/payment/btc - Generate Bitcoin payment request

GET /api/payment/btc/:id - Check Bitcoin payment status

Deployment

# Backend
Set up production environment variables

Build and start:

npm run build
npm start
Recommended to use PM2 for process management

# Frontend
Build for production:

npm run build
Deploy the dist folder to your hosting provider (Netlify, Vercel, etc.)

# Future Enhancements
Multi-currency Support: Expand beyond USD and BTC

Enhanced Analytics: 
Detailed sales and customer reports

Inventory Management: 
Stock level tracking and alerts

Shipping Integration: 
Real-time shipping rates and tracking

Mobile App: 
Native applications for iOS and Android

# Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

# License
Distributed under the MIT License. See LICENSE for more information.

# Contact
Email - gitoliremy@gmail.com

Project Link: https://github.com/KIRENGA-Remy/EcoShop.git

Happy coding! ❤️