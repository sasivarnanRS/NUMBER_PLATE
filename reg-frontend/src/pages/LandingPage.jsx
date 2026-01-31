import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Database, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="landing-container" style={{ padding: '0 2rem' }}>
            <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ fontSize: '4rem', marginBottom: '1rem', textShadow: '0 0 20px var(--primary-glow)' }}
                >
                    Auto Vehicle Registration <br />
                    <span className="neon-text">Number Generator</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    style={{ fontSize: '1.2rem', color: 'var(--text-dim)', marginBottom: '3rem' }}
                >
                    Secure • Unique • Automated • AI-Inspired
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    style={{ display: 'flex', gap: '1.5rem' }}
                >
                    <Link to="/auth" style={{ textDecoration: 'none' }}>
                        <button className="neon-button">
                            Get Started <ArrowRight size={20} />
                        </button>
                    </Link>
                    <Link to="/auth?mode=admin" style={{ textDecoration: 'none' }}>
                        <button className="neon-button secondary">
                            Admin Portal
                        </button>
                    </Link>
                </motion.div>
            </section>

            <section id="about" style={{ padding: '5rem 0' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>About the <span className="neon-text">System</span></h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="glass-card"
                    >
                        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Smart Generation</h3>
                        <p style={{ color: 'var(--text-dim)' }}>
                            Our system uses advanced algorithms to process chassis and engine numbers, ensuring every generated registration ID is unique and virtually impossible to duplicate.
                        </p>
                    </motion.div>
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="glass-card"
                    >
                        <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>AI-Inspired</h3>
                        <p style={{ color: 'var(--text-dim)' }}>
                            Leveraging neural-pattern analysis to validate vehicle data and prevent fraudulent registration attempts in real-time.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section id="why" style={{ padding: '5rem 0', background: 'rgba(0,0,0,0.3)', borderRadius: '32px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Why <span className="neon-text">This System?</span></h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    {[
                        { icon: <Shield size={32} color="var(--primary)" />, title: "Prevents Duplication", desc: "Cryptographic hashing ensures no two vehicles share the same ID." },
                        { icon: <Zap size={32} color="var(--secondary)" />, title: "Faster Registration", desc: "Generate your registration number in seconds, not days." },
                        { icon: <Database size={32} color="var(--accent)" />, title: "Centralized History", desc: "Every vehicle's timeline is securely stored and easily accessible." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="glass-card"
                            style={{ textAlign: 'center' }}
                        >
                            <div style={{ marginBottom: '1rem' }}>{item.icon}</div>
                            <h3 style={{ marginBottom: '0.5rem' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-dim)' }}>{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <footer style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                © 2026 AV-REG System. Built for the Future.
            </footer>
        </div>
    );
};

export default LandingPage;
