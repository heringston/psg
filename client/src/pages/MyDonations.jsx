import { useState, useEffect } from 'react';

export default function MyDonations() {
    const [donations, setDonations] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(null);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const fetchDonations = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/donations/my-donations', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setDonations(data.data.donations);
                setStats(data.data.stats);
            }
        } catch { /* silent */ }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchDonations(); }, []);

    const handleComplete = async (donationId) => {
        const fileInput = document.getElementById(`photo-${donationId}`);
        const mealsInput = document.getElementById(`meals-${donationId}`);

        if (!fileInput?.files[0]) {
            setMsg({ type: 'error', text: 'Please upload a proof-of-delivery photo.' });
            return;
        }

        setCompleting(donationId); setMsg({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            const fd = new FormData();
            fd.append('completion_photo', fileInput.files[0]);
            fd.append('meals_saved', mealsInput?.value || '0');

            const res = await fetch(`/api/donations/${donationId}/complete`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setMsg({ type: 'success', text: '🎉 Donation marked as completed! Thank you for your service.' });
            fetchDonations();
        } catch (err) { setMsg({ type: 'error', text: err.message }); }
        finally { setCompleting(null); }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
            <div className="mb-8 animate-fade-in">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">My Donations</h1>
                <p className="text-slate-500 mt-1">Manage your claimed food pickups</p>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Claims', value: stats.total, icon: '📋', cls: 'bg-bridge-50 text-bridge-500' },
                        { label: 'Pending Pickup', value: stats.pending, icon: '🕐', cls: 'bg-amber-50 text-amber-600' },
                        { label: 'Completed', value: stats.completed, icon: '✅', cls: 'bg-primary-50 text-primary-600' },
                        { label: 'Meals Saved', value: stats.totalMealsSaved, icon: '🍽️', cls: 'bg-accent-400/10 text-accent-600' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2 ${s.cls}`}>{s.icon}</div>
                            <p className="text-xl font-bold text-slate-900">{s.value}</p>
                            <p className="text-xs text-slate-500">{s.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {msg.text && (
                <div className={`mb-6 p-3 text-sm rounded-xl border ${msg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {msg.text}
                </div>
            )}

            {/* Donations List */}
            {donations.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-slate-500">No donations yet. Go to Browse Food to claim some!</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {donations.map((d) => (
                        <div key={d.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 animate-fade-in">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-lg">🍱</div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{d.foodListing?.food_type || 'Food'}</h3>
                                        <p className="text-xs text-slate-500">From: {d.donorRestaurant?.name || 'Restaurant'} • {d.foodListing?.quantity} {d.foodListing?.unit}</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-medium px-3 py-1.5 rounded-full self-start
                  ${d.status === 'completed' ? 'bg-green-50 text-green-700' :
                                        d.status === 'accepted' ? 'bg-blue-50 text-blue-700' :
                                            'bg-slate-100 text-slate-600'}`}>
                                    {d.status === 'accepted' ? '⏳ Pending Pickup' : d.status === 'completed' ? '✅ Completed' : d.status}
                                </span>
                            </div>

                            {d.donorRestaurant?.address && (
                                <p className="text-xs text-slate-400 mb-3">📍 {d.donorRestaurant.address} • 📞 {d.donorRestaurant.phone || 'N/A'}</p>
                            )}

                            {d.completion_photo_url && (
                                <div className="mb-3">
                                    <p className="text-xs text-slate-500 mb-1">Proof of Delivery:</p>
                                    <img src={d.completion_photo_url} alt="Proof" className="w-32 h-24 object-cover rounded-xl border border-slate-200" />
                                </div>
                            )}

                            {/* Complete Form — only for pending donations */}
                            {d.status === 'accepted' && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <p className="text-sm font-medium text-slate-700 mb-3">📸 Mark as Completed</p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input id={`photo-${d.id}`} type="file" accept="image/*"
                                            className="flex-1 text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                                        <input id={`meals-${d.id}`} type="number" min="0" placeholder="Meals served"
                                            className="w-32 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-primary-500 outline-none" />
                                        <button onClick={() => handleComplete(d.id)} disabled={completing === d.id}
                                            className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl hover:from-primary-700 hover:to-primary-600 shadow-md transition-all disabled:opacity-50">
                                            {completing === d.id ? '...' : '✅ Complete'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
