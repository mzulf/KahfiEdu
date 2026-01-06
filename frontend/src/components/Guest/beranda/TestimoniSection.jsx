import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

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
        yesterday: 0,
        weekly: 0,
        monthly: 0,
        total: 0
    });
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState('');

    // Firebase Configuration
    const FIREBASE_CONFIG = {
        databaseURL: "https://kahfiedu-9a7f0-default-rtdb.asia-southeast1.firebasedatabase.app/"
    };

    // Helper functions - Pakai timezone Indonesia (WIB = UTC+7)
    const getDateKey = (daysOffset = 0) => {
        const now = new Date();
        // Convert ke WIB (UTC+7)
        const wibTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
        wibTime.setDate(wibTime.getDate() + daysOffset);
        return wibTime.toISOString().split('T')[0];
    };

    const getWeekKey = () => {
        const now = new Date();
        // Convert ke WIB (UTC+7)
        const wibTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
        const year = wibTime.getFullYear();
        const startOfYear = new Date(year, 0, 1);
        const dayOfYear = Math.floor((wibTime - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
        const dayOfWeek = startOfYear.getDay();
        const weekNumber = Math.ceil((dayOfYear + dayOfWeek) / 7);
        return `${year}-W${weekNumber}`;
    };

    const getMonthKey = () => {
        const now = new Date();
        // Convert ke WIB (UTC+7)
        const wibTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
        return `${wibTime.getFullYear()}-${String(wibTime.getMonth() + 1).padStart(2, '0')}`;
    };

    // Calculate percentage change
    const calculateChange = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
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
            
            const sessionKey = `session_tracked_${dateKey}`;
            const hasTrackedThisSession = sessionStorage.getItem(sessionKey);
            
            if (!hasTrackedThisSession) {
                await Promise.all([
                    firebaseIncrement(`stats/daily/${dateKey}`),
                    firebaseIncrement(`stats/weekly/${weekKey}`),
                    firebaseIncrement(`stats/monthly/${monthKey}`),
                    firebaseIncrement('stats/total')
                ]);

                sessionStorage.setItem(sessionKey, 'true');
            }

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
            const yesterdayKey = getDateKey(-1);
            const weekKey = getWeekKey();
            const monthKey = getMonthKey();

            const [daily, yesterday, weekly, monthly, total] = await Promise.all([
                firebaseGet(`stats/daily/${dateKey}`),
                firebaseGet(`stats/daily/${yesterdayKey}`),
                firebaseGet(`stats/weekly/${weekKey}`),
                firebaseGet(`stats/monthly/${monthKey}`),
                firebaseGet('stats/total')
            ]);

            setStats({
                daily: daily || 0,
                yesterday: yesterday || 0,
                weekly: weekly || 0,
                monthly: monthly || 0,
                total: total || 0
            });

            const now = new Date();
            setLastUpdate(now.toLocaleTimeString('id-ID'));
            setLoading(false);

        } catch (err) {
            console.error('Error fetching stats:', err);
            setLoading(false);
        }
    };

    // Render trend indicator
    const TrendIndicator = ({ current, previous }) => {
        const change = calculateChange(current, previous);
        
        if (change > 0) {
            return (
                <div className="flex items-center text-green-600 text-xs font-semibold">
                    <TrendingUp size={14} className="mr-1" />
                    +{change}%
                </div>
            );
        } else if (change < 0) {
            return (
                <div className="flex items-center text-red-600 text-xs font-semibold">
                    <TrendingDown size={14} className="mr-1" />
                    {change}%
                </div>
            );
        } else {
            return (
                <div className="flex items-center text-gray-500 text-xs font-semibold">
                    <Minus size={14} className="mr-1" />
                    0%
                </div>
            );
        }
    };

    useEffect(() => {
        trackVisitor();
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    // Calculate average
    const avgDaily = stats.total > 0 ? Math.round(stats.total / 30) : 0; // rough estimate

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
            
              
            </div>
        </div>
    );
}