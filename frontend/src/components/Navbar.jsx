import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Search, LogOut, User, Activity, Zap, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onLogout, username }) {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'DASHBOARD', icon: Home },
        { path: '/create', label: 'CREATE BILL', icon: Zap },
        { path: '/history', label: 'BILL HISTORY', icon: FileText },
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 no-print">
            <div className="hud-card hologram-border rounded-2xl px-4 md:px-6 py-2.5 flex items-center justify-between backdrop-blur-3xl relative">
                <div className="scanline" />
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 group z-10">
                    <div className="relative">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/50 glow-violet group-hover:scale-110 transition-transform">
                            <Activity className="text-indigo-400 w-6 h-6" />
                        </div>
                        <div className="absolute -inset-1.5 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm md:text-base font-black text-white tracking-[0.1em] md:tracking-[0.2em] uppercase italic leading-tight">
                            DIGITAL BILL
                        </span>
                        <div className="flex items-center gap-1.5 opacity-70">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                            <span className="text-[9px] md:text-[11px] font-black font-mono text-indigo-300 uppercase tracking-tighter whitespace-nowrap">STATUS: 100% OK</span>
                        </div>
                    </div>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden lg:flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md z-10">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-black text-[10px] tracking-widest transition-all duration-300 ${
                                    isActive 
                                    ? 'text-white bg-indigo-500/20 shadow-[inset_0_0_15px_rgba(139,92,246,0.3)]' 
                                    : 'text-gray-400 hover:text-indigo-300 hover:bg-white/10'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'glow-violet' : ''}`} />
                                {item.label}
                                {isActive && (
                                    <motion.div 
                                        layoutId="nav-active"
                                        className="absolute -bottom-1 left-5 right-5 h-[2px] bg-indigo-500 glow-violet rounded-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* User & Actions (Desktop & Mobile combined logic) */}
                <div className="flex items-center gap-4 z-10">
                    <div className="hidden sm:flex flex-col items-end px-5 border-r border-white/10">
                        <span className="text-[8px] font-black text-indigo-400/50 uppercase tracking-[0.2em] text-right">USER AUTH</span>
                        <span className="text-xs font-black text-white flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-indigo-400" />
                            {username?.toUpperCase()}
                        </span>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="lg:hidden flex items-center">
                        <button 
                            className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                            onClick={toggleMenu}
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                    
                    {/* Desktop Logout Button */}
                    <button
                        onClick={onLogout}
                        className="hidden lg:flex p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] group"
                        title="TERMINATE_SESSION"
                    >
                        <LogOut className="w-4.5 h-4.5 group-hover:rotate-12 transition-transform" />
                    </button>

                </div>
            </div>

            {/* Mobile Nav Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden absolute top-full left-0 right-0 mt-2 p-4 hud-card hologram-border rounded-2xl backdrop-blur-3xl z-40 flex flex-col gap-2"
                    >
                        <div className="scanline" />
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`relative flex items-center gap-3 px-5 py-4 rounded-xl font-black text-xs tracking-widest transition-all z-10 ${
                                        isActive 
                                        ? 'text-white bg-indigo-500/20 border border-indigo-500/30' 
                                        : 'text-gray-400 hover:text-white bg-white/5 border border-white/5'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                        <div className="h-[1px] bg-white/10 my-2 z-10" />
                        <button
                            onClick={() => {
                                setIsMenuOpen(false);
                                onLogout();
                            }}
                            className="flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-black text-xs tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all z-10 uppercase"
                        >
                            <LogOut className="w-5 h-5" />
                            Terminate Session
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
