import express from 'express';
import {
  getFavoriteMovies,
  getUserBookings,
  updateFavoriteMovie,
  requestRefund // Import the new controller
} from '../controllers/userControllers.js';

const userRouter = express.Router();

// Existing Routes
userRouter.get('/bookings', getUserBookings);
userRouter.post('/favorite-movie', updateFavoriteMovie);
userRouter.get('/favorite', getFavoriteMovies);

// NEW: Refund Request Route
// This matches the axios.post("/api/users/refund-request", ...) in your frontend
userRouter.post('/refund-request', requestRefund);

export default userRouter;