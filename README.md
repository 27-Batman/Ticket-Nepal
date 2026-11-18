# Ticket Nepal

A full-stack movie ticket booking web application. Users can browse now-playing movies (sourced from TMDB and locally added movies), view details and trailers, choose showtimes and seats, book tickets, pay through eSewa, download PDF tickets, and request refunds. Administrators can manage movies, showtimes, bookings, and refunds from a protected dashboard.

## Project Overview

Ticket Nepal is built as a monorepo with two separate applications:

- `backend/` — Node.js + Express REST API backed by MongoDB (Mongoose), secured with Clerk, with Inngest background jobs and eSewa payment integration.
- `frontend/` — React 19 + Vite + Tailwind CSS SPA with React Router and Clerk authentication.

Media assets (posters, backdrops, cast images, videos) uploaded by admins are stored on the backend under `backend/uploads/` and served as static files.

## Key Features

### User Features

- Registration and login via Clerk
- Browse now-showing movies (TMDB + locally added movies)
- View movie details, backdrop, runtime, rating, and YouTube trailer
- View available showtimes grouped by date
- Interactive seat selection (max 5 seats per booking) with occupied-seat tracking
- Create bookings and complete payment through eSewa
- Booking history ("My Bookings") with payment status
- Downloadable PDF e-ticket with QR codes per seat
- Refund request (allowed when the show is more than 2 hours away)
- Add/remove favorite movies
- View and post movie reviews/ratings; delete own reviews

### Admin Features

- Admin role verification through Clerk private metadata
- Dashboard with total bookings, total revenue, active shows, and total users
- Add movies (poster, backdrop, cast images, genres, runtime, YouTube trailer)
- Add shows/showtimes with ticket price (TMDB or locally added movies)
- List shows with booking counts and earnings
- Delete shows (blocked when paid bookings exist)
- List all bookings with user and show details
- View refund requests and approve/mark them complete

### Other

- Inngest background functions: Clerk user sync (create/update/delete) and automatic seat release + booking deletion 10 minutes after an unpaid booking
- Static serving of uploaded media under `/uploads`
- Vercel deployment configuration for both frontend and backend

## Technology Stack

### Frontend

- React 19
- Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React Router DOM v7
- Clerk React (`@clerk/clerk-react`)
- Axios
- React Hot Toast / React Toastify
- Lucide React icons
- html2canvas + jsPDF (PDF ticket generation)
- qrcode.react

### Backend

- Node.js (ES modules)
- Express 5
- MongoDB + Mongoose
- Clerk SDK/Express (`@clerk/clerk-sdk-node`, `@clerk/express`)
- Inngest
- Multer (file uploads)
- Axios (TMDB API calls)
- crypto / crypto-js (eSewa signature generation)
- dotenv, cors

### External Services

- TMDB API (movie details, credits, videos, now playing)
- Clerk (authentication and user management)
- eSewa (payment gateway, sandbox/test endpoint)
- MongoDB (local or Atlas)

## Project Structure

```text
Ticket-Nepal/
├── .gitignore
├── package.json
├── README.md
├── backend/
│   ├── .env
│   ├── index.js
│   ├── package.json
│   ├── server.js
│   ├── vercel.json
│   ├── configs/
│   │   └── db.js
│   ├── controllers/
│   │   ├── AddMovieController.js
│   │   ├── adminControllers.js
│   │   ├── BookingControllers.js
│   │   ├── paymentController.js
│   │   ├── reviewController.js
│   │   ├── ShowController.js
│   │   └── userControllers.js
│   ├── inngest/
│   │   └── index.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── authUser.js
│   ├── models/
│   │   ├── AddMovie.js
│   │   ├── Booking.js
│   │   ├── Movies.js
│   │   ├── Refund.js
│   │   ├── Review.js
│   │   ├── Show.js
│   │   └── User.js
│   ├── routs/
│   │   ├── addMovieRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── showRoutes.js
│   │   └── userRoutes.js
│   ├── uploads/
│   │   ├── backdrops/
│   │   ├── cast/
│   │   ├── posters/
│   │   └── videos/
│   └── utils/
│       └── esewa.js
└── frontend/
    ├── .env
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── vercel.json
    ├── vite.config.js
    ├── public/
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── context/
        │   └── AppContext.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Movies.jsx
        │   ├── MovieDetails.jsx
        │   ├── SeatLayout.jsx
        │   ├── Favourite.jsx
        │   ├── MyBooking.jsx
        │   └── admin/
        │       ├── AddMovie.jsx
        │       ├── AddShows.jsx
        │       ├── Dashbord.jsx
        │       ├── Layout.jsx
        │       ├── ListBooking.jsx
        │       └── ListShows.jsx
        ├── components/
        └── lib/
```

The project has separate `frontend/` and `backend/` directories. There is also a minimal root `package.json` containing `react` and `vite`; the actual application dependencies live in `frontend/package.json` and `backend/package.json`.

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB (local instance) or a MongoDB Atlas connection string
- A Clerk account (publishable + secret keys)
- A TMDB API read access token (bearer token)
- eSewa merchant credentials (test credentials are already referenced in code; replace for production)

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/27-Batman/Ticket-Nepal.git
cd Ticket-Nepal
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env` (see [Environment Variables](#environment-variables)).

Start the backend in development mode:

```bash
npm run server
```

Or in production mode:

```bash
npm start
```

The backend runs on `http://localhost:3000` by default (configurable via `PORT`).

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env` (see [Environment Variables](#environment-variables)).

Start the frontend dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

### 4. Run both applications

Open two terminals:

```bash
# Terminal 1
cd backend
npm run server
```

```bash
# Terminal 2
cd frontend
npm run dev
```

Then open `http://localhost:5173`.

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/movieticket_db

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

TMDB_API_KEY=your_tmdb_bearer_token

ESEWA_SECRET_KEY=your_esewa_secret_key
ESEWA_MERCHANT_CODE=EPAYTEST

BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

Backend variable names:

- `PORT` — backend listen port (defaults to 3000)
- `MONGODB_URI` — MongoDB connection string
- `CLERK_PUBLISHABLE_KEY` — Clerk publishable key
- `CLERK_SECRET_KEY` — Clerk secret key
- `INNGEST_EVENT_KEY` — Inngest event key
- `INNGEST_SIGNING_KEY` — Inngest signing key
- `TMDB_API_KEY` — TMDB API bearer token
- `ESEWA_SECRET_KEY` — eSewa HMAC secret key
- `ESEWA_MERCHANT_CODE` — eSewa merchant/product code
- `BACKEND_URL` — backend base URL (used for callbacks)
- `FRONTEND_URL` — frontend base URL (used for CORS and redirects)

### Frontend (`frontend/.env`)

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_CURRENCY=Rs.
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_TMDB_BASE_URL=https://image.tmdb.org/t/p/original
```

Frontend variable names:

- `VITE_BACKEND_URL` — backend API base URL (also used for uploaded media URLs)
- `VITE_CURRENCY` — currency symbol shown in the UI
- `VITE_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
- `VITE_TMDB_BASE_URL` — TMDB image base URL

Note: `frontend/.env` in this repository also contains an `ESEWA_SECRET_KEY` entry. It is not used by the frontend code and should not be shipped to the browser; keep payment secrets on the backend only.

## Database Configuration

- Database: MongoDB
- Connection: configured through `MONGODB_URI` in `backend/.env`
- Default local URI: `mongodb://127.0.0.1:27017/movieticket_db`
- Mongoose models: `User`, `Movie`, `AddMovie`, `Show`, `Booking`, `Review`, `Refund`

To use MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

## API Documentation (Summary)

Base URL: `http://localhost:3000`

### Shows

- `GET /api/show/now-playing` — list TMDB now-playing + locally added movies
- `POST /api/show/add` — create showtimes for a movie (admin)
- `GET /api/show/all` — list movies with upcoming shows
- `GET /api/show/:movieID` — single movie + showtimes

### Bookings

- `POST /api/booking/create` — create a booking (auth required)
- `GET /api/booking/seats/:showID` — occupied seats for a show

### Movies (admin uploads)

- `POST /api/movies/add` — upload a movie with images/cast/trailer

### Admin

- `GET /api/admin/is-admin` — check admin role (auth required)
- `GET /api/admin/dashboard` — dashboard stats (admin)
- `GET /api/admin/all-shows` — shows with booking/earnings summary (admin)
- `GET /api/admin/all-bookings` — all bookings (admin)
- `DELETE /api/admin/delete-show/:id` — delete a show (admin)
- `GET /api/admin/refund-details/:bookingId` — refund request details (admin)

### Users

- `GET /api/users/bookings` — current user's bookings (auth required)
- `POST /api/users/favorite-movie` — toggle favorite (auth required)
- `GET /api/users/favorite` — list favorite movies (auth required)
- `POST /api/users/refund-request` — submit refund request (auth required)
- `GET /api/users/all` — list all users
- `GET /api/users/me` — current user (auth required)

### Payments

- `POST /api/payment/esewa/init` — initialize eSewa payment
- `GET /api/payment/esewa/success` — eSewa success callback
- `GET /api/payment/esewa/failure` — eSewa failure callback

### Reviews

- `GET /api/reviews/:movieID` — list reviews for a movie
- `POST /api/reviews/add` — add a review (auth required)
- `DELETE /api/reviews/delete/:id` — delete own review (auth required)

### Inngest

- `POST/GET /api/inngest` — Inngest serve endpoint

## Usage Instructions

1. Start the backend and frontend as described above.
2. Open `http://localhost:5173`.
3. Sign in with Clerk.
4. To make a user an admin, set `privateMetadata.role = "admin"` for that user in the Clerk dashboard.
5. Browse movies, open a movie, select a date/showtime and seats, then confirm booking.
6. Pay pending bookings from "My Bookings" via eSewa (sandbox).
7. Download the PDF ticket for paid bookings.
8. Admins can access `/admin` to manage movies, shows, bookings, and refunds.

## Screenshots

No screenshots are currently included in the repository. To add them, place images under a folder such as `docs/screenshots/` and reference them here, for example:

```markdown
![Home](docs/screenshots/home.png)
```

## Future Improvements

- Add search/filter and pagination for movies
- Add automated tests for backend and frontend
- Improve error handling and validation
- Support additional payment providers
- Add email/SMS booking confirmations
- Add seat map customization and multiple cinema halls
- Add CI/CD and production environment documentation

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m "feat: describe your change"`.
4. Push to your fork and open a pull request.

## License

No license file is currently included in this repository. Add a `LICENSE` file (for example MIT) before distributing or using this project commercially.

## Author / Contact

- GitHub: [27-Batman](https://github.com/27-Batman)
- Email: anuragsing092@gmail.com

## Additional Information

- Project type: not specified
- Deployment URL: not documented (Vercel configuration files are included for both frontend and backend)
- Repository: https://github.com/27-Batman/Ticket-Nepal.git
