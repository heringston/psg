import { useState } from 'react';

export default function FoodListingForm() {
    const [form, setForm] = useState({
        food_type: '', description: '', quantity: '', unit: 'servings',
        expiration_time: '', pickup_window_start: '', pickup_window_end: '',
        special_instructions: '',
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setSuccess('');
        try {
            const token = localStorage.getItem('token');
            const fd = new FormData();
            Object.keys(form).forEach((k) => fd.append(k, form[k]));
            if (image) fd.append('image', image);
            const res = await fetch('/api/donations/food-listings', {
                method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed');
            setSuccess('🎉 Food listing posted! Nearby NGOs will be notified.');
            setForm({ food_type: '', description: '', quantity: '', unit: 'servings', expiration_time: '', pickup_window_start: '', pickup_window_end: '', special_instructions: '' });
            setImage(null);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    const foodTypes = ['Cooked Meals', 'Raw Vegetables', 'Fruits', 'Packaged Food', 'Bakery Items', 'Beverages', 'Dairy', 'Other'];
    const units = ['servings', 'kg', 'plates', 'packets', 'boxes', 'liters'];
    const inputCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm';

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 md:py-12 animate-slide-up">
            <div className="text-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl">📦</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Post Excess Food</h1>
                <p className="mt-2 text-slate-500">List surplus food and help feed those in need</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-5">
                {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>}
                {success && <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">{success}</div>}

                <div>
                    <label htmlFor="food_type" className="block text-sm font-medium text-slate-700 mb-1.5">Food Type</label>
                    <select id="food_type" name="food_type" required value={form.food_type} onChange={handleChange} className={`${inputCls} bg-white`}>
                        <option value="">Select food type</option>
                        {foodTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                    <textarea id="description" name="description" rows={3} value={form.description} onChange={handleChange} className={`${inputCls} resize-none`} placeholder="Briefly describe the food..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-1.5">Quantity</label>
                        <input id="quantity" name="quantity" type="number" min="1" required value={form.quantity} onChange={handleChange} className={inputCls} placeholder="50" />
                    </div>
                    <div>
                        <label htmlFor="unit" className="block text-sm font-medium text-slate-700 mb-1.5">Unit</label>
                        <select id="unit" name="unit" value={form.unit} onChange={handleChange} className={`${inputCls} bg-white`}>
                            {units.map((u) => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="expiration_time" className="block text-sm font-medium text-slate-700 mb-1.5">Expiration Time</label>
                    <input id="expiration_time" name="expiration_time" type="datetime-local" required value={form.expiration_time} onChange={handleChange} className={inputCls} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="pickup_window_start" className="block text-sm font-medium text-slate-700 mb-1.5">Pickup From</label>
                        <input id="pickup_window_start" name="pickup_window_start" type="datetime-local" required value={form.pickup_window_start} onChange={handleChange} className={inputCls} />
                    </div>
                    <div>
                        <label htmlFor="pickup_window_end" className="block text-sm font-medium text-slate-700 mb-1.5">Pickup Until</label>
                        <input id="pickup_window_end" name="pickup_window_end" type="datetime-local" required value={form.pickup_window_end} onChange={handleChange} className={inputCls} />
                    </div>
                </div>

                <div>
                    <label htmlFor="special_instructions" className="block text-sm font-medium text-slate-700 mb-1.5">Special Instructions <span className="text-slate-400 text-xs">(optional)</span></label>
                    <textarea id="special_instructions" name="special_instructions" rows={2} value={form.special_instructions} onChange={handleChange} className={`${inputCls} resize-none`} placeholder="Allergens, storage needs..." />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Photo <span className="text-slate-400 text-xs">(optional)</span></label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-primary-300 transition-colors cursor-pointer" onClick={() => document.getElementById('img-upload').click()}>
                        <input id="img-upload" type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
                        {image ? <p className="text-sm text-primary-600 font-medium">📷 {image.name}</p> : <><p className="text-2xl mb-2">📸</p><p className="text-sm text-slate-500">Click to upload a photo</p></>}
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl hover:from-accent-600 hover:to-accent-600 shadow-md hover:shadow-lg transition-all disabled:opacity-50">
                    {loading ? 'Posting...' : '📤 Post Food Listing'}
                </button>
            </form>
        </div>
    );
}
