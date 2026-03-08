import { useState, useEffect } from 'react';

export default function NgoDashboard() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState(null);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const fetchListings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/donations/food-listings?status=available', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) setListings(data.data.listings);
        } catch { /* silent */ }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchListings(); }, []);

    const handleClaim = async (id) => {
        setClaiming(id); setMsg({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/donations/food-listings/${id}/claim`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setMsg({ type: 'success', text: '✅ Food claimed! Go to My Donations to complete pickup.' });
            setListings((prev) => prev.filter((l) => l.id !== id));
        } catch (err) { setMsg({ type: 'error', text: err.message }); }
        finally { setClaiming(null); }
    };

    const timeLeft = (exp) => {
        const diff = new Date(exp) - new Date();
        if (diff <= 0) return 'Expired';
        const hrs = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        return hrs > 0 ? `${hrs}h ${mins}m left` : `${mins}m left`;
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
            <div className="text-center mb-8 animate-fade-in">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Available Food Listings</h1>
                <p className="text-slate-500 mt-1">Browse surplus food from nearby restaurants and claim it</p>
            </div>

            {msg.text && (
                <div className={`mb-6 p-3 text-sm rounded-xl border ${msg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {msg.text}
                </div>
            )}

            {listings.length === 0 ? (
                <div className="text-center py-16 animate-fade-in">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-slate-500">No available food listings right now. Check back later!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {listings.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow animate-fade-in">
                            {item.image_url && (
                                <img src={item.image_url} alt={item.food_type} className="w-full h-40 object-cover" />
                            )}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">{item.food_type}</h3>
                                        <p className="text-sm text-slate-500">{item.restaurant?.name || 'Restaurant'}</p>
                                    </div>
                                    <span className="text-xs font-medium px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full">
                                        ⏰ {timeLeft(item.expiration_time)}
                                    </span>
                                </div>

                                {item.description && <p className="text-sm text-slate-600 mb-3">{item.description}</p>}

                                <div className="flex flex-wrap gap-2 mb-4 text-xs text-slate-500">
                                    <span className="px-2.5 py-1 bg-slate-50 rounded-lg">📦 {item.quantity} {item.unit}</span>
                                    <span className="px-2.5 py-1 bg-slate-50 rounded-lg">📍 {item.restaurant?.address || 'N/A'}</span>
                                    {item.restaurant?.is_verified && (
                                        <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-lg">✓ Verified</span>
                                    )}
                                </div>

                                <div className="text-xs text-slate-400 mb-4">
                                    🕐 Pickup: {new Date(item.pickup_window_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {new Date(item.pickup_window_end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>

                                <button onClick={() => handleClaim(item.id)} disabled={claiming === item.id}
                                    className="w-full py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl
                    hover:from-primary-700 hover:to-primary-600 shadow-md transition-all disabled:opacity-50">
                                    {claiming === item.id ? 'Claiming...' : '🤝 Claim This Food'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
