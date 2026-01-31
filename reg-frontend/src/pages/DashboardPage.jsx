import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Car, History, Download, LayoutDashboard, LogOut, Settings, Save, Shield, Send } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const { user, registrations, history, logout } = useAppContext();
    const navigate = useNavigate();
    const [view, setView] = useState('overview'); // 'overview', 'history', 'settings'

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    const handleSaveProfile = () => {
        setUser({ ...user, ...profileData });
        alert("Profile update encrypted and saved.");
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <div style={{ width: '280px', background: 'rgba(5, 5, 5, 0.9)', borderRight: '1px solid var(--glass-border)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 className="neon-text" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LayoutDashboard size={24} /> PILOT HUB
                    </h2>
                </div>

                <button onClick={() => setView('overview')} className={`neon-button ${view === 'overview' ? '' : 'disabled'}`} style={{ border: 'none', background: view === 'overview' ? 'rgba(0,242,255,0.1)' : 'transparent', width: '100%', justifyContent: 'flex-start' }}>
                    <LayoutDashboard size={20} /> Overview
                </button>
                <button onClick={() => navigate('/select')} className="neon-button" style={{ border: 'none', width: '100%', justifyContent: 'flex-start', color: 'var(--primary)' }}>
                    <Car size={20} /> Register Vehicle
                </button>
                <button onClick={() => setView('history')} className={`neon-button ${view === 'history' ? '' : 'disabled'}`} style={{ border: 'none', background: view === 'history' ? 'rgba(0,242,255,0.1)' : 'transparent', width: '100%', justifyContent: 'flex-start' }}>
                    <History size={20} /> History
                </button>
                <button onClick={() => setView('settings')} className={`neon-button ${view === 'settings' ? '' : 'disabled'}`} style={{ border: 'none', background: view === 'settings' ? 'rgba(0,242,255,0.1)' : 'transparent', width: '100%', justifyContent: 'flex-start' }}>
                    <Settings size={20} /> Settings
                </button>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button onClick={() => {
                        logout();
                        navigate('/');
                    }} className="neon-button" style={{ border: 'none', color: '#ff4d4d', width: '100%', justifyContent: 'flex-start' }}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 className="futuristic-font">Welcome, <span className="neon-text">{user?.name || 'Pilot'}</span></h1>
                        <p style={{ color: 'var(--text-dim)' }}>Accessing your secure vehicle database</p>
                    </div>
                    <div className="glass-card" style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <User size={32} color="var(--primary)" />
                            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', background: '#00ff88', borderRadius: '50%', border: '2px solid #000' }}></div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{user?.email.split('@')[0]}</div>
                            <div style={{ fontSize: '0.6rem', color: 'var(--primary)' }}>SECURE ACCESS</div>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {view === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                <div style={{ background: 'rgba(0,242,255,0.05)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--primary-glow)' }}>
                                    <User size={64} color="var(--primary)" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 className="futuristic-font" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>PILOT <span className="neon-text">PROFILE</span></h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Full Identity Name</div>
                                            <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{user?.name || 'Unknown Pilot'}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Neural ID (Email)</div>
                                            <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{user?.email || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Clearance Level</div>
                                            <div style={{ fontSize: '1rem', color: 'var(--primary)', fontWeight: 'bold' }}>LEVEL_01_USER</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Status</div>
                                            <div style={{ fontSize: '1rem', color: '#00ff88', fontWeight: 'bold' }}>ACTIVE_SESSION</div>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => navigate('/select')} className="neon-button" style={{ alignSelf: 'center', height: 'fit-content', padding: '1rem 2rem' }}>
                                    <Send size={18} /> GENERATE NEW ID
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                                <div className="glass-card" style={{ textAlign: 'center' }}>
                                    <h4 style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>REGISTERED VEHICLES</h4>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{registrations.length.toString().padStart(2, '0')}</div>
                                </div>
                                <div className="glass-card" style={{ textAlign: 'center' }}>
                                    <h4 style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>HISTORY EVENTS</h4>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{history.length.toString().padStart(2, '0')}</div>
                                </div>
                                <div className="glass-card" style={{ textAlign: 'center' }}>
                                    <h4 style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>ACCESS LEVEL</h4>
                                    <div style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 'bold', margin: '0.5rem 0' }}>PILOT_L1</div>
                                </div>
                            </div>

                            <h3 className="futuristic-font" style={{ marginBottom: '1.5rem' }}>Active <span className="neon-text">Registrations</span></h3>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {registrations.length === 0 ? (
                                    <p style={{ color: 'var(--text-dim)' }}>No vehicles found in database.</p>
                                ) : (
                                    registrations.map(v => (
                                        <motion.div key={v.id} whileHover={{ x: 10 }} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                                <div style={{ background: 'rgba(0,242,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
                                                    <Car size={24} color="var(--primary)" />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{v.regNum}</div>
                                                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{v.manufacturer} {v.model} • {v.state}</div>
                                                </div>
                                            </div>
                                            <button className="neon-button" style={{ fontSize: '0.7rem', padding: '0.5rem 1rem' }} onClick={() => window.print()}>
                                                <Download size={14} /> EXPORT
                                            </button>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}

                    {view === 'history' && (
                        <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h3 className="futuristic-font" style={{ marginBottom: '2rem' }}>Action <span className="neon-text">Timeline</span></h3>
                            <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '2px solid var(--primary-glow)' }}>
                                {history.map((item, i) => (
                                    <div key={i} style={{ position: 'relative', marginBottom: '2.5rem' }}>
                                        <div style={{ position: 'absolute', left: '-2.45rem', top: '5px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--bg-color)', border: '2px solid var(--primary)', boxShadow: '0 0 10px var(--primary)' }}></div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--primary)', marginBottom: '0.2rem' }}>{item.date}</div>
                                        <div className="glass-card" style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 'bold' }}>{item.event}</div>
                                            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{item.detail}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {view === 'settings' && (
                        <motion.div key="settings" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                            <div className="glass-card" style={{ maxWidth: '600px' }}>
                                <h3 className="futuristic-font" style={{ marginBottom: '2rem' }}>Pilot <span className="neon-text">Settings</span></h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Name</label>
                                        <input
                                            style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: '#fff' }}
                                            value={profileData.name}
                                            onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Email</label>
                                        <input
                                            style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '4px', color: '#fff' }}
                                            value={profileData.email}
                                            onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>2FA Encryption</label>
                                        <div style={{ width: '40px', height: '20px', background: 'var(--primary)', borderRadius: '10px', position: 'relative' }}>
                                            <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }}></div>
                                        </div>
                                    </div>
                                    <button className="neon-button" style={{ width: 'fit-content' }} onClick={handleSaveProfile}>
                                        <Save size={18} /> Update Data
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DashboardPage;
