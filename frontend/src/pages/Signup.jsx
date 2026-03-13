import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../lib/axios';
import { Lock, User, UserPlus, ChevronRight, Fingerprint, Database, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import Background3D from '../components/Background3D';

export default function Signup({ setAuthInfo }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invitationCode, setInvitationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/auth/signup', { username, password, invitationCode });
            const { token, username: user } = res.data;
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('username', user);
            setAuthInfo({ token, username: user });
            toast.success(`Entity Created: Welcome to the Void, ${user}`);
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration Protocol Failed');
        } finally {
            setLoading(false);
        }
    };

    const triggerTransition = (path) => {
        setIsExiting(true);
        setTimeout(() => navigate(path), 800);
    };

    const cardVariants = {
        initial: { scale: 0, opacity: 0, rotate: 45, filter: "blur(20px)" },
        animate: {
            scale: 1,
            opacity: 1,
            rotate: 0,
            filter: "blur(0px)",
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
        },
        exit: {
            scale: 0,
            opacity: 0,
            rotate: -720,
            filter: "blur(40px)",
            transition: { duration: 0.8, ease: "easeInOut" }
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-black">
            <Background3D />

            <AnimatePresence>
                {!isExiting && (
                    <motion.div
                        key="signup-card"
                        variants={cardVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-full max-w-[480px] z-10"
                    >
                        <div className="glassmorphism void-distortion rounded-[2.5rem] p-8 md:p-12 border-white/5 singularity-glow backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)]">
                            <div className="text-center mb-10">

                                <motion.div
                                    animate={{
                                        boxShadow: ["0 0 20px rgba(99,102,241,0.2)", "0 0 50px rgba(99,102,241,0.5)", "0 0 20px rgba(99,102,241,0.2)"],
                                        rotate: [0, -5, 5, 0]
                                    }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-24 h-24 bg-gradient-to-tr from-indigo-600/30 to-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/30 relative"
                                >
                                    <Zap className="text-white w-10 h-10 text-glow animate-pulse" />
                                    <div className="absolute inset-0 rounded-full border border-indigo-500/40 animate-pulse scale-110" />
                                </motion.div>
                                <h2 className="text-5xl font-black text-white tracking-tighter mb-3 text-glow italic drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                    SIGN UP
                                </h2>
                                <div className="flex items-center justify-center gap-2 text-indigo-400 font-black text-[10px] tracking-[0.4em] uppercase opacity-80">
                                    Synchronizing User
                                </div>
                            </div>

                            <form onSubmit={handleSignup} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-3">USER NAME</label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <UserPlus className="w-5 h-5 text-indigo-500/50 group-focus-within/input:text-indigo-400 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="block w-full rounded-xl bg-white/[0.04] border border-white/10 pl-12 pr-5 py-4 text-lg text-white font-black placeholder-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/[0.08] transition-all hover:border-white/30 tracking-tight shadow-inner"
                                            placeholder="UNIQUE_STRING"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-3">PASSWORD</label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <Lock className="w-5 h-5 text-indigo-500/50 group-focus-within/input:text-indigo-400 transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            className="block w-full rounded-xl bg-white/[0.04] border border-white/10 pl-12 pr-5 py-4 text-lg text-white font-black placeholder-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/[0.08] transition-all hover:border-white/30 tracking-[0.2em] shadow-inner"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-3">AUTHORIZATION CODE</label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                            <Fingerprint className="w-5 h-5 text-indigo-500/50 group-focus-within/input:text-indigo-400 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="block w-full rounded-xl bg-white/[0.04] border border-white/10 pl-12 pr-5 py-4 text-lg text-white font-black placeholder-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/[0.08] transition-all hover:border-white/30 uppercase tracking-widest shadow-inner"
                                            placeholder="SIGNUP_CODE"
                                            value={invitationCode}
                                            onChange={(e) => setInvitationCode(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01, backgroundColor: "rgba(99, 102, 241, 0.2)" }}
                                    whileTap={{ scale: 0.99 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center space-x-3 py-4 px-8 rounded-xl font-black text-white bg-indigo-600/10 border border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.2)] transition-all disabled:opacity-50 mt-2 uppercase tracking-[0.3em] italic text-base"
                                >
                                    <span>{loading ? 'ARCHIVING...' : 'CREATE USER'}</span>
                                    {!loading && <ChevronRight className="w-5 h-5" />}
                                </motion.button>
                            </form>

                            <div className="mt-14 pt-12 border-t border-white/5 text-center">
                                <button
                                    onClick={() => triggerTransition('/login')}
                                    className="text-gray-500 font-black text-sm tracking-[0.2em] uppercase hover:text-indigo-400 transition-colors group"
                                >
                                    Existing User? <span className="text-white font-black ml-2 underline underline-offset-8 decoration-indigo-500/50 group-hover:decoration-indigo-500 group-hover:text-indigo-300 transition-all">SIGN IN</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Static HUD */}
            <div className="absolute bottom-10 left-10 flex flex-col items-start gap-2 opacity-20 select-none">
                <Database className="w-6 h-6 text-indigo-500" />
                <div className="h-[2px] w-32 bg-gradient-to-r from-indigo-500 to-transparent" />
                <Fingerprint className="w-6 h-6 text-purple-500" />
            </div>
        </div>
    );
}



