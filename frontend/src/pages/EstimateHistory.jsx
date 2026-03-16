import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../lib/axios';
import {
    Search,
    Eye,
    Calendar,
    User,
    Hash,
    RotateCcw,
    Activity,
    Terminal,
    HardDrive,
    Database,
    Binary,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import Background3D from '../components/Background3D';

export default function EstimateHistory() {
    const [estimates, setEstimates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const estimatesPerPage = 15;
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useState({
        estimateNumber: '',
        clientName: '',
        startDate: '',
        endDate: ''
    });

    const fetchEstimates = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchParams.estimateNumber) params.append('estimateNumber', searchParams.estimateNumber);
            if (searchParams.clientName) params.append('clientName', searchParams.clientName);
            if (searchParams.startDate) params.append('startDate', searchParams.startDate);
            if (searchParams.endDate) params.append('endDate', searchParams.endDate);

            const res = await axios.get(`/estimates?${params.toString()}`);
            setEstimates(res.data);
            setCurrentPage(1); // Reset to first page on search
        } catch (err) {
            console.error('NO ESTIMATE FOUND:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEstimates();
    }, []);

    const handleSearchChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchEstimates();
    };

    const handleClearFilters = () => {
        const resetParams = {
            estimateNumber: '',
            clientName: '',
            startDate: '',
            endDate: ''
        };
        setSearchParams(resetParams);
        setLoading(true);
        axios.get('/estimates')
            .then(res => {
                setEstimates(res.data);
                setCurrentPage(1);
            })
            .catch(err => console.error('PROTOCOL_RESET_ERROR:', err))
            .finally(() => setLoading(false));
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <div className="relative min-h-[90vh] pt-32 pb-8 px-4 md:px-8 font-mono overflow-hidden">
            <Background3D />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-7xl mx-auto space-y-8"
            >
                {/* Header Section */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 text-violet-400 mb-2">
                            <Database className="w-5 h-5 animate-pulse" />
                            <span className="text-[10px] tracking-[0.4em] uppercase opacity-70">Cloud Database Connected</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic text-glow uppercase">
                            ESTIMATES HISTORY
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
                        <div className="text-right">
                            <div className="text-[11px] text-gray-500 uppercase tracking-widest leading-none mb-1">Total Estimates</div>
                            <div className="text-2xl font-black text-white leading-none">{estimates.length}</div>
                        </div>
                        <div className="w-[1px] h-10 bg-white/10"></div>
                        <Activity className="w-8 h-8 text-violet-500 opacity-50" />
                    </div>
                </motion.div>

                {/* Search Filter Protocol */}
                <motion.div variants={itemVariants} className="hud-card glassmorphism p-4 sm:p-6 md:p-8 border-white/5 relative overflow-hidden group">
                    <div className="scanline"></div>
                    <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                        <Terminal className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-xs font-black text-gray-400 tracking-[0.3em] uppercase italic">ESTIMATE FILTER PROTOCOL</h2>
                    </div>

                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        <div className="space-y-2">
                            <label className="text-[12px] text-violet-400/60 font-black uppercase tracking-widest ml-1">ESTIMATE NO.</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                <input
                                    type="text"
                                    name="estimateNumber"
                                    placeholder="EST_#"
                                    value={searchParams.estimateNumber}
                                    onChange={handleSearchChange}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-3 pl-10 text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-1 lg:col-span-2 space-y-2">
                            <label className="text-[12px] text-violet-400/60 font-black uppercase tracking-widest ml-1">CLIENT NAME</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                <input
                                    type="text"
                                    name="clientName"
                                    placeholder="SCAN_IDENTIFIER..."
                                    value={searchParams.clientName}
                                    onChange={handleSearchChange}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-3 pl-10 text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 lg:min-w-[240px]">
                            <label className="text-[12px] text-violet-400/60 font-black uppercase tracking-widest ml-1">Date Range</label>
                            <div className="relative flex items-center bg-white/[0.03] border border-white/5 rounded-xl px-1 h-[46px]">
                                <div className="flex items-center flex-1 gap-0.5 min-w-0">
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={searchParams.startDate}
                                        onChange={handleSearchChange}
                                        className="w-full bg-transparent border-none text-cyan-400 text-[11px] p-1 pr-0 focus:ring-0 cursor-pointer [color-scheme:dark] font-black"
                                    />
                                    <span className="text-gray-700 text-[10px] flex-shrink-0 font-black">-</span>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={searchParams.endDate}
                                        onChange={handleSearchChange}
                                        className="w-full bg-transparent border-none text-cyan-400 text-[11px] p-1 pr-0 focus:ring-0 cursor-pointer [color-scheme:dark] font-black"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-end gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(139, 92, 246, 0.2)" }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="flex-1 bg-violet-600/10 border border-violet-500/30 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                            >
                                <Search className="w-4 h-4" />
                                SEARCH
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02, rotate: -180 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={handleClearFilters}
                                className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
                                title="RESET FILTERS"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </form>
                </motion.div>

                {/* Records Table - TEMPORAL_MATRIX */}
                <motion.div variants={itemVariants} className="hud-card glassmorphism border-white/5 relative overflow-hidden min-h-[400px]">
                    <div className="scanline opacity-20"></div>

                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-violet-400">
                            <div className="w-12 h-12 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-4"></div>
                            <span className="text-[10px] tracking-[0.4em] uppercase animate-pulse">LOADING RECORDS...</span>
                        </div>
                    ) : estimates.length === 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                            <HardDrive className="w-12 h-12 mb-4 opacity-20" />
                            <h3 className="text-xl font-black uppercase italic tracking-widest mb-2">History Empty</h3>
                            <p className="text-[10px] uppercase tracking-widest opacity-50">No estimates found with specified filters.</p>
                            <button onClick={handleClearFilters} className="mt-6 text-violet-400 underline uppercase text-[12px] font-black tracking-widest hover:text-white transition-colors">Reset Filters</button>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-left border-collapse">
                                <thead className="bg-white/[0.02] border-b border-white/5 text-[9px] md:text-[12px] uppercase tracking-widest md:tracking-[0.2em] font-black text-violet-400/60 italic">
                                    <tr>
                                        <th className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">EST NO.</th>
                                        <th className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">DATE</th>
                                        <th className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">CLIENT NAME</th>
                                        <th className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">TOTAL AMOUNT</th>
                                        <th className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">USER CREATED</th>
                                        <th className="px-4 md:px-8 py-4 md:py-6 text-right whitespace-nowrap">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {estimates.slice((currentPage - 1) * estimatesPerPage, currentPage * estimatesPerPage).map((est, index) => (
                                        <motion.tr
                                            key={est._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-white/5 hover:bg-white/[0.04] transition-all group relative cursor-pointer"
                                            onClick={() => navigate(`/view-estimate/${est._id}`)}
                                        >
                                            <td className="px-4 md:px-8 py-4 md:py-6">
                                                <span className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors">
                                                    #{String(est.estimateNumber).padStart(4, '0')}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6 text-gray-500 text">
                                                {new Date(est.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')}
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-300 font-bold tracking-tight uppercase group-hover:text-white transition-colors">{est.clientName}</span>
                                                    <span className="text-[11px] text-gray-600 uppercase tracking-widest">ID: {est._id.slice(-6).toUpperCase()}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6">
                                                <div className="flex items-baseline gap-1 text-white font-black italic">
                                                    <span className="text-[14px] text-violet-400 opacity-50">₹</span>
                                                    <span className="text-base group-hover:text-glow-cyan transition-all">
                                                        {est.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6">
                                                {est.createdBy ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                                                        <span className="text-[12px] uppercase font-black text-gray-400">{est.createdBy.username.split(' ')[0]}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-gray-700 italic">SYSTEM GEN</span>
                                                )}
                                            </td>
                                            <td className="px-4 md:px-8 py-4 md:py-6 text-right">
                                                <motion.button
                                                    whileHover={{ x: 5 }}
                                                    className="inline-flex items-center gap-2 text-violet-400 group-hover:text-white transition-colors"
                                                >
                                                    <span className="text-[10px] font-black uppercase tracking-widest group-hover:opacity-100 opacity-0 transition-opacity">View</span>
                                                    <Eye className="w-5 h-5" />
                                                </motion.button>
                                            </td>
                                            {/* Glow Overlay */}
                                            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {estimates.length > estimatesPerPage && (
                            <div className="p-6 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black italic">
                                    Displaying {Math.min((currentPage - 1) * estimatesPerPage + 1, estimates.length)} - {Math.min(currentPage * estimatesPerPage, estimates.length)} of {estimates.length} records
                                </div>
                                <div className="flex items-center gap-4">
                                    <motion.button
                                        whileHover={currentPage > 1 ? { scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" } : {}}
                                        whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 transition-all text-[10px] font-black uppercase tracking-widest ${
                                            currentPage === 1 ? 'opacity-20 cursor-not-allowed' : 'text-cyan-400 hover:text-white'
                                        }`}
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Prev
                                    </motion.button>
                                    
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-gray-400 font-black">PAGE</span>
                                        <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-violet-600/20 border border-violet-500/30 text-white text-xs font-black italic">
                                            {currentPage}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-black">OF {Math.ceil(estimates.length / estimatesPerPage)}</span>
                                    </div>

                                    <motion.button
                                        whileHover={currentPage < Math.ceil(estimates.length / estimatesPerPage) ? { scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" } : {}}
                                        whileTap={currentPage < Math.ceil(estimates.length / estimatesPerPage) ? { scale: 0.95 } : {}}
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(estimates.length / estimatesPerPage)))}
                                        disabled={currentPage === Math.ceil(estimates.length / estimatesPerPage)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 transition-all text-[10px] font-black uppercase tracking-widest ${
                                            currentPage === Math.ceil(estimates.length / estimatesPerPage) ? 'opacity-20 cursor-not-allowed' : 'text-cyan-400 hover:text-white'
                                        }`}
                                    >
                                        Next <ChevronRight className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>

                {/* Footer Status Logs */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] md:text-[9px] text-gray-600 uppercase tracking-[0.4em] font-black pt-8 opacity-40 select-none">
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span>STATUS: ESTIMATE_RECORDS_FETCHED</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Binary className="w-3 h-3" />
                            <span>ENCRYPTION: CURSED_TECH_V4</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>LATENCY: 14MS</span>
                        <div className="h-2 w-[5px] bg-gray-800"></div>
                        <span>UID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
