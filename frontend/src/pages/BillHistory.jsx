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
    ChevronRight,
    CheckCircle,
    Banknote,
    CreditCard,
    X,
    AlertCircle,
    Globe
} from 'lucide-react';
import Background3D from '../components/Background3D';

export default function BillHistory() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const billsPerPage = 15;
    const navigate = useNavigate();

    const [paymentModal, setPaymentModal] = useState({ isOpen: false, bill: null });
    const [paymentForm, setPaymentForm] = useState({ mode: 'Cash', chequeNumber: '' });
    const [isUpdating, setIsUpdating] = useState(false);

    const [searchParams, setSearchParams] = useState({
        billNumber: '',
        clientName: '',
        startDate: '',
        endDate: ''
    });

    const fetchBills = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchParams.billNumber) params.append('billNumber', searchParams.billNumber);
            if (searchParams.clientName) params.append('clientName', searchParams.clientName);
            if (searchParams.startDate) params.append('startDate', searchParams.startDate);
            if (searchParams.endDate) params.append('endDate', searchParams.endDate);

            const res = await axios.get(`/bills?${params.toString()}`);
            setBills(res.data);
            setCurrentPage(1); // Reset to first page on search
        } catch (err) {
            console.error('NO BILL FOUND:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, []);

    const handleSearchChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBills();
    };

    const handleClearFilters = () => {
        const resetParams = {
            billNumber: '',
            clientName: '',
            startDate: '',
            endDate: ''
        };
        setSearchParams(resetParams);
        setLoading(true);
        axios.get('/bills')
            .then(res => {
                setBills(res.data);
                setCurrentPage(1);
            })
            .catch(err => console.error('PROTOCOL_RESET_ERROR:', err))
            .finally(() => setLoading(false));
    };

    const openPaymentModal = (e, bill) => {
        e.stopPropagation();
        setPaymentModal({ isOpen: true, bill });
        setPaymentForm({ mode: 'Cash', chequeNumber: '' });
    };

    const closePaymentModal = () => {
        setPaymentModal({ isOpen: false, bill: null });
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            await axios.put(`/bills/${paymentModal.bill._id}`, {
                paymentStatus: 'Received',
                paymentDate: new Date(),
                paymentMode: paymentForm.mode,
                chequeNumber: paymentForm.mode === 'Cheque' ? paymentForm.chequeNumber : undefined
            });
            // Update local state
            setBills(bills.map(b =>
                b._id === paymentModal.bill._id
                    ? { ...b, paymentStatus: 'Received', paymentDate: new Date().toISOString(), paymentMode: paymentForm.mode, chequeNumber: paymentForm.mode === 'Cheque' ? paymentForm.chequeNumber : undefined }
                    : b
            ));
            closePaymentModal();
        } catch (err) {
            console.error("Error updating payment status", err);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRevertPayment = async (e, bill) => {
        e.stopPropagation();
        try {
            await axios.put(`/bills/${bill._id}`, {
                paymentStatus: 'Pending',
                paymentDate: null,
                paymentMode: null,
                chequeNumber: null
            });
            setBills(bills.map(b =>
                b._id === bill._id
                    ? { ...b, paymentStatus: 'Pending', paymentDate: null, paymentMode: null, chequeNumber: null }
                    : b
            ));
        } catch (err) {
            console.error("Error reverting payment status", err);
        }
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
                            <span className="text-[10px] tracking-[0.4em] uppercase opacity-70">Cloud Databse Connected</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic text-glow uppercase">
                            BILLS HISTORY
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 p-4 rounded-2xl backdrop-blur-xl">
                        <div className="text-right">
                            <div className="text-[11px] text-gray-500 uppercase tracking-widest leading-none mb-1">Total Bills</div>
                            <div className="text-2xl font-black text-white leading-none">{bills.length}</div>
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
                        <h2 className="text-xs font-black text-gray-400 tracking-[0.3em] uppercase italic">RECORDS FILTER PROTOCOL</h2>
                    </div>

                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        <div className="space-y-2">
                            <label className="text-[12px] text-violet-400/60 font-black uppercase tracking-widest ml-1">BILL NUMBER</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                                <input
                                    type="text"
                                    name="billNumber"
                                    placeholder="RECORD_#"
                                    value={searchParams.billNumber}
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
                    ) : bills.length === 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                            <HardDrive className="w-12 h-12 mb-4 opacity-20" />
                            <h3 className="text-xl font-black uppercase italic tracking-widest mb-2">Records Empty</h3>
                            <p className="text-[10px] uppercase tracking-widest opacity-50">No records found with specified filters.</p>
                            <button onClick={handleClearFilters} className="mt-6 text-violet-400 underline uppercase text-[12px] font-black tracking-widest hover:text-white transition-colors">Reset Filters</button>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="overflow-x-auto flex-1 custom-scrollbar">
                                <table className="w-full text-left border-collapse min-w-[900px]">
                                    <thead className="bg-white/[0.02] border-b border-white/5 text-[9px] md:text-[12px] uppercase tracking-widest md:tracking-[0.2em] font-black text-violet-400/60 italic">
                                        <tr>
                                            <th className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">BILL NO.</th>
                                            <th className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">DATE</th>
                                            <th className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">CLIENT NAME</th>
                                            <th className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">TOTAL AMOUNT</th>
                                            <th className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">STATUS</th>
                                            <th className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">USER CREATED</th>
                                            <th className="px-4 md:px-8 py-4 md:py-6 text-right whitespace-nowrap">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {bills.slice((currentPage - 1) * billsPerPage, currentPage * billsPerPage).map((bill, index) => (
                                            <motion.tr
                                                key={bill._id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="border-b border-white/5 hover:bg-white/[0.04] transition-all group relative cursor-pointer"
                                                onClick={() => navigate(`/view/${bill._id}`)}
                                            >
                                                <td className="px-4 md:px-8 py-4 md:py-6">
                                                    <span className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors">
                                                        #{String(bill.billNumber).padStart(4, '0')}
                                                    </span>
                                                </td>
                                                <td className="px-4 md:px-8 py-4 md:py-6 text-gray-500 text">
                                                    {new Date(bill.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')}
                                                </td>
                                                <td className="px-4 md:px-8 py-4 md:py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-300 font-bold tracking-tight uppercase group-hover:text-white transition-colors">{bill.clientName}</span>
                                                        <span className="text-[11px] text-gray-600 uppercase tracking-widest">ID: {bill._id.slice(-6).toUpperCase()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 md:px-8 py-4 md:py-6">
                                                    <div className="flex items-baseline gap-1 text-white font-black italic">
                                                        <span className="text-[14px] text-violet-400 opacity-50">₹</span>
                                                        <span className="text-base group-hover:text-glow-cyan transition-all">
                                                            {bill.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 md:px-8 py-4 md:py-6">
                                                    {bill.paymentStatus === 'Received' ? (
                                                        <div className="flex flex-col items-start gap-1">
                                                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                                                <CheckCircle className="w-3 h-3" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">RECEIVED</span>
                                                            </div>
                                                            <div className="text-[9px] text-gray-500 font-mono tracking-widest uppercase">
                                                                {bill.paymentMode} {bill.chequeNumber ? `- ${bill.chequeNumber}` : ''}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400">
                                                            <AlertCircle className="w-3 h-3" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">PENDING</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 md:px-8 py-4 md:py-6">
                                                    {bill.createdBy ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                                                            <span className="text-[12px] uppercase font-black text-gray-400">{bill.createdBy.username.split(' ')[0]}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] text-gray-700 italic">SYSTEM GEN</span>
                                                    )}
                                                </td>
                                                <td className="px-4 md:px-8 py-4 md:py-6 text-right">
                                                    <div className="flex items-center justify-end gap-4">
                                                        {bill.paymentStatus === 'Received' ? (
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={(e) => handleRevertPayment(e, bill)}
                                                                className="text-rose-400 hover:text-rose-300 transition-colors group/btn relative"
                                                                title="Revert to Pending"
                                                            >
                                                                <RotateCcw className="w-4 h-4" />
                                                                <span className="absolute -top-8 right-0 bg-black/80 border border-white/10 px-2 py-1 rounded text-[9px] font-black tracking-widest uppercase opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">Revert Status</span>
                                                            </motion.button>
                                                        ) : (
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={(e) => openPaymentModal(e, bill)}
                                                                className="text-emerald-400 hover:text-emerald-300 transition-colors group/btn relative"
                                                                title="Mark as Received"
                                                            >
                                                                <Banknote className="w-4 h-4" />
                                                                <span className="absolute -top-8 right-0 bg-black/80 border border-white/10 px-2 py-1 rounded text-[9px] font-black tracking-widest uppercase opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">Mark Received</span>
                                                            </motion.button>
                                                        )}

                                                        <motion.button
                                                            whileHover={{ x: 5 }}
                                                            className="inline-flex items-center gap-2 text-violet-400 group-hover:text-white transition-colors"
                                                        >
                                                            <span className="text-[10px] font-black uppercase tracking-widest group-hover:opacity-100 opacity-0 transition-opacity hidden md:inline-block">View</span>
                                                            <Eye className="w-5 h-5" />
                                                        </motion.button>
                                                    </div>
                                                </td>
                                                {/* Glow Overlay */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-opacity ${bill.paymentStatus === 'Received' ? 'bg-emerald-500 opacity-20 group-hover:opacity-100' : 'bg-rose-500 opacity-20 group-hover:opacity-100'}`}></div>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            {bills.length > billsPerPage && (
                                <div className="p-6 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-black italic">
                                        Displaying {Math.min((currentPage - 1) * billsPerPage + 1, bills.length)} - {Math.min(currentPage * billsPerPage, bills.length)} of {bills.length} records
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <motion.button
                                            whileHover={currentPage > 1 ? { scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" } : {}}
                                            whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 transition-all text-[10px] font-black uppercase tracking-widest ${currentPage === 1 ? 'opacity-20 cursor-not-allowed' : 'text-cyan-400 hover:text-white'
                                                }`}
                                        >
                                            <ChevronLeft className="w-4 h-4" /> Prev
                                        </motion.button>

                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-gray-400 font-black">PAGE</span>
                                            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-violet-600/20 border border-violet-500/30 text-white text-xs font-black italic">
                                                {currentPage}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-black">OF {Math.ceil(bills.length / billsPerPage)}</span>
                                        </div>

                                        <motion.button
                                            whileHover={currentPage < Math.ceil(bills.length / billsPerPage) ? { scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" } : {}}
                                            whileTap={currentPage < Math.ceil(bills.length / billsPerPage) ? { scale: 0.95 } : {}}
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(bills.length / billsPerPage)))}
                                            disabled={currentPage === Math.ceil(bills.length / billsPerPage)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 transition-all text-[10px] font-black uppercase tracking-widest ${currentPage === Math.ceil(bills.length / billsPerPage) ? 'opacity-20 cursor-not-allowed' : 'text-cyan-400 hover:text-white'
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
                            <span>STATUS: ENTITY_RECORDS_FETCHED</span>
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

            {/* Payment Modal */}
            <AnimatePresence>
                {paymentModal.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-[#0a0a0f] border border-emerald-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)]"
                        >
                            <div className="p-6 border-b border-white/5 relative">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase flex items-center gap-2">
                                        <Banknote className="w-5 h-5 text-emerald-400" />
                                        Update Payment Status
                                    </h3>
                                    <button onClick={closePaymentModal} className="text-gray-500 hover:text-white transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 tracking-widest uppercase">
                                    Bill #{String(paymentModal.bill?.billNumber).padStart(4, '0')} - {paymentModal.bill?.clientName}
                                </p>
                            </div>

                            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[11px] text-emerald-400/80 font-black uppercase tracking-widest">Payment Mode</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Cash', 'Cheque', 'Online'].map((mode) => (
                                            <button
                                                type="button"
                                                key={mode}
                                                onClick={() => setPaymentForm({ ...paymentForm, mode, chequeNumber: mode !== 'Cheque' ? '' : paymentForm.chequeNumber })}
                                                className={`py-2 px-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${paymentForm.mode === mode
                                                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                                                        : 'bg-white/[0.02] border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300'
                                                    }`}
                                            >
                                                {mode === 'Cash' && <Banknote className="w-4 h-4" />}
                                                {mode === 'Cheque' && <CreditCard className="w-4 h-4" />}
                                                {mode === 'Online' && <Globe className="w-4 h-4" />}
                                                <span className="text-[10px] font-black uppercase tracking-widest">{mode}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {paymentForm.mode === 'Cheque' && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="space-y-2 overflow-hidden"
                                        >
                                            <label className="text-[11px] text-emerald-400/80 font-black uppercase tracking-widest flex items-center gap-2">
                                                <Hash className="w-3 h-3" /> Cheque Number
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={paymentForm.chequeNumber}
                                                onChange={(e) => setPaymentForm({ ...paymentForm, chequeNumber: e.target.value })}
                                                placeholder="Enter cheque/reference number"
                                                className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm font-mono"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={closePaymentModal}
                                        className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="flex-1 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-black uppercase tracking-widest hover:bg-emerald-500/30 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50"
                                    >
                                        {isUpdating ? 'Updating...' : 'Confirm'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
