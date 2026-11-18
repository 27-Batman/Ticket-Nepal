# Ticket Nepal

A full-stack movie ticket booking web application built with React, Node.js, Express.js, and MongoDB.

Ticket Nepal allows users to browse movies, watch trailers, explore available showtimes, select seats, book tickets, and make payments through eSewa. Users can also manage their bookings, download PDF tickets, submit refund requests, and review movies.

The application also includes an administrative dashboard for managing movies, showtimes, bookings, and refund requests.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Database Configuration](#database-configuration)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Overview

Ticket Nepal is organized as a monorepo with two separate applications:

- **Frontend:** A single-page application built with React 19, Vite, and Tailwind CSS. It handles the user interface, movie browsing, seat selection, ticket booking, and administrative dashboard.
- **Backend:** A REST API developed using Node.js and Express.js. It handles application logic, database operations, authentication, payments, file uploads, and booking management.

MongoDB is used for data storage, while Clerk manages user authentication. The application also integrates TMDB for movie information, eSewa for payment processing, and Inngest for background tasks.

Movie posters, backdrops, cast images, and other uploaded media are stored on the backend and served through static file routes.

## Features

### User Features

- Register and log in using Clerk authentication.
- Browse currently showing movies from TMDB and locally added movies.
- View movie details, ratings, runtime, cast, backdrops, and trailers.
- Explore available showtimes organized by date.
- Select seats through an interactive seat selection interface.
- Book up to five seats in a single booking.
- Make payments through the eSewa payment gateway.
- View booking history and payment status.
- Download PDF tickets with individual QR codes for each seat.
- Submit refund requests for eligible bookings more than two hours before the show.
- Add and remove movies from favorites.
- Post movie reviews and ratings.
- Delete personal reviews.

### Admin Features

- Access a protected administrative dashboard.
- View total bookings, revenue, active shows, and registered users.
- Add movies with posters, backdrops, cast images, genres, runtime, and YouTube trailers.
- Create and manage movie showtimes.
- Set ticket prices for individual shows.
- View show listings, booking counts, and earnings.
- Access booking records with user and show information.
- Review refund requests and update their status.
- Delete shows when no paid bookings exist.

### Additional Functionality

- Automatic user synchronization through Inngest.
- Automatic release of seats and deletion of unpaid bookings after 10 minutes.
- Backend file uploads and static media serving.
- Integration with TMDB for movie information.
- eSewa sandbox payment integration.
- Vercel deployment configuration for frontend and backend.

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React 19, Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router DOM v7 |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | Clerk |
| API Requests | Axios |
| Background Jobs | Inngest |
| Movie Data | TMDB API |
| Payment Gateway | eSewa |
| File Uploads | Multer |
| PDF Generation | jsPDF, html2canvas |
| QR Code Generation | qrcode.react |
| Icons | Lucide React |
| Notifications | React Hot Toast, React Toastify |

## Project Structure

```text
Ticket-Nepal/
│
├── backend/
│   ├── configs/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── AddMovieController.js
│   │   ├── adminControllers.js
│   │   ├── BookingControllers.js
│   │   ├── paymentController.js
│   │   ├── reviewController.js
│   │   ├── ShowController.js
│   │   └── userControllers.js
│   │
│   ├── inngest/
│   │   └── index.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── authUser.js
│   │
│   ├── models/
│   │   ├── AddMovie.js
│   │   ├── Booking.js
│   │   ├── Movies.js
│   │   ├── Refund.js
│   │   ├── Review.js
│   │   ├── Show.js
│   │   └── User.js
│   │
│   ├── routs/
│   │   ├── addMovieRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── showRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── uploads/
│   │   ├── backdrops/
│   │   ├── cast/
│   │   ├── posters/
│   │   └── videos/
│   │
│   ├── utils/
│   │   └── esewa.js
│   │
│   ├── index.js
│   ├── server.js
│   ├── package.json
│   └── vercel.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   │   └── AppContext.jsx
│   │   ├── lib/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Movies.jsx
│   │   │   ├── MovieDetails.jsx
│   │   │   ├── SeatLayout.jsx
│   │   │   ├── Favourite.jsx
│   │   │   ├── MyBooking.jsx
│   │   │   └── admin/
│   │   │       ├── AddMovie.jsx
│   │   │       ├── AddShows.jsx
│   │   │       ├── Dashbord.jsx
│   │   │       ├── Layout.jsx
│   │   │       ├── ListBooking.jsx
│   │   │       └── ListShows.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── .gitignore
├── package.json
└── README.md
```

The structure above highlights the main application files and directories. Some supporting components and configuration files have been omitted.

## Installation and Setup

### Prerequisites

Before running the project, make sure you have:

- Node.js 18 or newer
- npm
- MongoDB (local installation or Atlas account)
- Clerk account
- TMDB API access token
- Inngest account
- eSewa merchant credentials for payment integration

### 1. Clone the Repository

```bash
git clone https://github.com/27-Batman/Ticket-Nepal.git
```

Navigate to the project directory:

```bash
cd Ticket-Nepal
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` directory and configure the required environment variables.

Start the development server:

```bash
npm run server
```

To start the backend in production mode:

```bash
npm start
```

The backend runs at:

```text
http://localhost:3000
```

### 3. Frontend Setup

Open another terminal from the project root and navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` directory and add the required frontend environment variables.

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

### 4. Build and Preview

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

To run ESLint:

```bash
npm run lint
```

## Environment Variables

The application requires environment variables for database connectivity, authentication, movie data, payment processing, and communication between the frontend and backend.

### Backend Configuration

Create `backend/.env`:

```env
PORT=3000

# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/movieticket_db

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# TMDB
TMDB_API_KEY=your_tmdb_bearer_token

# eSewa
ESEWA_SECRET_KEY=your_esewa_secret_key
ESEWA_MERCHANT_CODE=EPAYTEST

# Application URLs
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration

Create `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_CURRENCY=Rs.
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_TMDB_BASE_URL=https://image.tmdb.org/t/p/original
```

### Environment Variable Reference

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGODB_URI` | MongoDB connection string |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `INNGEST_EVENT_KEY` | Inngest event key |
| `INNGEST_SIGNING_KEY` | Inngest signing key |
| `TMDB_API_KEY` | TMDB API bearer token |
| `ESEWA_SECRET_KEY` | eSewa payment secret |
| `ESEWA_MERCHANT_CODE` | eSewa merchant code |
| `BACKEND_URL` | Backend application URL |
| `FRONTEND_URL` | Frontend application URL |
| `VITE_BACKEND_URL` | Backend API URL used by frontend |
| `VITE_CURRENCY` | Currency symbol displayed in the application |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk frontend publishable key |
| `VITE_TMDB_BASE_URL` | TMDB image base URL |

**Security:** Never commit `.env` files or expose private credentials in the repository. Variables prefixed with `VITE_` are included in the frontend bundle and should never contain secret keys. Keep Clerk secret keys and eSewa payment credentials on the backend.

## Database Configuration

Ticket Nepal uses MongoDB with Mongoose for database operations.

You can use either a local MongoDB installation or MongoDB Atlas.

**Local MongoDB**

```env
MONGODB_URI=mongodb://127.0.0.1:27017/movieticket_db
```

**MongoDB Atlas**

1. Create an account on MongoDB Atlas.
2. Create a cluster.
3. Configure database access and network permissions.
4. Copy your MongoDB connection string.
5. Add the connection string to `backend/.env`.

The application uses the following Mongoose models:

- User
- Movie
- AddMovie
- Show
- Booking
- Review
- Refund

The database connection is configured in `backend/configs/db.js`.

## API Endpoints

The backend provides REST API endpoints for movie listings, showtimes, bookings, payments, reviews, and administrative operations.

**Base URL**

```text
http://localhost:3000
```

### Movies and Shows

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/show/now-playing` | Get currently showing movies |
| POST | `/api/show/add` | Create movie showtimes |
| GET | `/api/show/all` | Get movies with upcoming shows |
| GET | `/api/show/:movieID` | Get movie details and showtimes |
| POST | `/api/movies/add` | Add a movie with uploaded media |

### Bookings

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/booking/create` | Create a booking |
| GET | `/api/booking/seats/:showID` | Get occupied seats |

### Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/bookings` | Get current user's bookings |
| POST | `/api/users/favorite-movie` | Add or remove a favorite |
| GET | `/api/users/favorite` | Get favorite movies |
| POST | `/api/users/refund-request` | Submit a refund request |
| GET | `/api/users/all` | Get all users |
| GET | `/api/users/me` | Get current user information |

### Administration

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/is-admin` | Check administrator access |
| GET | `/api/admin/dashboard` | Get dashboard statistics |
| GET | `/api/admin/all-shows` | Get shows and earnings |
| GET | `/api/admin/all-bookings` | Get all bookings |
| DELETE | `/api/admin/delete-show/:id` | Delete a show |
| GET | `/api/admin/refund-details/:bookingId` | Get refund details |

### Payments

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payment/esewa/init` | Initialize eSewa payment |
| GET | `/api/payment/esewa/success` | Handle successful payment callback |
| GET | `/api/payment/esewa/failure` | Handle failed payment callback |

### Reviews

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reviews/:movieID` | Get movie reviews |
| POST | `/api/reviews/add` | Submit a movie review |
| DELETE | `/api/reviews/delete/:id` | Delete a personal review |

### Inngest

| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/inngest` | Inngest background functions endpoint |

Protected routes require authentication, and administrative routes require administrator privileges.

## Usage

After starting both applications:

1. Open `http://localhost:5173` in your browser.
2. Register or log in using Clerk.
3. Browse the available movies.
4. Select a movie and view its details.
5. Choose a showtime and select your preferred seats.
6. Confirm the booking.
7. Open the My Bookings section to complete payment through eSewa.
8. Download the PDF ticket after successful payment.

### Admin Access

Administrator access is managed through Clerk's private metadata.

To grant admin privileges:

1. Open the Clerk Dashboard.
2. Select the relevant user.
3. Update the user's private metadata with:

```json
{
  "role": "admin"
}
```

4. Sign in using the administrator account.
5. Access the admin dashboard at:

```text
http://localhost:5173/admin
```

Administrators can manage movies, showtimes, bookings, and refund requests through the dashboard.

## Future Improvements

Some areas that could be improved in future versions include:

- Movie search, filtering, and pagination.
- Automated frontend and backend testing.
- Improved input validation and error handling.
- Support for additional payment providers.
- Email and SMS booking confirmations.
- Multiple cinema halls and customizable seat layouts.
- More detailed administrative analytics.
- CI/CD integration and deployment documentation.

## Contributing

If you want to contribute to the project, you can follow these steps:

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Make your changes and commit them:

   ```bash
   git commit -m "Describe your changes"
   ```

4. Push the branch:

   ```bash
   git push origin feature/your-feature
   ```

5. Open a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

You are free to use, modify, and distribute this software in accordance with the terms of the license.

## Author

**Anurag Singh**

- GitHub: [27-Batman](https://github.com/27-Batman)
- Email: anuragsing092@gmail.com

**Repository:** [Ticket Nepal](https://github.com/27-Batman/Ticket-Nepal)
