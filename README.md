# Online Job Fair Registration - Backend

## Overview
The **Online Job Fair Registration** system is a backend application that allows users to register, log in, and manage interview session bookings for a job fair. The system also provides administrative functionalities for managing all user bookings.

## Features
### User Features:
1. **User Registration**: Users can register by providing their name, telephone number, email, and password.
2. **User Authentication**:
   - Users can log in using their email and password.
   - Users can log out from the system.
3. **Interview Booking**:
   - Users can book up to **three** interview sessions.
   - Booking requires selecting a **date (May 10th - May 13th, 2022)** and choosing preferred companies.
   - A company list is provided, containing company name, address, website, description, and telephone number.
4. **View Bookings**: Users can view their interview session bookings.
5. **Edit Bookings**: Users can update their interview session bookings.
6. **Delete Bookings**: Users can delete their interview session bookings.

### Admin Features:
1. **View All Bookings**: Admins can view any interview session bookings.
2. **Edit Any Booking**: Admins can edit any user’s interview session bookings.
3. **Delete Any Booking**: Admins can delete any user’s interview session bookings.

## Technologies Used
- **Node.js** - JavaScript runtime
- **Express.js** - Backend framework
- **MongoDB** - NoSQL database for storing users, companies, and bookings
- **JWT (JSON Web Token)** - Authentication and authorization
- **Mongoose** - Object Data Modeling (ODM) for MongoDB
- **bcrypt.js** - Password hashing
- **dotenv** - Environment variable management

## API Endpoints
### Authentication
- **POST /api/v1/auth/register** → Register a new user
- **POST /api/v1/auth/login** → Login a registered user
- **GET /api/v1/auth/logout** → Logout user

### Interview Bookings
- **POST /api/v1/bookings** → Book an interview session (up to 3 bookings per user)
- **GET /api/v1/bookings** → View all bookings (Admin only)
- **GET /api/v1/bookings/:id** → View user-specific booking
- **PUT /api/v1/bookings/:id** → Edit user’s booking
- **DELETE /api/v1/bookings/:id** → Delete user’s booking

