import React, { useState, useEffect } from 'react';

// Komponen Testimoni Card
function TestimoniCard({ name, message, avatar, job }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 h-full">
            <div className="flex items-center mb-4">
                <img 
                    src={avatar} 
                    alt={name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                    <h6 className="font-bold text-lg">{name}</h6>
                    <p className="text-gray-500 text-sm">{job}</p>
                </div>
            </div>
            <p className="text-base text-gray-700">{message}</p>
        </div>
    );
}

const testimonies = [
    {
        name: "Aisyah R.",
        job: "Pelajar",
        message: "Pengajarnya sabar dan sangat membantu. Saya merasa lebih percaya diri membaca Al-Qur'an.",
        avatar: "https://via.placeholder.com/50",
    },
    {
        name: "Fahmi L.",
        job: "Pelajar",
        message: "Program privatnya cocok sekali buat saya yang sibuk kerja. Jadwal fleksibel dan pengajar berpengalaman.",
        avatar: "https://via.placeholder.com/50",
    },
    {
        name: "Nadia A.",
        job: "Orang Tua",
        message: "Anak saya jadi semangat mengaji. Metodenya menyenangkan dan mudah dipahami.",
        avatar: "https://via.placeholder.com/50",
    },
];

export default function TestimoniSection() {
    const [stats, setStats] = useState({
        daily: 0,
        weekly: 0,
        monthly: 0,
        total: 0
    });
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState('');
    const [firebaseConfigured, setFirebaseConfigured] = useState(false);

    // Firebase Configuration
    const FIREBASE_CONFIG = {
        databaseURL: "https://kahfiedu-9a7f0-default-rtdb.asia-southeast1.firebasedatabase.app/"
    };

    // Helper functions
    const getDateKey = () => {
        const now = new Date();
        return now.toISOString().split('T')[0];
    };

    const getWeekKey = () => {
        const now = new Date();
        const year = now.getFullYear();
        const startOfYear = new Date(year, 0, 1);
        const dayOfYear = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
        const dayOfWeek = startOfYear.getDay();
        const weekNumber = Math.ceil((dayOfYear + dayOfWeek) / 7);
        return `${year}-W${weekNumber}`;
    };

    const getMonthKey = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    };

    // Firebase REST API Functions
    const firebaseGet = async (path) => {
        try {
            const response = await fetch(`${FIREBASE_CONFIG.databaseURL}${path}.json`);
            return await response.json();
        } catch (error) {
            console.error('Firebase GET error:', error);
            return null;
        }
    };

    const firebaseSet = async (path, value) => {
        try {
            const response = await fetch(`${FIREBASE_CONFIG.databaseURL}${path}.json`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(value)
            });
            return await response.json();
        } catch (error) {
            console.error('Firebase SET error:', error);
            return null;
        }
    };

    const firebaseIncrement = async (path) => {
        const currentValue = await firebaseGet(path);
        const newValue = (currentValue || 0) + 1;
        await firebaseSet(path, newValue);
        return newValue;
    };

    // Track visitor
    const trackVisitor = async () => {
        try {
            const dateKey = getDateKey();
            const weekKey = getWeekKey();
            const monthKey = getMonthKey();
            
            // Cek apakah sudah tracking dalam session ini
            const sessionKey = `session_tracked_${dateKey}`;
            const hasTrackedThisSession = sessionStorage.getItem(sessionKey);
            
            if (!hasTrackedThisSession) {
                // Increment semua counter di Firebase
                await Promise.all([
                    firebaseIncrement(`stats/daily/${dateKey}`),
                    firebaseIncrement(`stats/weekly/${weekKey}`),
                    firebaseIncrement(`stats/monthly/${monthKey}`),
                    firebaseIncrement('stats/total')
                ]);

                // Tandai session sudah tracking
                sessionStorage.setItem(sessionKey, 'true');
                setFirebaseConfigured(true);
            }

            // Fetch statistik terkini
            await fetchStats();

        } catch (err) {
            console.error('Error tracking visitor:', err);
            setLoading(false);
        }
    };

    // Fetch statistik
    const fetchStats = async () => {
        try {
            const dateKey = getDateKey();
            const weekKey = getWeekKey();
            const monthKey = getMonthKey();

            const [daily, weekly, monthly, total] = await Promise.all([
                firebaseGet(`stats/daily/${dateKey}`),
                firebaseGet(`stats/weekly/${weekKey}`),
                firebaseGet(`stats/monthly/${monthKey}`),
                firebaseGet('stats/total')
            ]);

            setStats({
                daily: daily || 0,
                weekly: weekly || 0,
                monthly: monthly || 0,
                total: total || 0
            });

            const now = new Date();
            setLastUpdate(now.toLocaleTimeString('id-ID'));
            setLoading(false);
            setFirebaseConfigured(true);

        } catch (err) {
            console.error('Error fetching stats:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        trackVisitor();
        
        // Auto-refresh setiap 10 detik untuk realtime
        const interval = setInterval(fetchStats, 10000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-20">
            <div className="max-w-6xl mx-auto px-4">
                {/* Testimoni Section */}
                <h4 className="text-5xl font-bold text-center mb-4">
                    Testimoni
                </h4>
                <p className="text-xl font-light text-center mb-12">
                    Kahfi Education hadir untuk mendampingi perjalanan belajar Al-Qur'an dengan hati. Berikut kesan mereka yang telah menjadi bagian dari perjalanan ini.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {testimonies.map((item, index) => (
                        <div key={index} className="p-2">
                            <TestimoniCard
                                name={item.name}
                                message={item.message}
                                avatar={item.avatar}
                                job={item.job}
                            />
                        </div>
                    ))}
                </div>

                {/* Statistik Pengunjung - Tabel */}
                <div className="mt-16 mb-12">
                    <h4 className="text-4xl font-bold text-center mb-2">
                        Statistik Pengunjung
                    </h4>
                    <p className="text-center text-gray-600 mb-2">
                        Data Real-Time dengan Firebase 🔥
                    </p>
                    {lastUpdate && (
                        <p className="text-center text-sm text-gray-500 mb-2">
                            Terakhir diperbarui: {lastUpdate}
                        </p>
                    )}
                    {!firebaseConfigured && (
                        <p className="text-center text-xs text-orange-600 mb-4">
                            ⚠️ Menghubungkan ke Firebase...
                        </p>
                    )}
                    
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-green-100">
                            <thead className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600">
                                <tr>
                                    <th className="px-8 py-5 text-left text-sm font-bold text-white tracking-wide">Periode</th>
                                    <th className="px-8 py-5 text-center text-sm font-bold text-white tracking-wide">Jumlah Pengunjung</th>
                                    <th className="px-8 py-5 text-center text-sm font-bold text-white tracking-wide">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-green-100">
                                <tr className="hover:bg-green-50 transition-all duration-200 bg-gradient-to-r from-green-50/30 to-transparent">
                                    <td className="px-8 py-5 font-semibold text-gray-800">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full mr-3 shadow-md animate-pulse"></div>
                                            <div>
                                                <div className="text-base">Hari Ini</div>
                                                <div className="text-xs text-gray-500">{getDateKey()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                            {loading ? '...' : stats.daily.toLocaleString('id-ID')}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-sm">
                                            ● Live
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-green-50 transition-all duration-200 bg-gradient-to-r from-emerald-50/20 to-transparent">
                                    <td className="px-8 py-5 font-semibold text-gray-800">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full mr-3 shadow-md"></div>
                                            <div>
                                                <div className="text-base">Minggu Ini</div>
                                                <div className="text-xs text-gray-500">{getWeekKey()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                            {loading ? '...' : stats.weekly.toLocaleString('id-ID')}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 shadow-sm">
                                            ● Live
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-green-50 transition-all duration-200 bg-gradient-to-r from-teal-50/20 to-transparent">
                                    <td className="px-8 py-5 font-semibold text-gray-800">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-full mr-3 shadow-md"></div>
                                            <div>
                                                <div className="text-base">Bulan Ini</div>
                                                <div className="text-xs text-gray-500">{getMonthKey()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                                            {loading ? '...' : stats.monthly.toLocaleString('id-ID')}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 shadow-sm">
                                            ● Live
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-green-50 transition-all duration-200 bg-gradient-to-r from-green-100/40 to-emerald-50/30">
                                    <td className="px-8 py-6 font-bold text-gray-900">
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-700 rounded-full mr-3 shadow-lg"></div>
                                            <div>
                                                <div className="text-lg">Total Keseluruhan</div>
                                                <div className="text-xs text-gray-600">Sejak awal</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="text-4xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                            {loading ? '...' : stats.total.toLocaleString('id-ID')}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 shadow-md">
                                            ● Live
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    
                </div>
            </div>
        </div>
    );
}
