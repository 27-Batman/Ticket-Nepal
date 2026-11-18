import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { ArrowRightIcon, ClockIcon, Armchair, Info, Trash2 } from "lucide-react";
import isoTimeFormate from "../lib/isoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const SeatLayout = () => {
  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]];
  const { id, date } = useParams();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);

  const navigate = useNavigate();
  const { axios, getToken, user } = useAppContext();

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) setShow({ ...data.movie, dateTime: data.dateTime });
      else toast.error("Failed to load show data");
    } catch (error) {
      toast.error("Failed to load show data");
    }
  };

  const getOccupiedSeats = async (showId) => {
    if (!showId) return;
    try {
      const { data } = await axios.get(`/api/booking/seats/${showId}`);
      if (data.success) setOccupiedSeats(data.occupiedSeats || []);
    } catch (error) {
      console.error("Error fetching occupied seats:", error.message);
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) return toast.error("Please select a show time first.");
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5)
      return toast.error("Maximum 5 seats allowed per booking.");
    if (occupiedSeats.includes(seatId)) return toast.error("This seat is already booked.");

    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex items-center justify-center gap-2 mb-2">
      <span className="w-5 text-[10px] font-bold text-gray-600 mr-2">{row}</span>
      <div className="flex gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isSelected = selectedSeats.includes(seatId);
          const isOccupied = occupiedSeats.includes(seatId);
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              disabled={isOccupied}
              className={`h-7 w-7 md:h-9 md:w-9 rounded-t-xl border-2 transition-all duration-300 relative group
                ${isOccupied ? "bg-gray-900 border-gray-950 cursor-not-allowed opacity-20" : 
                  isSelected ? "bg-red-600 border-red-400 scale-110 shadow-[0_0_20px_rgba(220,38,38,0.6)] z-10" : 
                  "bg-transparent border-white/10 hover:border-red-600/50 hover:bg-red-600/10 cursor-pointer"}
              `}
            >
              <span className={`text-[10px] font-bold ${isSelected ? "text-white" : "text-gray-500 group-hover:text-red-400"}`}>
                {i + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const bookTickets = async () => {
    if (!user) return toast.error("Please login to continue");
    if (!selectedTime || selectedSeats.length === 0)
      return toast.error("Please select both time and seats");

    const showId = selectedTime?.showID || selectedTime?._id;
    try {
      const { data } = await axios.post(
        "/api/booking/create",
        { showID: showId, selectedSeats },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        toast.success("Booking initiated!");
        navigate("/my-bookings");
      } else toast.error(data.message);
    } catch (error) {
      toast.error("Booking failed. Please try again.");
    }
  };

  useEffect(() => { getShow(); }, [id]);
  useEffect(() => { 
    if (selectedTime) getOccupiedSeats(selectedTime?.showID || selectedTime?._id); 
  }, [selectedTime]);

  if (!show) return <Loading />;

  // Dynamic Price Calculation
  const totalPrice = selectedSeats.length * (selectedTime?.showprice || 0);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-40 overflow-hidden relative">
      <BlurCircle top="-10%" left="-10%" />
      <BlurCircle bottom="10%" right="-5%" />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-4 gap-12">
        
        {/* LEFT: TIME SELECTION */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 sticky top-28 shadow-2xl">
            <h2 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
              <ClockIcon className="text-red-600" size={20} /> Showtimes
            </h2>
            <div className="space-y-3">
              {show?.dateTime?.[date]?.length > 0 ? (
                show.dateTime[date].map((item) => (
                  <button
                    key={item.time}
                    onClick={() => { setSelectedTime(item); setSelectedSeats([]); }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-500
                      ${selectedTime?.time === item.time 
                        ? "bg-red-600 border-red-500 shadow-lg shadow-red-900/40 translate-x-2" 
                        : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                  >
                    <div className="flex flex-col items-start">
                        <span className="font-bold text-lg">{isoTimeFormate(item.time)}</span>
                        <span className="text-[10px] opacity-60 font-medium">NPR {item.showprice}</span>
                    </div>
                    {selectedTime?.time === item.time && <div className="w-2 h-2 bg-white rounded-full animate-ping" />}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic">No shows found for this date.</p>
              )}
            </div>
            
            <div className="mt-8 p-4 bg-red-950/20 border border-red-500/20 rounded-2xl flex gap-3 items-start text-[11px] text-red-200/70 leading-relaxed">
               <Info size={16} className="shrink-0 text-red-500" />
               <p>Seats are held for 10 minutes once selected. Final price includes all taxes.</p>
            </div>
          </div>
        </div>

        {/* CENTER: SEAT LAYOUT */}
        <div className="lg:col-span-3 flex flex-col items-center">
          
          {/* THE SCREEN */}
          <div className="w-full max-w-2xl relative mb-20 group">
            <div className="h-1.5 w-full bg-red-600 rounded-full shadow-[0_20px_50px_rgba(220,38,38,0.8)] mb-6 transition-all group-hover:shadow-[0_25px_60px_rgba(220,38,38,1)]"></div>
            <div className="w-full h-24 bg-gradient-to-t from-transparent via-red-600/5 to-red-600/20 rounded-b-[120px] flex items-end justify-center pb-6">
              <span className="text-[10px] font-black tracking-[1.5em] text-gray-500 uppercase opacity-50">All Eyes This Way</span>
            </div>
          </div>

          {/* SEAT GRID WITH PERSPECTIVE */}
          <div className="transform perspective-1000 rotateX-5 space-y-10">
            {/* Front Section */}
            <div className="flex flex-col gap-1">
               {groupRows[0].map((row) => renderSeats(row))}
            </div>
            
            {/* Middle Section (Split) */}
            <div className="grid grid-cols-2 gap-12 md:gap-24">
              <div className="space-y-1">
                 {groupRows.slice(1, 4).flat().map(row => renderSeats(row, 4))}
              </div>
              <div className="space-y-1">
                 {groupRows.slice(1, 4).flat().map(row => renderSeats(row, 4))}
              </div>
            </div>

            {/* Back Section */}
            <div className="flex flex-col gap-1">
               {groupRows.slice(4).flat().map((row) => renderSeats(row))}
            </div>
          </div>

          {/* LEGEND */}
          <div className="flex gap-10 mt-20 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <div className="w-4 h-4 border-2 border-white/20 rounded-md"></div> Available
            </div>
            <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <div className="w-4 h-4 bg-red-600 rounded-md shadow-lg shadow-red-600/40"></div> Selected
            </div>
            <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <div className="w-4 h-4 bg-gray-800 rounded-md opacity-40"></div> Occupied
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING SUMMARY BAR */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="bg-black/80 backdrop-blur-3xl border border-white/10 p-6 md:p-8 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] border-t-white/20 flex flex-col md:flex-row items-center justify-between gap-8">
            
            <div className="flex items-center gap-10 w-full md:w-auto">
              {/* Selected Seats List */}
              <div className="hidden sm:block">
                <div className="flex items-center gap-2 mb-2">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Selected Seats</p>
                    <button onClick={() => setSelectedSeats([])} className="hover:text-red-500 transition-colors">
                        <Trash2 size={12} />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map(s => (
                    <span key={s} className="bg-white/10 text-white text-xs px-3 py-1.5 rounded-xl border border-white/10 font-black">
                        {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-14 w-px bg-white/10 hidden sm:block"></div>

              {/* LIVE PRICE CALCULATION */}
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Total Payable</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white italic">
                        Rs. {totalPrice.toLocaleString()}
                    </span>
                </div>
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter mt-1">
                    {selectedSeats.length} Ticket{selectedSeats.length > 1 ? 's' : ''} x NPR {selectedTime?.showprice || 0}
                </p>
              </div>
            </div>

            <button
              onClick={bookTickets}
              className="w-full md:w-auto flex items-center justify-center gap-4 px-12 py-5 bg-red-600 hover:bg-red-700 transition-all rounded-[2rem] font-black text-sm uppercase tracking-widest active:scale-95 shadow-2xl shadow-red-900/40 group overflow-hidden relative"
            >
              <span className="relative z-10">Confirm Booking</span>
              <ArrowRightIcon size={20} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatLayout;