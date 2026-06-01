# E-Commerce Customer Churn Analytics API

This is a RESTful API built with Node.js, Express, and MongoDB for analyzing e-commerce customer churn data.

## Features
- **Customer Management**: Endpoints to manage customer profiles and churn data.
- **Analytics**: Retrieve insights and churn predictions based on customer data.
- **Security**: Includes authentication, rate limiting, and standard security headers.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Security & Utils**: JWT, bcryptjs, Helmet, Express Rate Limit, Morgan

## API Documentation
The API endpoints are thoroughly documented using Postman. You can view the complete API documentation here:

👉 **[View Postman API Documentation](https://documenter.getpostman.com/view/50839376/2sBXwntsPn)**

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance running locally or on the cloud (e.g., MongoDB Atlas)

### Installation

1. Clone the repository.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables. Create a `.env` file in the `backend` directory with your configuration (e.g., `PORT`, `MONGODB_URI`, `JWT_SECRET`).

5. Start the development server:
   ```bash
   npm run dev
   ```
   Or start the production server:
   ```bash
   npm start
   ```

The server will start (default port is usually 5000 or 3000), and you can test the endpoints as described in the Postman documentation.