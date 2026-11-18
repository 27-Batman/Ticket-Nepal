import { clerkClient } from "@clerk/express";
import Movie from "../models/Movies.js";
import Booking from "../models/Booking.js";
import Refund from "../models/Refund.js"; 

/**
 * GET USER BOOKINGS
 * Fetches all bookings for the logged-in Clerk user.
 */
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.auth().userId;
    console.log("Logged in userId:", userId);

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "show",
        populate: { path: "Movie" }, 
      })
      .sort({ createdAt: -1 });

    console.log("Bookings found:", bookings.length);

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

/**
 * UPDATE FAVORITE MOVIE
 * Updates Clerk user metadata to add/remove a movie from favorites.
 */
export const updateFavoriteMovie = async (req, res) => {
  try {
    const { movieID } = req.body;

    if (!movieID) {
      return res.status(400).json({
        success: false,
        message: "movieID is required",
      });
    }

    const userId = req.auth().userId; 
    const user = await clerkClient.users.getUser(userId);

    const favoriteMovies = Array.isArray(user.privateMetadata.favoriteMovies)
      ? user.privateMetadata.favoriteMovies
      : [];

    let updatedFavorites;

    if (favoriteMovies.includes(movieID)) {
      // remove
      updatedFavorites = favoriteMovies.filter((id) => id !== movieID);
    } else {
      // add
      updatedFavorites = [...favoriteMovies, movieID];
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        favoriteMovies: updatedFavorites,
      },
    });

    res.json({
      success: true,
      message: "Favorite movies updated successfully",
    });
  } catch (error) {
    console.error("Update favorite error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET FAVORITE MOVIES
 * Fetches movie details from the DB based on IDs stored in Clerk metadata.
 */
export const getFavoriteMovies = async (req, res) => {
  try {
    const userId = req.auth().userId; 
    const user = await clerkClient.users.getUser(userId);

    const favoriteMovies = Array.isArray(user.privateMetadata.favoriteMovies)
      ? user.privateMetadata.favoriteMovies
      : [];

    if (favoriteMovies.length === 0) {
      return res.json({ success: true, movies: [] });
    }

    const movies = await Movie.find({
      _id: { $in: favoriteMovies },
    });

    res.json({ success: true, movies });
  } catch (error) {
    console.error("Get favorite movies error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * REQUEST REFUND
 * Stores data in user_Refund table and updates Booking status.
 * Prevents multiple requests for the same booking ID/seats.
 */
export const requestRefund = async (req, res) => {
  try {
    const { bookingId, email, phone, reason } = req.body;
    const userId = req.auth().userId;

    // 1. Verify the booking exists and belongs to the user
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Checking if the 'user' field in Booking matches the clerk userId
    if (booking.user !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized: This is not your booking" });
    }

    // 2. STRICT CHECK: Check both Booking model flag AND the user_Refund table
    // This ensures that even if one fails, the other blocks duplicate requests.
    const existingRequest = await Refund.findOne({ bookingId });

    if (booking.refundRequested || existingRequest) {
      return res.status(400).json({ 
        success: false, 
        message: "A refund for this ID/Seat has already been requested. You cannot submit it again." 
      });
    }

    // 3. Create entry in user_Refund table
    const newRefund = new Refund({
      bookingId,
      userId,
      email,
      phone,
      reason,
      status: "Pending" // Default status
    });

    await newRefund.save();

    // 4. Update the Booking model to reflect the request (hides button on frontend)
    booking.refundRequested = true;
    await booking.save();

    res.json({ 
      success: true, 
      message: "Refund request submitted successfully! Our team will process it shortly." 
    });

  } catch (error) {
    // Handle database-level duplicate key error (MongoDB Error 11000)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Refund already exists for this booking ID." });
    }
    console.error("Refund Request Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};