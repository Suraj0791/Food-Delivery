# SurajEats - Food Delivery Platform

Welcome to SurajEats, a comprehensive food delivery platform built with a modern tech stack including React, TypeScript, Vite, Node.js, Express, MongoDB, and more. This platform allows users to browse restaurants, add menu items to their cart, and place orders seamlessly.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- User Authentication (Signup, Login, Email Verification, Password Reset)
- Browse Restaurants and Menus
- Add Menu Items to Cart
- Checkout and Payment Integration with Stripe
- Admin Panel for Managing Restaurants, Menus, and Orders
- Responsive Design

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Email**: Nodemailer
- **Payment**: Stripe
- **State Management**: Zustand
- **Linting**: ESLint
- **Testing**: Jest (if applicable)

## Project Structure
client/ ├── .gitignore ├── components.json ├── eslint.config.js ├── index.html ├── package.json ├── postcss.config.js ├── public/ ├── README.md ├── src/ │ ├── admin/ │ ├── App.css │ ├── App.tsx │ ├── assets/ │ ├── auth/ │ ├── components/ │ ├── index.css │ ├── layout/ │ ├── lib/ │ ├── main.tsx │ ├── schema/ │ ├── store/ │ ├── types/ │ ├── vite-env.d.ts ├── tailwind.config.js ├── tsconfig.app.json ├── tsconfig.json ├── tsconfig.node.json ├── vite.config.ts server/ ├── .env ├── .gitignore ├── combined.log ├── nodemon.json ├── package.json ├── src/ │ ├── config/ │ ├── controllers/ │ ├── db/ │ ├── models/ │ ├── repositories/ │ ├── routes/ │ ├── services/ │ ├── utils/ ├── tsconfig.json ├── uploads/


## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Stripe Account for Payment Integration

### Environment Variables

Create a `.env` file in the `server` directory and add the following environment variables:
MONGO_URI=<your_mongodb_uri> JWT_SECRET=<your_jwt_secret> SMTP_HOST=<your_smtp_host> SMTP_PORT=<your_smtp_port> SMTP_USER=<your_smtp_user> SMTP_PASS=<your_smtp_pass> STRIPE_SECRET_KEY=<your_stripe_secret_key> FRONTEND_URL=http://localhost:5173


### Installation

1. **Clone the repository:**

```sh
git clone https://github.com/your-username/surajeats.git
cd surajeats

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

npm run seed

cd server
npm run dev

cd client
npm run dev

The application should now be running at http://localhost:5173.

Usage
User Authentication
Signup: Create a new account.
Login: Access your account.
Email Verification: Verify your email address.
Password Reset: Reset your password if you forget it.
Browsing and Ordering
Browse Restaurants: View available restaurants and their menus.
Add to Cart: Add menu items to your cart.
Checkout: Proceed to checkout and make a payment using Stripe.
Admin Panel
Manage Restaurants: Add, update, or delete restaurants.
Manage Menus: Add, update, or delete menu items.
Manage Orders: View and update order statuses.
API Endpoints
User Routes
POST /api/v1/user/signup: Signup a new user.
POST /api/v1/user/login: Login a user.
POST /api/v1/user/verify-email: Verify user email.
POST /api/v1/user/forgot-password: Request password reset.
POST /api/v1/user/reset-password: Reset user password.
Restaurant Routes
GET /api/v1/restaurant: Get all restaurants.
POST /api/v1/restaurant: Create a new restaurant.
PUT /api/v1/restaurant/:id: Update a restaurant.
DELETE /api/v1/restaurant/:id: Delete a restaurant.
Menu Routes
GET /api/v1/menu: Get all menus.
POST /api/v1/menu: Create a new menu.
PUT /api/v1/menu/:id: Update a menu.
DELETE /api/v1/menu/:id: Delete a menu.
Order Routes
GET /api/v1/order: Get all orders.
POST /api/v1/order/checkout: Create a checkout session.
POST /api/v1/order/webhook: Stripe webhook for payment events.
Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

License
This project is licensed under the MIT License. See the LICENSE file for details.

