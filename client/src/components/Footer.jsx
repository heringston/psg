import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm">🌉</span>
                            </div>
                            <span className="text-lg font-bold text-white">FoodBridge</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Connecting restaurants with verified NGOs to rescue excess food and reduce waste. Every meal matters.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {[
                                { to: '/post-food', label: 'Post Excess Food' },
                                { to: '/partners', label: 'Find NGO Partners' },
                                { to: '/dashboard', label: 'Impact Dashboard' },
                                { to: '/register', label: 'Join FoodBridge' },
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className="text-sm text-slate-400 hover:text-primary-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Get In Touch</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>📧 hello@foodbridge.org</li>
                            <li>📞 +91 1800-FOOD-HELP</li>
                            <li>📍 India</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500">© {new Date().getFullYear()} FoodBridge. All rights reserved.</p>
                    <p className="text-xs text-slate-500">Built with 💚 to reduce food waste</p>
                </div>
            </div>
        </footer>
    );
}
