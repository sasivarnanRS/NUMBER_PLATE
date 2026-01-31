import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Copy, Mail, LayoutDashboard, History, Download, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const RegistrationReveal = ({ registrationData, onAction }) => {
    const [showPlate, setShowPlate] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Stage the reveal
        setTimeout(() => setShowPlate(true), 1000);

        // Confetti burst on reveal
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#00f2ff', '#bc13fe']
            });
        }, 2000);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(registrationData.regNum);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8">
            {/* Success Header */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
            >
                <div className="flex justify-center">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12, stiffness: 200 }}
                        className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center border-2 border-success shadow-[0_0_30px_rgba(0,255,136,0.3)]"
                    >
                        <CheckCircle2 className="text-success" size={40} />
                    </motion.div>
                </div>
                <h1 className="text-4xl font-bold futuristic-font tracking-tighter">
                    Vehicle <span className="text-success">Registered</span>
                </h1>
                <p className="text-dim">Your unique registration number has been generated and encrypted.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Holographic Plate */}
                <div className="space-y-4">
                    <label className="text-[10px] text-primary uppercase tracking-[0.3em] font-bold block ml-2">Digital Identification Plate</label>
                    <motion.div
                        className="relative glass-card !p-0 overflow-hidden border-2 border-primary/30 group"
                        animate={showPlate ? { scale: [1, 1.02, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 4 }}
                    >
                        <div className="aspect-[3/1] bg-black/40 flex flex-col items-center justify-center p-8 relative">
                            {/* Scanline */}
                            <div className="scan-line" />

                            <AnimatePresence>
                                {showPlate && (
                                    <motion.div
                                        initial={{ opacity: 0, filter: 'blur(20px)' }}
                                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                                        className="text-center"
                                    >
                                        <div className="text-[10px] text-primary/60 font-mono mb-2 tracking-[0.5em]">NEXUS • SYSTEM • AUTHENTIFIED</div>
                                        <div className="text-5xl md:text-6xl font-bold font-mono tracking-widest text-[#fff] drop-shadow-[0_0_15px_rgba(0,242,255,0.8)]">
                                            {registrationData.regNum}
                                        </div>
                                        <div className="mt-4 flex items-center justify-center gap-4">
                                            <div className="h-[1px] w-12 bg-primary/30" />
                                            <div className="text-[8px] text-primary font-bold uppercase">{registrationData.state}</div>
                                            <div className="h-[1px] w-12 bg-primary/30" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Grid Background */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
                        </div>

                        <button
                            onClick={handleCopy}
                            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
                        >
                            <Copy className={copied ? "text-success" : "text-dim"} size={16} />
                            {copied && <span className="absolute -bottom-8 right-0 text-[10px] text-success font-bold whitespace-nowrap">COPIED TO CLIPBOARD</span>}
                        </button>
                    </motion.div>

                    <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                            <Mail className="text-primary" size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-primary italic">✔ EMAIL TRANSMITTED</span>
                            </div>
                            <p className="text-[10px] text-dim">Documentation sent to {registrationData.ownerEmail}</p>
                        </div>
                    </div>
                </div>

                {/* Email Preview & Details */}
                <div className="space-y-6">
                    <label className="text-[10px] text-dim uppercase tracking-[0.3em] font-bold block ml-2">Data Summary</label>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-card !bg-white/[0.02] border-white/5 space-y-6"
                    >
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                <span className="text-xs text-dim">Subject</span>
                                <span className="text-xs font-bold">Your Vehicle Registration Number 🚘</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] text-dim uppercase">Owner</span>
                                    <p className="text-sm font-bold">{registrationData.owner}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <span className="text-[10px] text-dim uppercase">Model</span>
                                    <p className="text-sm font-bold">{registrationData.model}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] text-dim uppercase">Manufacturer</span>
                                    <p className="text-sm font-bold">{registrationData.manufacturer}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <span className="text-[10px] text-dim uppercase">Timestamp</span>
                                    <p className="text-sm font-bold">{new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary/10 p-3 rounded-lg border border-primary/20 flex items-center gap-2">
                            <div className="w-1 h-8 bg-primary rounded-full" />
                            <p className="text-[10px] leading-relaxed">
                                <span className="font-bold text-primary">HINT:</span> Check your inbox or spam folder for the official certificate of registration and digital plates.
                            </p>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => onAction('dashboard')}
                            className="neon-button justify-center gap-2 group"
                        >
                            <LayoutDashboard size={18} /> Dashboard
                        </button>
                        <button
                            onClick={() => onAction('history')}
                            className="neon-button secondary justify-center gap-2 group"
                        >
                            <History size={18} /> History
                        </button>
                        <button
                            className="neon-button border-white/20 text-white hover:bg-white/10 sm:col-span-2 justify-center gap-2 opacity-50 cursor-not-allowed"
                        >
                            <Download size={18} /> Download Certificate (Alpha)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationReveal;
