# E-Commerce Customer Churn Analytics System

A full-stack customer churn analytics platform built to help businesses identify churn patterns, analyze customer behavior, and gain actionable insights through interactive dashboards.

## Features

### Backend Features

* Customer Management APIs for handling customer profiles and churn-related data.
* Analytics endpoints to generate churn insights and customer retention statistics.
* JWT-based authentication and authorization.
* Password hashing using bcryptjs.
* Rate limiting to prevent abuse.
* Security headers using Helmet.
* Request logging with Morgan.
* Centralized error handling middleware.

### Frontend Features

* Responsive landing page introducing the platform.
* User registration and login functionality.
* Authentication state management using Context API.
* Protected application layout and routing.
* Interactive dashboard for customer churn insights.
* Customer listing page with detailed customer views.
* Integration with backend APIs for real-time data retrieval.
* Global styling and reusable UI components.

## Tech Stack

### Frontend

* React
* Vite
* Context API
* JavaScript (ES6+)
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Security & Utilities

* JWT
* bcryptjs
* Helmet
* Express Rate Limit
* Morgan

## API Documentation

The API endpoints are documented using Postman.

👉 View Postman API Documentation:
https://documenter.getpostman.com/view/50839376/2sBXwntsPn

## Getting Started

### Prerequisites

* Node.js (v14 or higher)
* MongoDB instance running locally or on MongoDB Atlas

### Installation

1. Clone the repository.

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

4. Configure environment variables.

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Running the Application

### Start Backend

```bash
cd backend
npm run dev
```

Or:

```bash
npm start
```

Backend runs on:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Local Routes to Test

### Authentication

* POST `/auth/register`
* POST `/auth/login`

### Customers

* GET `/customers`
* GET `/customers/churned`
* GET `/customers/high-value`

### Analytics

* GET `/analytics/customers/top-buyers`
* GET `/analytics/customers/churn-analysis`
* GET `/analytics/customers/retention`

### JWT Testing

* POST `/jwt/generate-token`
* GET `/jwt/profile`

### Middleware & Security

* GET `/middleware/rate-limit`
* GET `/middleware/error-handler`

## Frontend Pages

* Landing Page
* Login Page
* Registration Page
* Dashboard
* Customers List
* Customer Details

## Project Structure

```text
backend/
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── services/
```

## Future Improvements

* Data visualization charts and graphs.
* Role-based access control.
* Export analytics reports.
* Search and filtering for customers.
* Predictive churn modeling using machine learning.
