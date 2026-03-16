import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import { Plus, Trash2, Save, Calendar, Activity, Zap, Database, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Background3D from '../components/Background3D';

export default function CreateEstimate() {
    const navigate = useNavigate();
    const [clientName, setClientName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState([{ srNo: 1, particulars: '', qty: 1, rate: 0, amount: 0 }]);
    const [grandTotal, setGrandTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);

    useEffect(() => {
        setIsCalculating(true);
        const timer = setTimeout(() => {
            const total = items.reduce((sum, item) => sum + (item.amount || 0), 0);
            setGrandTotal(total);
            setIsCalculating(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [items]);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        const item = newItems[index];

        if (field === 'qty' || field === 'rate') {
            const numValue = parseFloat(value) || 0;
            item[field] = numValue;
            item.amount = item.qty * item.rate;
        } else {
            item[field] = value;
        }
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { srNo: items.length + 1, particulars: '', qty: 1, rate: 0, amount: 0 }]);
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        newItems.forEach((item, i) => item.srNo = i + 1);
        setItems(newItems);
    };

    const setToday = () => {
        setDate(new Date().toISOString().split('T')[0]);
    };

    const handleSave = async () => {
        if (!clientName) return toast.error('PROTOCOL ERROR: CLIENT NAME REQUIRED');
        setLoading(true);
        const toastId = toast.loading('INITIATING SAVE PROTOCOL...');
        try {
            const payload = { clientName, date, items, grandTotal };
            const res = await axios.post('/estimates', payload);
            toast.success('ESTIMATE GENERATED SUCCESSFULLY', { id: toastId });
            navigate(`/view-estimate/${res.data._id}`);
        } catch (err) {
            console.error(err);
            toast.error('PROTOCOL FAILURE: RETRY REQUIRED', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-black overflow-x-hidden pt-32 pb-20 px-4">
            <Background3D />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 max-w-5xl mx-auto"
            >
                {/* HUD Frame */}
                <div className="hud-card hologram-border rounded-3xl overflow-hidden backdrop-blur-3xl bg-black/40">
                    <div className="scanline" />

                    {/* Header */}
                    <div className="bg-indigo-500/10 border-b border-white/5 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                        <div className="w-full md:w-auto">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-5 h-5 text-indigo-400 glow-violet" />
                                <span className="text-[10px] font-mono text-indigo-300 tracking-[0.4em] uppercase whitespace-nowrap">Void Manifest 002</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase leading-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">INITIATE ESTIMATE</span>
                            </h2>
                        </div>
                        <div className="flex flex-col items-start md:items-end w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                            <span className="text-[10px] font-mono text-gray-500 uppercase">System State</span>
                            <div className="flex items-center gap-2 text-green-400 font-mono text-xs">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                STABLE READY
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-12">
                        {/* Domain Config (Inputs) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[12px] font-mono text-indigo-300 uppercase tracking-widest opacity-70">
                                    <Activity className="w-3 h-3" /> Entity Name
                                </label>
                                <input
                                    type="text"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-white font-mono placeholder:text-gray-700 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all outline-none"
                                    placeholder="Enter customer name..."
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[12px] font-mono text-indigo-300 uppercase tracking-widest opacity-70">
                                    <Activity className="w-3 h-3" /> Estimate Date
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1 group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500/40 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full bg-black/60 border border-white/10 rounded-xl pl-12 pr-5 py-4 text-white font-mono focus:border-indigo-500/50 outline-none [color-scheme:dark]"
                                        />
                                    </div>
                                    <button
                                        onClick={setToday}
                                        className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-inner"
                                        title="RESET_TEMPORAL_COORDS"
                                    >
                                        <RotateCcw className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Item Matrix Grid */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <div className="flex items-center gap-3">
                                    <Database className="w-5 h-5 text-cyan-400" />
                                    <h3 className="text-xl font-bold text-white tracking-tight uppercase italic">Item Details</h3>
                                </div>
                                <div className="text-[10px] font-mono text-gray-500">ROWS: {items.length}</div>
                            </div>

                            <div className="space-y-4">
                                {/* Matrix Header */}
                                <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-[12px] font-mono text-gray-500 uppercase tracking-widest">
                                    <div className="col-span-1">sr.no</div>
                                    <div className="col-span-5">Particulars</div>
                                    <div className="col-span-2 text-right">Qty</div>
                                    <div className="col-span-2 text-right">Rate</div>
                                    <div className="col-span-2 text-right">Amount</div>
                                </div>

                                <AnimatePresence mode="popLayout">
                                    {items.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="grid grid-cols-2 md:grid-cols-12 gap-4 bg-white/[0.03] border border-white/5 p-5 md:p-4 rounded-xl items-center relative group hover:border-indigo-500/30 transition-colors"
                                        >
                                            {/* Mobile Label for SR */}
                                            <div className="md:hidden col-span-2 flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                                                <span className="text-[10px] font-mono text-indigo-400 font-black tracking-widest uppercase">Item Sequence: #{String(item.srNo).padStart(2, '0')}</span>
                                                <button
                                                    onClick={() => removeItem(index)}
                                                    className="text-red-500 p-2 bg-red-500/10 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="col-span-1 hidden md:flex justify-center text-[10px] font-mono text-indigo-400">
                                                [{String(item.srNo).padStart(2, '0')}]
                                            </div>

                                            <div className="col-span-2 md:col-span-5 flex flex-col gap-1.5">
                                                <label className="md:hidden text-[9px] font-mono text-gray-500 uppercase tracking-widest">Particulars</label>
                                                <input
                                                    type="text"
                                                    value={item.particulars}
                                                    onChange={(e) => handleItemChange(index, 'particulars', e.target.value)}
                                                    className="w-full bg-white/[0.02] md:bg-transparent border border-white/5 md:border-none rounded-lg md:rounded-none px-3 py-2.5 md:p-0 text-sm text-white font-mono placeholder:text-gray-700 outline-none focus:bg-white/5 transition-colors"
                                                    placeholder="ENTITY TYPE..."
                                                />
                                            </div>

                                            <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                                                <label className="md:hidden text-[9px] font-mono text-gray-500 uppercase tracking-widest">Qty</label>
                                                <input
                                                    type="number"
                                                    value={item.qty}
                                                    onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                                                    className="w-full bg-white/[0.02] md:bg-transparent border border-white/5 md:border-none rounded-lg md:rounded-none px-3 py-2.5 md:p-0 text-sm text-white font-mono text-left md:text-right outline-none focus:bg-white/5 transition-colors"
                                                />
                                            </div>

                                            <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                                                <label className="md:hidden text-[9px] font-mono text-gray-500 uppercase tracking-widest">Rate</label>
                                                <input
                                                    type="number"
                                                    value={item.rate}
                                                    onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                                    className="w-full bg-white/[0.02] md:bg-transparent border border-white/5 md:border-none rounded-lg md:rounded-none px-3 py-2.5 md:p-0 text-sm text-indigo-300 font-mono text-left md:text-right outline-none focus:bg-white/5 transition-colors"
                                                />
                                            </div>

                                            <div className="col-span-2 md:col-span-2 flex items-center justify-between md:justify-end gap-3 mt-2 md:mt-0 pt-3 md:pt-0 border-t border-white/5 md:border-none">
                                                <div className="flex flex-col md:items-end">
                                                    <label className="md:hidden text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Row Total</label>
                                                    <div className="text-sm font-bold text-white font-mono glow-violet-sm">
                                                        ₹{item.amount.toLocaleString()}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(index)}
                                                    className="hidden md:block text-red-500/40 hover:text-red-500 p-1 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {/* Holographic corner deco */}
                                            <div className="absolute top-1 left-1 w-1 h-1 border-t border-l border-white/20" />
                                            <div className="absolute bottom-1 right-1 w-1 h-1 border-b border-r border-white/20" />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <button
                                onClick={addItem}
                                className="w-full py-4 border border-dashed border-white/10 rounded-xl text-[12px] font-mono text-gray-500 uppercase tracking-widest hover:border-indigo-500/50 hover:text-indigo-400 transition-all bg-white/5"
                            >
                                <Plus className="w-4 h-4 inline mr-2" /> Insert New Row
                            </button>
                        </div>

                        {/* Footer Section */}
                        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-indigo-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex flex-col items-center md:items-start relative">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Total Value</span>
                                        {isCalculating && (
                                            <span className="text-[9px] font-mono text-indigo-400 animate-pulse">CALCULATING...</span>
                                        )}
                                    </div>
                                    <div className="text-5xl font-black text-white glow-violet italic tabular-nums">
                                        ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={loading || !clientName}
                                className="group relative w-full md:w-auto overflow-hidden rounded-2xl p-[1px] disabled:opacity-50"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 animate-pulse" />
                                <div className="relative bg-black px-12 py-5 rounded-2xl flex items-center justify-center gap-3 group-hover:bg-transparent transition-colors">
                                    <Save className="w-6 h-6 text-white" />
                                    <span className="text-lg font-black text-white italic tracking-tight uppercase">Generate Estimate</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* System Status Log Decorator */}
                <div className="mt-6 flex justify-between items-center px-4 text-[10px] font-mono text-gray-600 uppercase tracking-[0.3em]">
                    <span>STATUS: ALL SYSTEMS GO</span>
                    <span>ENCRYPTION: CURSED TECH V4</span>
                    <span>LATENCY: 14MS</span>
                </div>
            </motion.div>
        </div>
    );
}
