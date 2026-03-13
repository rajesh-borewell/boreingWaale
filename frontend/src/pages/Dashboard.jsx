import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import { PlusCircle, Search, Activity, Zap, Database, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import Background3D from '../components/Background3D';

export default function Dashboard() {
    const [stats, setStats] = useState({ totalCount: 0 });
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const navigate = useNavigate();

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/bills/stats');
                setStats(res.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const containerVariants = {
        animate: { transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        initial: { y: 20, opacity: 0, filter: "blur(10px)" },
        animate: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.8 } }
    };

    return (
        <div className="relative min-h-screen bg-black overflow-hidden selection:bg-indigo-500/30">
            <Background3D />

            <div className="relative z-10 pt-20 pb-16 px-6 max-w-7xl mx-auto space-y-10">
                {/* Header HUD Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-6"
                >
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full border mb-4 backdrop-blur-md relative group cursor-default overflow-hidden transition-colors duration-500 ${
                            isOnline 
                            ? 'bg-indigo-500/10 border-indigo-500/20 shadow-[0_0_20px_rgba(79,70,229,0.1)]' 
                            : 'bg-red-500/10 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                        }`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ${
                            isOnline ? 'via-indigo-500/10' : 'via-red-500/10'
                        }`} />
                        <Globe className={`w-5 h-5 group-hover:rotate-180 transition-transform duration-1000 ${
                            isOnline ? 'text-indigo-400' : 'text-red-400'
                        }`} />
                        <span className={`text-xs font-black tracking-[0.5em] uppercase transition-colors duration-500 ${
                            isOnline ? 'text-indigo-300' : 'text-red-500'
                        }`}>
                            SYSTEM STATUS: {isOnline ? 'ONLINE' : 'OFFLINE'}
                        </span>
                    </motion.div>
                    
                    <div className="relative inline-block py-4">
                        <motion.h1 
                            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter italic flex flex-wrap justify-center gap-x-1 sm:gap-x-2 md:gap-x-4 select-none"
                            style={{ 
                                perspective: '1200px',
                                textShadow: '0 0 30px rgba(139, 92, 246, 0.3)'
                            }}
                        >
                            {"DIGITAL DASHBOARD".split("").map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, rotateX: -90, y: 60, filter: 'blur(20px)' }}
                                    animate={{ opacity: 1, rotateX: 0, y: 0, filter: 'blur(0px)' }}
                                    transition={{ 
                                        duration: 1.5, 
                                        delay: i * 0.06, 
                                        ease: [0.16, 1, 0.3, 1] 
                                    }}
                                    whileHover={{ 
                                        scale: 1.15, 
                                        y: -15,
                                        color: '#22d3ee',
                                        transition: { duration: 0.3 }
                                    }}
                                    className={`inline-block text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-400 to-cyan-400 relative px-4 py-2 overflow-visible ${char === '_' ? 'mx-6' : '-mx-3'}`}
                                >
                                    {char === '_' ? ' ' : char}
                                    
                                    {/* Holographic Ghosting Layer */}
                                    <motion.span 
                                        className="absolute inset-0 text-cyan-500/30 blur-md -z-10"
                                        animate={{ 
                                            opacity: [0, 0.6, 0],
                                            scale: [1, 1.2, 1],
                                            x: [-2, 2, -2]
                                        }}
                                        transition={{ 
                                            duration: 4, 
                                            repeat: Infinity, 
                                            delay: i * 0.15 
                                        }}
                                    >
                                        {char === '_' ? ' ' : char}
                                    </motion.span>
                                </motion.span>
                            ))}
                        </motion.h1>
                        
                        {/* Premium Underline HUD */}
                        <motion.div 
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: '100%', opacity: 1 }}
                            transition={{ duration: 2, delay: 1.2 }}
                            className="h-[2px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent mt-4 relative"
                        >
                            <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full blur-[4px] -translate-y-1/2 animate-[ping_2s_infinite]" />
                            <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 rounded-full blur-[4px] -translate-y-1/2 animate-[ping_2s_infinite_1s]" />
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-white/20 -translate-y-3" />
                        </motion.div>
                    </div>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        transition={{ delay: 2 }}
                        className="text-indigo-200/40 font-black text-sm tracking-[0.6em] uppercase italic bg-white/5 py-2 px-8 rounded-full border border-white/5 inline-block"
                    >
                        Accessing Encrypted Cloud Database...
                    </motion.p>
                </motion.div>

                {/* Central Statistics Singularity */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex justify-center"
                >
                    <div className="relative group">
                        <div className="absolute -inset-10 bg-indigo-500/20 blur-[100px] rounded-full animate-pulse" />
                        <div className="hud-card hologram-border w-64 h-64 rounded-full flex flex-col items-center justify-center text-center p-8 bg-black/60 backdrop-blur-3xl border-indigo-500/30 group-hover:border-indigo-500/60 transition-colors">
                            <div className="scanline" />
                            <Database className="w-8 h-8 text-indigo-400 mb-2 glow-violet" />
                            <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest opacity-60">Total Records</span>
                            <span className="text-6xl font-black text-white glow-violet leading-none my-2 tabular-nums">
                                {loading ? '--' : stats.totalCount}
                            </span>
                            <div className="flex items-center gap-1.5 mt-2">
                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-500 ${
                                    isOnline 
                                    ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' 
                                    : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                                }`} />
                                <span className={`text-[9px] font-mono transition-colors duration-500 ${
                                    isOnline ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {isOnline ? 'SYNC LATEST DATA' : 'SYNC STOPPED'}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Navigation Modules */}
                <motion.div
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {/* Create Bill - VOID_INIT */}
                    <motion.button
                        variants={itemVariants}
                        onClick={() => navigate('/create')}
                        className="group relative hud-card hologram-border p-10 text-left transition-all hover:scale-[1.02]"
                    >
                        <div className="scanline" />
                        <div className="flex flex-col h-full gap-6">
                            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/30 group-hover:bg-indigo-500/20 transition-all">
                                <Zap className="w-8 h-8 text-indigo-400 glow-violet" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white italic mb-3 tracking-tight">CREATE BILL</h2>
                                <p className="text-gray-400 font-mono text-xs leading-relaxed opacity-80 group-hover:opacity-100">
                                    Generate a new invoice thread. Autonomous calculations and immediate distribution protocols enabled.
                                </p>
                            </div>
                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-mono text-indigo-300 tracking-widest uppercase">Expansion Protocol: 001</span>
                                <Activity className="w-4 h-4 text-indigo-500" />
                            </div>
                        </div>
                    </motion.button>

                    {/* View History - HISTORY_LOG */}
                    <motion.button
                        variants={itemVariants}
                        onClick={() => navigate('/history')}
                        className="group relative hud-card hologram-border p-10 text-left transition-all hover:scale-[1.02]"
                    >
                        <div className="scanline" />
                        <div className="flex flex-col h-full gap-6">
                            <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/30 group-hover:bg-cyan-500/20 transition-all">
                                <Search className="w-8 h-8 text-cyan-400 glow-cyan" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white italic mb-3 tracking-tight">BILL HISTORY</h2>
                                <p className="text-gray-400 font-mono text-xs leading-relaxed opacity-80 group-hover:opacity-100">
                                    Search across the database history. Decrypt past invoice signatures and review archived domains.
                                </p>
                            </div>
                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-mono text-cyan-300 tracking-widest uppercase">Archive Protocol: 024</span>
                                <Database className="w-4 h-4 text-cyan-500" />
                            </div>
                        </div>
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}
