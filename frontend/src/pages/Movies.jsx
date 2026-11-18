import React, { useEffect, useState } from "react";
import axios from "axios";
import BlurCircle from "../components/BlurCircle";
import { StarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext"; // Import context

const Movies = () => {
  const navigate = useNavigate();
  const { image_base_url } = useAppContext(); // Get the base URL (http://localhost:3000)
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const currency = import.meta.env.VITE_CURRENCY || "Rs";

  // --- IMAGE HELPER ---
  const getPosterUrl = (movie) => {
    const path = movie.poster_path || movie.poster;
    if (!path) return "/placeholder.jpg";

    // If it's a local upload (contains 'uploads' or doesn't start with /)
    if (path.includes('uploads') || !path.startsWith('/')) {
      const cleanPath = path.replace(/\\/g, '/').replace(/^\//, "");
      const base = image_base_url?.replace(/\/$/, "");
      return `${base}/${cleanPath}`;
    }

    // Otherwise, it's TMDB
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Use the baseURL set in AppContext via axios defaults if configured, 
        // or keep your absolute URL
        const { data } = await axios.get("http://localhost:3000/api/show/all");

        if (data.success) {
          setMovies(data.shows);
        }
      } catch (error) {
        console.error("Error fetching movies:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (movies.length === 0) return <div className="flex items-center justify-center h-screen">No shows available</div>;

  return (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      <h1 className="text-lg font-medium my-4 border-b border-white/10 pb-2">Now Showing</h1>

      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {movies.map((movie) => {
          const minPrice = movie.shows && movie.shows.length > 0
            ? Math.min(...movie.shows.map((s) => s.showprice))
            : null;

          return (
            <div
              key={movie._id}
              className="w-55 rounded-xl overflow-hidden bg-primary/10 border border-primary/20 hover:-translate-y-2 transition-all duration-300 shadow-lg group"
            >
              {/* Poster */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={getPosterUrl(movie)}
                  alt={movie.title}
                  className="h-full w-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
                  onClick={() => {
                    navigate(`/movies/${movie._id}`);
                    window.scrollTo(0, 0);
                  }}
                  onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                />
              </div>

              {/* Title */}
              <p className="font-bold p-2 truncate text-sm uppercase tracking-wider">{movie.title}</p>

              {/* Price & Rating */}
              <div className="flex items-center justify-between px-2 pb-2">
                <p className="text-lg font-black text-primary">
                  {minPrice !== null ? `${currency} ${minPrice}` : "N/A"}
                </p>

                <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                  <StarIcon className="w-3 h-3 fill-primary text-primary" />
                  {movie.vote_average?.toFixed(1) || "N/A"}
                </div>
              </div>

              {/* Buy Tickets Button */}
              <div className="flex justify-center pb-4 px-2">
                <button
                  onClick={() => {
                    navigate(`/movies/${movie._id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="w-full py-2 text-xs bg-primary hover:bg-red-700 text-white transition-colors rounded-lg font-bold uppercase"
                >
                  Buy Tickets
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Movies;