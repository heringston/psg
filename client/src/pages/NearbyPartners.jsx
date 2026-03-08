import { useState } from 'react';

export default function NearbyPartners() {
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [radius, setRadius] = useState('10');
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState('');

    const detectLocation = () => {
        if (!navigator.geolocation) return setError('Geolocation not supported');
        navigator.geolocation.getCurrentPosition(
            (pos) => { setLat(pos.coords.latitude.toFixed(6)); setLng(pos.coords.longitude.toFixed(6)); setError(''); },
            () => setError('Unable to get location. Please enter manually.')
        );
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setSearched(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/partners/nearby?lat=${lat}&lng=${lng}&radius=${radius}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Search failed');
            setPartners(data.data.partners);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-slide-up">
            <div className="text-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-bridge-500 to-bridge-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl">📍</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Find Nearby Partners</h1>
                <p className="mt-2 text-slate-500">Discover verified NGOs ready to rescue food near you</p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
                {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Latitude</label>
                        <input type="number" step="any" required value={lat} onChange={(e) => setLat(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-bridge-500 focus:ring-2 focus:ring-bridge-500/20 outline-none text-sm" placeholder="28.6139" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Longitude</label>
                        <input type="number" step="any" required value={lng} onChange={(e) => setLng(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-bridge-500 focus:ring-2 focus:ring-bridge-500/20 outline-none text-sm" placeholder="77.2090" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Radius (km)</label>
                        <select value={radius} onChange={(e) => setRadius(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-bridge-500 focus:ring-2 focus:ring-bridge-500/20 outline-none text-sm bg-white">
                            <option value="5">5 km</option>
                            <option value="10">10 km</option>
                            <option value="15">15 km</option>
                            <option value="25">25 km</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={detectLocation}
                            className="px-4 py-3 text-sm font-medium text-bridge-600 bg-bridge-50 rounded-xl hover:bg-bridge-500/15 transition-colors" title="Use my location">
                            📍
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex-1 py-3 text-sm font-semibold text-white bg-gradient-to-r from-bridge-500 to-bridge-600 rounded-xl hover:from-bridge-600 hover:to-bridge-600 shadow-md transition-all disabled:opacity-50">
                            {loading ? '...' : 'Search'}
                        </button>
                    </div>
                </div>
            </form>

            {/* Results */}
            {searched && !loading && (
                <div>
                    <p className="text-sm text-slate-500 mb-4">
                        {partners.length > 0 ? `Found ${partners.length} verified partner(s) within ${radius}km` : 'No verified partners found in this area. Try increasing the radius.'}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {partners.map((p) => (
                            <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-lg">🤝</div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 text-sm">{p.name}</h3>
                                            <p className="text-xs text-slate-500">{p.address || 'Address not provided'}</p>
                                        </div>
                                    </div>
                                    {p.is_verified && (
                                        <span className="text-xs font-medium px-2.5 py-1 bg-green-50 text-green-700 rounded-full">✓ Verified</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                    <span>📞 {p.phone || 'N/A'}</span>
                                    <span className="font-medium text-bridge-600">{parseFloat(p.distance_km).toFixed(1)} km away</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {loading && (
                <div className="text-center py-12">
                    <div className="w-10 h-10 border-4 border-bridge-200 border-t-bridge-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 text-sm">Searching for nearby partners...</p>
                </div>
            )}
        </div>
    );
}
