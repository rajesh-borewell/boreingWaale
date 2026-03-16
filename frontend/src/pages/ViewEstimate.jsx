import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import { ArrowLeft, Edit3, Save, X, Plus, Trash2, Clock, RotateCcw, Download, Activity, Zap, Database, Globe } from 'lucide-react';
import A4PreviewEstimate from '../components/A4PreviewEstimate';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Background3D from '../components/Background3D';

export default function ViewEstimate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [estimate, setEstimate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Edit state
    const [clientName, setClientName] = useState('');
    const [date, setDate] = useState('');
    const [items, setItems] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);
    const [saving, setSaving] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);

    const fetchEstimate = async () => {
        try {
            const res = await axios.get(`/estimates/${id}`);
            setEstimate(res.data);
            // Initialize edit fields
            setClientName(res.data.clientName);
            setDate(new Date(res.data.date).toISOString().split('T')[0]);
            setItems(res.data.items || []);
            setGrandTotal(res.data.grandTotal);
        } catch (err) {
            setError('SYSTEM_ERR: DATA_NOT_FOUND');
            toast.error('Failed to load estimate. Please refresh.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEstimate();
    }, [id]);

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

    const handleUpdate = async () => {
        if (!clientName) return toast.error('SYSTEM_ERR: CLIENT_NAME_REQUIRED');
        setSaving(true);
        const toastId = toast.loading('UPDATING ESTIMATE...');
        try {
            const res = await axios.put(`/estimates/${id}`, {
                clientName,
                date,
                items,
                grandTotal
            });
            setEstimate(res.data);
            setIsEditing(false);
            toast.success('ESTIMATE_UPDATED', { id: toastId });
        } catch (err) {
            console.error(err);
            toast.error('UPDATE_FAILURE: RETRY_INITIATED', { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    const handleDownload = async () => {
        const previewEl = document.getElementById('estimate-preview-area');
        if (!previewEl) return;
        
        const toastId = toast.loading('EXTRACTING_DATA_STREAM...');
        try {
            const canvas = await html2canvas(previewEl, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#f1f5f9',
                logging: false,
                width: 850,
                onclone: (clonedDoc) => {
                    const clonedEl = clonedDoc.getElementById('estimate-preview-area');
                    if (clonedEl) {
                        clonedEl.style.transform = 'none';
                        clonedEl.style.margin = '0';
                        clonedEl.style.minWidth = '850px';
                        clonedEl.style.width = '850px';
                    }
                }
            });

            canvas.toBlob((blob) => {
                if (!blob) {
                    toast.error('CAPTURE_FAILURE', { id: toastId });
                    return;
                }
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `RAJESH_BOREWELL_ESTIMATE_${estimate.estimateNumber}.jpg`;
                link.href = url;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                toast.success(`LOG_EXPORT_SUCCESSFUL`, { id: toastId });
            }, 'image/jpeg', 0.95);
            
        } catch (err) {
            console.error('Download error', err);
            toast.error('EXPORT_FAILURE', { id: toastId });
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <Background3D />
            <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin glow-violet"></div>
                <span className="text-[10px] font-mono text-indigo-400 animate-pulse tracking-[0.5em]">DECRYPTING_DOMAIN_DATA...</span>
            </div>
        </div>
    );

    if (error || !estimate) return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <Background3D />
            <div className="relative z-10 hud-card hologram-border p-12 text-center max-w-lg w-full rounded-3xl">
                <div className="scanline" />
                <Globe className="w-12 h-12 text-red-500 mx-auto mb-6 opacity-50" />
                <p className="text-xl font-bold text-white mb-6 tracking-tight uppercase italic">{error || 'DOMAIN_COLLAPSED'}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 justify-center mx-auto text-[10px] font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
                >
                    <ArrowLeft className="w-4 h-4" /> RETREAT_TO_ORIGIN
                </button>
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen bg-black overflow-x-hidden pt-32 pb-20 px-4">
            <Background3D />

            <div className="relative z-10 max-w-6xl mx-auto space-y-8">
                {/* Action Tray HUD */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="no-print hud-card hologram-border rounded-2xl flex flex-col md:flex-row items-center justify-between p-4 gap-4"
                >
                    <div className="scanline" />
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/5 text-[12px] font-mono text-gray-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest border border-white/5"
                    >
                        <ArrowLeft className="w-4 h-4" /> BACK  
                    </button>

                    <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto justify-end">
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-3 md:px-6 py-2.5 rounded-xl font-mono text-[10px] md:text-[11px] tracking-widest hover:bg-indigo-500 hover:text-white transition-all uppercase"
                                >
                                    <Edit3 className="w-4 h-4" /> EDIT ESTIMATE
                                </button>

                                <button
                                    onClick={handleDownload}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 md:px-6 py-2.5 rounded-xl font-mono text-[10px] md:text-[11px] tracking-widest shadow-lg hover:shadow-emerald-500/20 transition-all uppercase"
                                >
                                    <Download className="w-4 h-4" /> DOWNLOAD
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setClientName(estimate.clientName);
                                        setDate(new Date(estimate.date).toISOString().split('T')[0]);
                                        setItems([...estimate.items]);
                                        setGrandTotal(estimate.grandTotal);
                                    }}
                                    className="flex items-center justify-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2.5 rounded-xl font-mono text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all uppercase text-center"
                                >
                                    <X className="w-4 h-4" /> CANCEL
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={saving}
                                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-mono text-[10px] tracking-widest shadow-lg transition-all disabled:opacity-50 uppercase text-center"
                                >
                                    <Save className="w-4 h-4" /> {saving ? 'SAVING' : 'SAVE'}
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Edit Form HUD */}
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="no-print hud-card hologram-border rounded-3xl p-6 md:p-8 space-y-12 bg-black/40 backdrop-blur-3xl"
                    >
                        <div className="scanline" />
                        <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                            <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/30">
                                <Edit3 className="w-6 h-6 text-indigo-400 glow-violet" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">CHANGING_ESTNO: #{String(estimate.estimateNumber).padStart(4, '0')}</h2>
                                <p className="text-[10px] font-mono text-indigo-300/50 uppercase tracking-widest">Database Sync Protocol Enabled</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[12px] font-mono text-gray-500 uppercase tracking-widest">Client Name</label>
                                <input
                                    type="text"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-white font-mono placeholder:text-gray-700 focus:border-indigo-500/50 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[12px] font-mono text-gray-500 uppercase tracking-widest">Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-white font-mono focus:border-indigo-500/50 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-[12px] font-mono text-gray-500 uppercase tracking-widest">
                                <div className="col-span-1">sr.no</div>
                                <div className="col-span-5">Particulars</div>
                                <div className="col-span-2 text-right">Qty</div>
                                <div className="col-span-2 text-right">Rate</div>
                                <div className="col-span-2 text-right">Delete Row</div>
                            </div>

                            <AnimatePresence mode="popLayout">
                                {items.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="grid grid-cols-2 md:grid-cols-12 gap-4 bg-white/5 border border-white/5 p-4 rounded-xl items-center relative group"
                                    >
                                        {/* Mobile SR / Delete Header */}
                                        <div className="md:hidden col-span-2 flex justify-between items-center border-b border-white/10 pb-2 mb-1">
                                            <span className="text-[10px] font-mono text-indigo-400 font-bold tracking-widest uppercase">Sequence: #{String(item.srNo).padStart(2, '0')}</span>
                                            <button onClick={() => removeItem(index)} className="text-red-500 p-2 bg-red-500/10 rounded-lg">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="col-span-1 hidden md:flex justify-center text-[10px] font-mono text-indigo-400">[{String(item.srNo).padStart(2, '0')}]</div>
                                        
                                        <div className="col-span-2 md:col-span-5 flex flex-col gap-1.5">
                                            <label className="md:hidden text-[9px] font-mono text-gray-500 uppercase tracking-widest">Particulars</label>
                                            <input
                                                type="text"
                                                value={item.particulars}
                                                onChange={(e) => handleItemChange(index, 'particulars', e.target.value)}
                                                className="w-full bg-white/[0.02] md:bg-transparent border border-white/5 md:border-none rounded-lg px-3 py-2 text-sm text-white font-mono placeholder:text-gray-700 outline-none"
                                            />
                                        </div>

                                        <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                                            <label className="md:hidden text-[9px] font-mono text-gray-500 uppercase tracking-widest">Qty</label>
                                            <input
                                                type="number"
                                                value={item.qty}
                                                onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                                                className="w-full bg-white/[0.02] md:bg-transparent border border-white/5 md:border-none rounded-lg px-3 py-2 text-sm text-white font-mono text-left md:text-right outline-none"
                                            />
                                        </div>

                                        <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                                            <label className="md:hidden text-[9px] font-mono text-gray-500 uppercase tracking-widest">Rate</label>
                                            <input
                                                type="number"
                                                value={item.rate}
                                                onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                                className="w-full bg-white/[0.02] md:bg-transparent border border-white/5 md:border-none rounded-lg px-3 py-2 text-sm text-indigo-300 font-mono text-left md:text-right outline-none"
                                            />
                                        </div>

                                        <div className="hidden md:flex col-span-12 md:col-span-2 justify-end gap-2 text-right">
                                            <button onClick={() => removeItem(index)} className="text-red-500/40 hover:text-red-500 p-1 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            <button
                                onClick={addItem}
                                className="w-full py-4 border border-dashed border-white/10 rounded-xl text-[12px] font-mono text-gray-500 uppercase tracking-widest hover:border-indigo-500/50 hover:text-indigo-400 transition-all bg-white/5"
                            >
                                <Plus className="w-4 h-4 inline mr-2" /> Insert New Row
                            </button>
                        </div>

                        <div className="flex justify-between items-center p-6 md:p-8 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                            <div className="flex flex-col">
                                <span className="text-[12px] font-mono text-gray-500 uppercase tracking-widest">Updated Amount</span>
                                {isCalculating && <span className="text-[12px] font-mono text-indigo-400 animate-pulse">RECALCULATING...</span>}
                            </div>
                            <span className="text-4xl font-black text-white glow-violet italic">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </motion.div>
                )}

                {/* Estimate Preview HUD Surround */}
                {!isEditing && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative group"
                    >
                        <div className="absolute -inset-2 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="hud-card hologram-border rounded-3xl overflow-hidden bg-black/60 shadow-2xl relative">
                            <div className="scanline" />
                            {/* Decorative HUD Markers */}
                            <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-indigo-500/30" />
                            <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-indigo-500/30" />
                            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-indigo-500/30" />
                            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-indigo-500/30" />

                            <div className="p-4 md:p-20 flex justify-center w-full">
                                <div className="w-full overflow-x-auto pb-10 custom-scrollbar flex justify-start md:justify-center">
                                    <div id="estimate-preview-area" 
                                        style={{ minWidth: '850px' }}
                                        className="shadow-[0_0_50px_rgba(0,0,0,0.5)] transform-gpu md:hover:scale-[1.005] transition-transform duration-500 bg-slate-100 p-0"
                                    >
                                        <A4PreviewEstimate estimate={estimate} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* System Domain Logs Footer */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="hud-card p-6 rounded-2xl border-white/5 bg-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-4 h-4 text-indigo-400" />
                            <span className="text-[12px] font-mono text-gray-400 uppercase tracking-widest">ESTIMATE CREATED ON</span>
                        </div>
                        <p className="text-white font-mono text-xs">{new Date(estimate.createdAt).toLocaleString('en-GB').replace(/\//g, '-')}</p>
                    </div>
                    <div className="hud-card p-6 rounded-2xl border-white/5 bg-white/5 backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-2">
                            <RotateCcw className="w-4 h-4 text-cyan-400" />
                            <span className="text-[12px] font-mono text-gray-400 uppercase tracking-widest">ESTIMATE UPDATED ON</span>
                        </div>
                        <p className="text-white font-mono text-xs">{new Date(estimate.updatedAt).toLocaleString('en-GB').replace(/\//g, '-')}</p>
                    </div>
                    <div className="hud-card p-6 rounded-2xl border-white/5 bg-white/5 backdrop-blur-md flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-3 h-3 text-indigo-500" />
                            <span className="text-[12px] font-mono text-gray-500 uppercase">CREATED BY</span>
                        </div>
                        <p className="text-[12px] text-indigo-300 font-mono italic font-bold uppercase">{estimate.createdBy?.username || 'ANONYMOUS_VOID'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
