import { useState } from 'react';
import { FaStar, FaThumbsUp, FaThumbsDown, FaRegStar } from 'react-icons/fa';

const DUMMY_REVIEWS = [
  { id: 'rev-1', user: 'Priya Sharma', car: 'Porsche 911 Carrera S', rating: 5, comment: 'Absolutely breathtaking experience! The car was in perfect condition and the booking process was seamless.', date: '2026-06-10', status: 'Approved' },
  { id: 'rev-2', user: 'Rahul Verma', car: 'Tesla Model S Plaid', rating: 4, comment: 'Great EV experience. The Autopilot feature was impressive. Would have been 5 stars if pickup was faster.', date: '2026-06-08', status: 'Approved' },
  { id: 'rev-3', user: 'Anjali Mehta', car: 'BMW M4 Competition', rating: 5, comment: 'Pure driving pleasure. The M exhaust note is addictive. Will definitely book again!', date: '2026-06-06', status: 'Pending' },
  { id: 'rev-4', user: 'Karan Singh', car: 'Mercedes-AMG GT', rating: 3, comment: 'Good car but the interior had some minor scratches. Overall decent experience.', date: '2026-06-03', status: 'Pending' },
  { id: 'rev-5', user: 'Sneha Patel', car: 'Lamborghini Huracan Evo', rating: 5, comment: 'A once in a lifetime experience! Worth every rupee. The team was professional and helpful.', date: '2026-05-28', status: 'Approved' },
];

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {/* [1,2,3,4,5] is a fixed constant, never reordered/filtered — index key is safe here. */}
    {[1,2,3,4,5].map(i => (
      <span key={i}>{i <= rating ? <FaStar className="text-amber-400 text-xs" /> : <FaRegStar className="text-slate-300 text-xs" />}</span>
    ))}
  </div>
);

const AdminReviews = () => {
  const [reviews, setReviews] = useState(DUMMY_REVIEWS);
  const [filter, setFilter] = useState('All');

  const handleStatus = (id, status) => {
    setReviews(r => r.map(rev => rev.id === id ? { ...rev, status } : rev));
  };

  const filtered = filter === 'All' ? reviews : reviews.filter(r => r.status === filter);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-display">Customer Reviews</h1>
        <p className="text-slate-500 text-sm mt-0.5">{reviews.length} total reviews · {reviews.filter(r => r.status === 'Pending').length} pending moderation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Reviews', value: reviews.length, color: 'text-blue-600' },
          { label: 'Average Rating', value: (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) + ' ★', color: 'text-amber-500' },
          { label: 'Approved', value: reviews.filter(r => r.status === 'Approved').length, color: 'text-emerald-600' },
          { label: 'Pending', value: reviews.filter(r => r.status === 'Pending').length, color: 'text-amber-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['All', 'Approved', 'Pending'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>{f}</button>
        ))}
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {filtered.map(review => (
          <div key={review.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl text-white text-sm font-black flex items-center justify-center flex-shrink-0">
                  {review.user[0]}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{review.user}</p>
                  <p className="text-xs text-slate-500">{review.car} · {review.date}</p>
                  <StarRating rating={review.rating} />
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{review.comment}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${review.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  {review.status}
                </span>
                {review.status === 'Pending' && (
                  <div className="flex gap-1">
                    <button onClick={() => handleStatus(review.id, 'Approved')} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors" title="Approve"><FaThumbsUp className="text-xs" /></button>
                    <button onClick={() => handleStatus(review.id, 'Rejected')} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="Reject"><FaThumbsDown className="text-xs" /></button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;
