import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    // Dynamic nav links based on role
    const navLinks = user
        ? user.role === 'restaurant'
            ? [
                { path: '/', label: 'Home' },
                { path: '/post-food', label: 'Post Food' },
                { path: '/partners', label: 'Find Partners' },
                { path: '/dashboard', label: 'Dashboard' },
            ]
            : [
                { path: '/', label: 'Home' },
                { path: '/browse-food', label: 'Browse Food' },
                { path: '/my-donations', label: 'My Donations' },
                { path: '/partners', label: 'Find Partners' },
            ]
        : [
            { path: '/', label: 'Home' },
            { path: '/partners', label: 'Find Partners' },
        ];

    return (
        <nav className="bg-white/80 backdrop-blur-lg border-b border-primary-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                            <span className="text-white text-lg font-bold">🌉</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
                            FoodBridge
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link key={link.path} to={link.path}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${location.pathname === link.path
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-500">
                                    {user.role === 'restaurant' ? '🏪' : '🤝'} {user.name}
                                </span>
                                <button onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                    Log In
                                </Link>
                                <Link to="/register"
                                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl
                    hover:from-primary-700 hover:to-primary-600 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors" aria-label="Toggle navigation">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen
                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden border-t border-slate-100 animate-fade-in">
                    <div className="px-4 py-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}
                                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${location.pathname === link.path ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-3 border-t border-slate-100">
                            {user ? (
                                <button onClick={handleLogout} className="w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg text-left">
                                    Logout ({user.name})
                                </button>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Log In</Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm font-semibold text-center text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl">Get Started</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
