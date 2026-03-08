import { useState, useEffect } from 'react';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/donations/dashboard', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.success) {
                    setStats(data.data.stats);
                    setRecent(data.data.recentDonations);
                }
            } catch {
                // silently handle — user will see placeholder
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const statCards = stats
        ? [
            { label: 'Total Listings', value: stats.totalListings, icon: '📦', color: 'bg-bridge-50 text-bridge-500' },
            { label: 'Completed Donations', value: stats.completedDonations, icon: '✅', color: 'bg-primary-50 text-primary-600' },
            { label: 'Meals Saved', value: stats.totalMealsSaved, icon: '🍽️', color: 'bg-accent-400/10 text-accent-600' },
            { label: 'Active Listings', value: stats.activeListings, icon: '🟢', color: 'bg-emerald-50 text-emerald-600' },
        ]
        : [];

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Impact Dashboard</h1>
                    <p className="text-slate-500 mt-1">Track your food rescue contributions</p>
                </div>
                {stats?.hasVerifiedBadge && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-full">
                        <span className="text-lg">🏅</span>
                        <span className="text-sm font-semibold text-amber-700">Verified Donor</span>
                    </div>
                )}
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
                {statCards.map((card, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow animate-fade-in"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${card.color}`}>
                            {card.icon}
                        </div>
                        <p className="text-2xl md:text-3xl font-bold text-slate-900">{card.value}</p>
                        <p className="text-sm text-slate-500 mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Donations */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900">Recent Donations</h2>
                </div>
                {recent.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {recent.map((donation) => (
                            <div key={donation.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-lg">
                                        🍱
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">
                                            {donation.foodListing?.food_type || 'Food Donation'}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {donation.foodListing?.quantity} {donation.foodListing?.unit} → {donation.ngo?.name || 'NGO'}
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-xs font-medium px-3 py-1.5 rounded-full
                  ${donation.status === 'completed' ? 'bg-green-50 text-green-700' :
                                        donation.status === 'accepted' ? 'bg-blue-50 text-blue-700' :
                                            donation.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                                                'bg-slate-100 text-slate-600'
                                    }`}>
                                    {donation.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="px-6 py-12 text-center">
                        <p className="text-3xl mb-3">📭</p>
                        <p className="text-slate-500 text-sm">No donations yet. Post your first food listing to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
