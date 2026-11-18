import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'
import { dateFormat } from '../../lib/dateFormate'
import { useAppContext } from '../../context/AppContext'
import { Eye, X, CheckCircle } from 'lucide-react'
import { toast } from 'react-toastify'

const ListBooking = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const { axios, getToken, user } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [refundDetail, setRefundDetail] = useState(null)
  const [isFetchingRefund, setIsFetchingRefund] = useState(false)

  const getAllBookings = async () => {
    try {
      const { data } = await axios.get("/api/admin/all-bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      setBookings(Array.isArray(data.bookings) ? data.bookings : [])
      setIsLoading(false)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  const handleViewRefund = async (bookingId) => {
    setIsFetchingRefund(true)
    try {
      const token = await getToken()
      const { data } = await axios.get(`/api/admin/refund-details/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setRefundDetail(data.refund) // This stores the email, phone, and reason
        setShowModal(true)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Error fetching data")
    } finally {
      setIsFetchingRefund(false)
    }
  }

  const markAsRefunded = async (bookingId) => {
    if(!window.confirm("Mark as completed?")) return
    try {
      const token = await getToken()
      const { data } = await axios.post(`/api/admin/complete-refund`, { bookingId }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if(data.success) {
        toast.success("Refund Processed")
        setShowModal(false)
        getAllBookings() // Refresh the list to update status
      }
    } catch (error) {
      toast.error("Action failed")
    }
  }

  useEffect(() => { if (user) getAllBookings() }, [user])

  if (isLoading) return <Loading />

  return (
    <>
      <Title text1="List" text2="Booking" />
      <div className='max-w-6xl mt-6 overflow-x-auto bg-[#111] p-4 rounded-lg'>
        <table className='w-full border-collapse text-nowrap'>
          <thead>
            <tr className='bg-primary/20 text-left text-white border-b border-white/10'>
              <th className='p-3 pl-5'>User</th>
              <th className='p-3'>Movie</th>
              <th className='p-3'>Show Time</th>
              <th className='p-3'>Seats</th>
              <th className='p-3'>Amount</th>
              <th className='p-3'>Status</th>
              <th className='p-3'>Refund</th>
            </tr>
          </thead>
          <tbody className='text-sm text-gray-300'>
            {bookings.map((item, index) => (
              <tr key={index} className='border-b border-white/5 hover:bg-white/5 transition-all'>
                <td className='p-3 pl-5'>{item?.User?.name || "N/A"}</td>
                <td className='p-3'>{item?.Show?.Movie?.title || "N/A"}</td>
                <td className='p-3 font-mono'>{item?.Show?.showTime ? dateFormat(item.Show.showTime) : "N/A"}</td>
                <td className='p-3 text-primary'>{Array.isArray(item?.seats) ? item.seats.join(", ") : "N/A"}</td>
                <td className='p-3'>{currency}{item?.amount || 0}</td>
                <td className='p-3'>
                  <span className={item?.isPaid ? "text-green-400" : "text-yellow-400"}>
                    {item?.isPaid ? "Paid" : "Refunded/Pending"}
                  </span>
                </td>
                <td className='p-3'>
                  {/* Logic: Show button only if refundRequested is true */}
                  {item.refundRequested ? (
                    <button 
                      onClick={() => handleViewRefund(item._id)} 
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 text-xs transition-colors"
                    >
                      <Eye size={14} /> View Details
                    </button>
                  ) : (
                    <span className="text-gray-600 italic text-xs">No Request</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Refund Details Modal */}
      {showModal && refundDetail && (
        <div className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-white/10 w-full max-w-md rounded-xl p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-white mb-4">Refund Request</h2>
            
            <div className="space-y-3">
              <div className="bg-white/5 p-3 rounded border border-white/10">
                <label className="text-[10px] text-gray-500 uppercase">User Email</label>
                <p className="text-white">{refundDetail.email}</p>
              </div>
              <div className="bg-white/5 p-3 rounded border border-white/10">
                <label className="text-[10px] text-gray-500 uppercase">Payment Mobile (eSewa/Khalti)</label>
                <p className="text-primary font-bold text-lg">{refundDetail.phone}</p>
              </div>
              <div className="bg-white/5 p-3 rounded border border-white/10">
                <label className="text-[10px] text-gray-500 uppercase">Reason</label>
                <p className="text-gray-300 italic">"{refundDetail.reason}"</p>
              </div>

              {/* Action Button: Calls the completeRefund function in backend */}
              <button 
                onClick={() => markAsRefunded(refundDetail.bookingId)} 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-4 transition-all"
              >
                <CheckCircle size={18} /> Approve & Mark Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ListBooking