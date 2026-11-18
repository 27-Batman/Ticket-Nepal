import { clerkClient } from "@clerk/express";
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";
import Refund from "../models/Refund.js"; 

// 1. Admin verification
export const isAdmin = async (req, res) => {
  try {
    const { userId } = req.auth();
    if (!userId) return res.json({ success: true, isAdmin: false });

    const user = await clerkClient.users.getUser(userId);
    const isAdmin = user.privateMetadata?.role === "admin";

    res.json({ 
      success: true, 
      isAdmin, 
      role: user.privateMetadata?.role || "user" 
    });
  } catch (error) {
    console.error("isAdmin Error:", error.message);
    res.json({ success: true, isAdmin: false });
  }
};

// 2. Dashboard Stats
export const getAdminDashboardData = async (req, res) => {
  try {
    const bookings = await Booking.find({ isPaid: true });
    const activeShows = await Show.find({ 
      showTime: { $gte: new Date() } 
    }).populate("Movie");
    const totalUsers = await Booking.distinct("user");

    res.json({
      success: true,
      dashboardData: {
        totalBookings: bookings.length,
        totalEarnings: bookings.reduce((acc, b) => acc + (b.amount || 0), 0),
        activeShows,
        totalUsers: totalUsers.length,
      }
    });
  } catch (error) {
    console.error("Dashboard Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// 3. All Shows Summary
export const getAllShowsAdmin = async (req, res) => {
  try {
    const shows = await Show.find({}).populate("Movie");
    const paidBookings = await Booking.find({ isPaid: true });

    const finalData = shows.map(show => {
      const related = paidBookings.filter(b => String(b.show) === String(show._id));
      
      return {
        _id: show._id,
        movieName: show.Movie?.title || "N/A",
        showTime: show.showTime,
        totalBookings: related.reduce((acc, b) => acc + (b.seats?.length || 0), 0),
        totalEarnings: related.reduce((acc, b) => acc + (b.amount || 0), 0)
      };
    });
    res.json({ success: true, shows: finalData });
  } catch (error) {
    console.error("All Shows Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// 4. Delete Show
export const deleteShowAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    const hasPaidBookings = await Booking.findOne({ show: id, isPaid: true });
    if (hasPaidBookings) {
      return res.json({ 
        success: false, 
        message: "Cannot delete show with paid bookings." 
      });
    }

    const deletedShow = await Show.findByIdAndDelete(id);
    if (!deletedShow) {
      return res.json({ success: false, message: "Show not found" });
    }

    res.json({ success: true, message: "Show deleted successfully." });
  } catch (error) {
    console.error("Delete Show Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// 5. All Bookings List
export const getAllBookingsAdmin = async (req, res) => {
  try {
    const rawBookings = await Booking.find({}).sort({ createdAt: -1 });
    
    const bookings = await Promise.all(rawBookings.map(async (b) => {
      const show = await Show.findById(b.show).populate("Movie");
      let userName = "Unknown";
      
      try {
        const u = await clerkClient.users.getUser(b.user);
        userName = `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.emailAddresses[0].emailAddress;
      } catch (err) {
        console.log("Clerk fetch skipped for user:", b.user);
      }
      
      return { 
        ...b._doc, 
        User: { name: userName }, 
        Show: show 
      };
    }));
    
    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Get Bookings Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// 6. Get Refund Details
export const getRefundDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const refund = await Refund.findOne({ bookingId });
    
    if (!refund) {
      return res.json({ success: false, message: "No refund request found." });
    }
    
    res.json({ success: true, refund });
  } catch (error) {
    console.error("Get Refund Details Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// 7. Complete Refund
export const completeRefund = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Update Refund entry status
    const updatedRefund = await Refund.findOneAndUpdate(
      { bookingId }, 
      { status: "Approved" },
      { new: true }
    );

    if (!updatedRefund) {
      return res.json({ success: false, message: "Refund record not found." });
    }

    // Update Booking status
    await Booking.findByIdAndUpdate(bookingId, { 
      isPaid: false, 
      refundRequested: true 
    });

    res.json({ success: true, message: "Refund successfully processed." });
  } catch (error) {
    console.error("Complete Refund Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};