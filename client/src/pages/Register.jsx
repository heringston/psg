import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({
        name: '', email: '', password: '', role: 'restaurant',
        phone: '', address: '', latitude: '', longitude: '',
        fssai_id: '', ngo_darpan_id: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    latitude: form.latitude ? parseFloat(form.latitude) : null,
                    longitude: form.longitude ? parseFloat(form.longitude) : null,
                }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Registration failed');

            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            setSuccess(`Registration successful! ${data.data.verification?.message || ''}`);

            setTimeout(() => { window.location.href = '/dashboard'; }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 via-white to-slate-50">
            <div className="w-full max-w-lg animate-slide-up">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-2xl">🤝</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Join FoodBridge</h1>
                    <p className="mt-2 text-slate-500">Create your account and start making impact</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-5">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>
                    )}
                    {success && (
                        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">{success}</div>
                    )}

                    {/* Role Selector */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">I am a</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['restaurant', 'ngo'].map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setForm({ ...form, role })}
                                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 border-2
                    ${form.role === role
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                        }`}
                                >
                                    {role === 'restaurant' ? '🏪 Restaurant' : '🤝 NGO'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Basic Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Organization Name</label>
                            <input id="name" name="name" type="text" required value={form.name} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                                placeholder="Your organization" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                            <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                                placeholder="+91 98765 43210" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                        <input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                            placeholder="contact@organization.com" />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                        <input id="password" name="password" type="password" required minLength={6} value={form.password} onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                            placeholder="Min 6 characters" />
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                        <input id="address" name="address" type="text" value={form.address} onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                            placeholder="Full address for pickup coordination" />
                    </div>

                    {/* Location */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-medium text-slate-700">Location</label>
                            <button type="button" onClick={() => {
                                if (!navigator.geolocation) { setError('Geolocation not supported by your browser'); return; }
                                navigator.geolocation.getCurrentPosition(
                                    (pos) => setForm({ ...form, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6) }),
                                    () => setError('Unable to detect location. Please enter manually.')
                                );
                            }}
                                className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 px-3 py-1.5 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                                📍 Detect My Location
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input id="latitude" name="latitude" type="number" step="any" value={form.latitude} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                                placeholder="Latitude (e.g. 28.6139)" />
                            <input id="longitude" name="longitude" type="number" step="any" value={form.longitude} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                                placeholder="Longitude (e.g. 77.2090)" />
                        </div>
                        {form.latitude && form.longitude && (
                            <p className="text-xs text-green-600 mt-1.5">✅ Location set: {form.latitude}, {form.longitude}</p>
                        )}
                    </div>

                    {/* Verification ID */}
                    {form.role === 'restaurant' ? (
                        <div>
                            <label htmlFor="fssai_id" className="block text-sm font-medium text-slate-700 mb-1.5">
                                FSSAI License ID <span className="text-slate-400 text-xs">(for verification)</span>
                            </label>
                            <input id="fssai_id" name="fssai_id" type="text" value={form.fssai_id} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                                placeholder="14-digit FSSAI number" />
                        </div>
                    ) : (
                        <div>
                            <label htmlFor="ngo_darpan_id" className="block text-sm font-medium text-slate-700 mb-1.5">
                                NGO Darpan ID <span className="text-slate-400 text-xs">(for verification)</span>
                            </label>
                            <input id="ngo_darpan_id" name="ngo_darpan_id" type="text" value={form.ngo_darpan_id} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                                placeholder="DL/2024/XXXXXX" />
                        </div>
                    )}

                    <button type="submit" disabled={loading}
                        className="w-full py-3 px-4 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl
              hover:from-primary-700 hover:to-primary-600 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <p className="text-center text-sm text-slate-500">
                        Already registered?{' '}
                        <Link to="/login" className="text-primary-600 font-medium hover:underline">Log in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
