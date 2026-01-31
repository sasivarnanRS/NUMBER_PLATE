import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ShieldCheck, RefreshCcw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const OTPFlow = ({ onVerified }) => {
    const [step, setStep] = useState('email'); // email, sending, otp, success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(300); // 5 minutes
    const [isError, setIsError] = useState(false);
    const otpRefs = useRef([]);

    useEffect(() => {
        let interval;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => setTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSendOTP = () => {
        if (!email) return;
        setStep('sending');
        // Simulate API call
        setTimeout(() => {
            setStep('otp');
        }, 1500);
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    const handleVerify = () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6) return;

        // Simulate verification
        if (enteredOtp === '123456') { // Mock success
            setStep('success');
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#00f2ff', '#bc13fe', '#00ff88']
            });
            setTimeout(() => {
                onVerified(email);
            }, 3000);
        } else {
            setIsError(true);
            setTimeout(() => setIsError(false), 500);
        }
    };

    const GlassCard = ({ children, className }) => (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`glass-card max-w-md w-full mx-auto relative overflow-hidden ${className}`}
        >
            <div className="relative z-10">{children}</div>
        </motion.div>
    );

    return (
        <div className="flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
                {step === 'email' && (
                    <GlassCard key="email">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20 animate-glow">
                                <Mail className="text-primary" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Secure Access</h2>
                            <p className="text-dim text-sm">Enter your email for identity verification</p>
                        </div>

                        <div className="space-y-6">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="neon-input"
                                    placeholder="name@nexus.com"
                                    required
                                />
                                <label className="absolute -top-6 left-0 text-xs text-primary uppercase tracking-widest font-bold">Email Address</label>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSendOTP}
                                disabled={!email}
                                className="neon-button w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Send Verification Key <ArrowRight size={18} />
                            </motion.button>
                        </div>
                    </GlassCard>
                )}

                {step === 'sending' && (
                    <GlassCard key="sending" className="text-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="w-20 h-20 border-t-2 border-r-2 border-primary rounded-full mx-auto mb-6"
                        />
                        <h2 className="text-xl font-bold mb-2 animate-pulse">Establishing Secure Channel...</h2>
                        <p className="text-dim text-sm">Transmitting OTP to {email}</p>
                    </GlassCard>
                )}

                {step === 'otp' && (
                    <GlassCard key="otp">
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <div className="relative w-20 h-20">
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                                        <circle
                                            cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" strokeWidth="4"
                                            className="countdown-ring"
                                            strokeDasharray="283"
                                            strokeDashoffset={283 - (timer / 300) * 283}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center font-mono text-sm">
                                        {formatTime(timer)}
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold mb-1">Enter Verification Key</h2>
                            <p className="text-dim text-xs">Sent to <span className="text-primary">{email}</span></p>
                        </div>

                        <div className={`flex justify-center mb-8 ${isError ? 'animate-shake' : ''}`}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (otpRefs.current[index] = el)}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className={`otp-box neon-input focus:scale-110 ${isError ? 'border-error' : ''}`}
                                />
                            ))}
                        </div>

                        <div className="space-y-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleVerify}
                                className="neon-button w-full justify-center"
                            >
                                Verify Identity <ShieldCheck size={18} />
                            </motion.button>

                            <button
                                disabled={timer > 0}
                                onClick={() => { setStep('email'); setTimer(300); }}
                                className="w-full text-xs text-dim hover:text-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-30"
                            >
                                <RefreshCcw size={12} /> Resend OTP {timer > 0 ? `in ${formatTime(timer)}` : ''}
                            </button>
                        </div>
                    </GlassCard>
                )}

                {step === 'success' && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center success-bg p-12 rounded-full"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 10, stiffness: 100 }}
                            className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-success"
                        >
                            <CheckCircle2 className="text-success" size={48} />
                        </motion.div>
                        <h1 className="text-3xl font-bold mb-2 text-success">Identity Verified</h1>
                        <p className="text-dim">Authorizing access to registration system...</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OTPFlow;
