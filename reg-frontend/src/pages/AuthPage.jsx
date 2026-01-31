import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldCheck, Mail, Lock, ArrowLeft, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import OTPFlow from '../components/OTPFlow';

const AuthPage = () => {
    const { login } = useAppContext();
    const [searchParams] = useSearchParams();
    const initialMode = searchParams.get('mode') === 'admin' ? 'admin' : 'user';

    const [authMode, setAuthMode] = useState(initialMode); // 'user' or 'admin'
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const endpoint = isLogin ? '/auth/login' : '/auth/register';

        try {
            const res = await axios.post(`${base}${endpoint}`, {
                ...formData,
                role: authMode === 'admin' ? 'admin' : 'user'
            });

            login(res.data.user, res.data.token);

            if (res.data.user.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("Auth error", err);
            setError(err.response?.data?.error || 'Connection to Nexus interrupted.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#050505] overflow-hidden">
            {/* Left Side: Visual/Branding Panel (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden border-r border-glass-border">
                <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0a0a0c] to-[#050505]"></div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: 'radial-gradient(circle at 20% 30%, var(--primary) 0%, transparent 40%), radial-gradient(circle at 80% 70%, var(--secondary) 0%, transparent 40%)',
                        filter: 'blur(80px)'
                    }}></div>
                </div>
                <div className="scan-line"></div>
                <div className="relative z-10 w-full flex flex-col items-center justify-center p-12 text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="mb-8">
                        <div className="w-24 h-24 rounded-2xl border-2 border-primary flex items-center justify-center animate-glow mb-4 mx-auto">
                            <ShieldCheck size={48} className="text-primary" />
                        </div>
                        <h1 className="futuristic-font text-4xl font-bold tracking-[0.2em] text-white">
                            AV-REG <span className="text-primary">CORE</span>
                        </h1>
                        <div className="mt-4 px-4 py-1 border border-primary/30 rounded text-[10px] tracking-[0.5em] text-primary bg-primary/5 uppercase font-bold">
                            Advanced Vehicle Identification Protocol
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16 relative">
                <div className="w-full max-w-md">
                    <div className="mb-12">
                        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-dim hover:text-primary transition-colors mb-8 group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs uppercase tracking-[0.2em] font-bold">Back to Entry</span>
                        </button>

                        <div className="flex gap-4 p-1 bg-white/5 rounded-lg border border-white/10 mb-10">
                            <button onClick={() => setAuthMode('user')} className={`flex-1 py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold ${authMode === 'user' ? 'bg-primary text-black shadow-[0_0_20px_var(--primary-glow)]' : 'text-dim hover:bg-white/5'}`}>
                                <User size={16} /> User
                            </button>
                            <button onClick={() => setAuthMode('admin')} className={`flex-1 py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold ${authMode === 'admin' ? 'bg-secondary text-white shadow-[0_0_20px_var(--secondary-glow)]' : 'text-dim hover:bg-white/5'}`}>
                                <ShieldCheck size={16} /> Admin
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div key={authMode + (isLogin ? 'login' : 'register')} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="mb-10">
                                <h2 className={`futuristic-font text-3xl mb-3 ${authMode === 'admin' ? 'text-secondary font-bold' : 'text-white'}`}>
                                    {authMode === 'admin' ? 'Admin Access' : (isLogin ? 'Welcome Back' : 'Create Access')}
                                </h2>
                                <p className="text-dim text-sm">
                                    {authMode === 'admin' ? 'Restricted Terminal - Authorized Personnel Only' : 'Enter your credentials to access the registration suite.'}
                                </p>
                            </div>

                            {error && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-xs">
                                    <AlertCircle size={16} />
                                    {error}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {!isLogin && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-dim uppercase tracking-widest font-bold ml-1">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-dim group-focus-within:text-primary transition-colors" size={18} />
                                            <input type="text" placeholder="Identity Name" className="neon-input !pl-14 bg-white/5 border-white/10 hover:border-white/20 focus:!border-primary rounded-xl" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] text-dim uppercase tracking-widest font-bold ml-1">Identifier (Email)</label>
                                    <div className="relative group">
                                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 text-dim transition-colors ${authMode === 'admin' ? 'group-focus-within:text-secondary' : 'group-focus-within:text-primary'}`} size={18} />
                                        <input type="email" placeholder="name@nexus.core" className={`neon-input !pl-14 bg-white/5 border-white/10 hover:border-white/20 rounded-xl ${authMode === 'admin' ? 'focus:!border-secondary' : 'focus:!border-primary'}`} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-dim uppercase tracking-widest font-bold ml-1">Access Key</label>
                                    <div className="relative group">
                                        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 text-dim transition-colors ${authMode === 'admin' ? 'group-focus-within:text-secondary' : 'group-focus-within:text-primary'}`} size={18} />
                                        <input type="password" placeholder="••••••••" className={`neon-input !pl-14 bg-white/5 border-white/10 hover:border-white/20 rounded-xl ${authMode === 'admin' ? 'focus:!border-secondary' : 'focus:!border-primary'}`} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                                    </div>
                                </div>

                                <button disabled={isLoading} className={`neon-button w-full h-14 rounded-xl !border-none text-black font-bold text-sm tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] ${authMode === 'admin' ? 'bg-secondary text-white' : 'bg-primary'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    {isLoading ? (
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><AlertCircle size={20} /></motion.div>
                                    ) : (
                                        isLogin ? <LogIn size={20} /> : <UserPlus size={20} />
                                    )}
                                    <span>{isLoading ? 'PROCESSING...' : (isLogin ? 'INITIALIZE SESSION' : 'REGISTER IDENTITY')}</span>
                                </button>
                            </form>

                            {authMode === 'user' && (
                                <div className="mt-10 text-center">
                                    <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-[10px] text-dim hover:text-primary transition-colors uppercase tracking-[0.2em] font-bold">
                                        {isLogin ? "Request Access Protocol (Register)" : "Clearance Granted? (Login)"}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
