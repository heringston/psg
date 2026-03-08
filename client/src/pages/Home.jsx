import { Link } from 'react-router-dom';

const stats = [
    { value: '10K+', label: 'Meals Rescued', icon: '🍽️' },
    { value: '200+', label: 'Restaurant Partners', icon: '🏪' },
    { value: '50+', label: 'Verified NGOs', icon: '🤝' },
    { value: '15+', label: 'Cities Covered', icon: '🏙️' },
];

const steps = [
    {
        icon: '📋',
        title: 'Post Excess Food',
        description: 'Restaurants list their surplus food with quantity, type, and available pickup window.',
    },
    {
        icon: '📍',
        title: 'Match Nearby NGOs',
        description: 'Our proximity engine finds verified NGOs within 5-10km for quick pickup.',
    },
    {
        icon: '🚗',
        title: 'Pickup & Deliver',
        description: 'NGOs claim the listing, pick up the food, and upload proof of delivery.',
    },
    {
        icon: '📊',
        title: 'Track Impact',
        description: 'Both parties earn verified badges and see real-time impact on their dashboards.',
    },
];

export default function Home() {
    return (
        <div>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-400/5">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMmM1NWUiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
                    <div className="text-center max-w-3xl mx-auto animate-slide-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                            <span className="animate-pulse-soft">🟢</span> Live — Rescuing food every day
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                            Bridge the Gap Between{' '}
                            <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                                Surplus & Need
                            </span>
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed">
                            FoodBridge connects restaurants with verified NGOs to rescue excess food before it goes to waste.
                            Powered by proximity matching and trust verification.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl
                  hover:from-primary-700 hover:to-primary-600 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
                            >
                                Start Rescuing Food →
                            </Link>
                            <Link
                                to="/partners"
                                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-primary-700 bg-primary-50 rounded-2xl
                  hover:bg-primary-100 transition-all duration-200"
                            >
                                Find Nearby Partners
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="text-2xl mb-1">{stat.icon}</div>
                                <div className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</div>
                                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            How <span className="text-primary-600">FoodBridge</span> Works
                        </h2>
                        <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
                            Four simple steps to rescue food and create impact
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, i) => (
                            <div
                                key={i}
                                className="relative p-6 bg-slate-50 rounded-2xl hover:bg-primary-50 transition-all duration-300 group animate-fade-in"
                                style={{ animationDelay: `${i * 150}ms` }}
                            >
                                <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary-600 text-white text-sm font-bold rounded-full flex items-center justify-center shadow-md">
                                    {i + 1}
                                </div>
                                <div className="text-3xl mb-4">{step.icon}</div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-primary-700 transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTIwIDBDOC45NTMgMCAwIDguOTUzIDAgMjBzOC45NTMgMjAgMjAgMjAgMjAtOC45NTMgMjAtMjBTMzEuMDQ3IDAgMjAgMHptMCAzNmMtOC44MzcgMC0xNi03LjE2My0xNi0xNlMxMS4xNjMgNCAxOS45OTkgNCAzNiAxMS4xNjMgMzYgMjBzLTcuMTYzIDE2LTE2IDE2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Make a Difference?
                    </h2>
                    <p className="text-lg text-primary-100 mb-10 max-w-2xl mx-auto">
                        Whether you're a restaurant with surplus food or an NGO serving communities — join FoodBridge today and start creating impact.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-primary-700 bg-white rounded-2xl
                hover:bg-primary-50 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
                        >
                            Join as Restaurant
                        </Link>
                        <Link
                            to="/register"
                            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-2xl
                hover:bg-white/10 transition-all duration-200"
                        >
                            Join as NGO
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
