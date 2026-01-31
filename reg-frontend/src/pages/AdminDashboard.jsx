import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Car, Plus, Search, Trash2, Edit2, LayoutDashboard, LogOut, X, Save, Settings, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const AdminDashboard = () => {
    const {
        registrations, deleteRegistration, updateRegistration,
        users, deleteUser,
        vehicleTypes, addVehicleType, updateVehicleType, deleteVehicleType,
        logout
    } = useAppContext();

    const navigate = useNavigate();

    // UI State
    const [view, setView] = useState('hub');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    // Add Type Modal State
    const [showAddType, setShowAddType] = useState(false);
    const [newType, setNewType] = useState({ name: '', baseReg: '' });

    const filteredRecords = registrations.filter(r =>
        r.regNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Vehicle Type Handlers
    const handleAddType = () => {
        if (!newType.name || !newType.baseReg) return;
        addVehicleType(newType);
        setNewType({ name: '', baseReg: '' });
        setShowAddType(false);
    };

    const handleEditType = (type) => {
        setEditingId(type.id);
        setEditData({ ...type });
    };

    const handleSaveType = () => {
        updateVehicleType(editingId, editData);
        setEditingId(null);
    };

    const inputStyle = {
        padding: '0.6rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--glass-border)',
        borderRadius: '4px',
        color: '#fff',
        width: '100%',
        marginTop: '0.5rem'
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <div style={{ width: '280px', background: 'rgba(10, 10, 12, 0.95)', borderRight: '1px solid var(--secondary)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <h2 className="futuristic-font" style={{ color: 'var(--secondary)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                    <Shield size={24} /> ADMIN CENTRAL
                </h2>

                <button onClick={() => setView('hub')} className={`neon-button secondary ${view === 'hub' ? '' : 'disabled'}`} style={{ width: '100%', justifyContent: 'flex-start', background: view === 'hub' ? 'rgba(188, 19, 254, 0.1)' : 'transparent', border: 'none' }}>
                    <LayoutDashboard size={20} /> System Hub
                </button>
                <button onClick={() => setView('records')} className={`neon-button secondary ${view === 'records' ? '' : 'disabled'}`} style={{ width: '100%', justifyContent: 'flex-start', background: view === 'records' ? 'rgba(188, 19, 254, 0.1)' : 'transparent', border: 'none' }}>
                    <Database size={20} /> All Records
                </button>
                <button onClick={() => setView('users')} className={`neon-button secondary ${view === 'users' ? '' : 'disabled'}`} style={{ width: '100%', justifyContent: 'flex-start', background: view === 'users' ? 'rgba(188, 19, 254, 0.1)' : 'transparent', border: 'none' }}>
                    <Users size={20} /> User List
                </button>
                <button onClick={() => setView('types')} className={`neon-button secondary ${view === 'types' ? '' : 'disabled'}`} style={{ width: '100%', justifyContent: 'flex-start', background: view === 'types' ? 'rgba(188, 19, 254, 0.1)' : 'transparent', border: 'none' }}>
                    <Car size={20} /> Vehicle Types
                </button>
                <button onClick={() => {
                    logout();
                    navigate('/');
                }} className="neon-button secondary" style={{ marginTop: 'auto', color: '#ff4d4d', border: 'none', width: '100%', justifyContent: 'flex-start' }}>
                    <LogOut size={20} /> Exit Admin
                </button>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <h1 className="futuristic-font" style={{ color: 'var(--secondary)' }}>{view.toUpperCase()} MANAGER</h1>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                        <input
                            placeholder={`Search...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--secondary)', borderRadius: '20px', color: '#fff' }}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {view === 'hub' && (
                        <motion.div key="hub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                                <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>USERS</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{users.length}</div>
                                </div>
                                <div className="glass-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>RECORDS</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{registrations.length}</div>
                                </div>
                                <div className="glass-card" style={{ borderLeft: '4px solid #00ff88' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>STATUS</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00ff88' }}>LIVE</div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {view === 'records' && (
                        <motion.div key="records" className="glass-card" style={{ padding: 0 }}>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(188, 19, 254, 0.1)', borderBottom: '1px solid var(--glass-border)' }}>
                                        <th style={{ padding: '1.5rem' }}>Reg Num</th>
                                        <th>Owner</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRecords.map(r => (
                                        <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '1.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>{r.regNum}</td>
                                            <td>{r.owner}</td>
                                            <td>
                                                <button onClick={() => deleteRegistration(r.id)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    )}

                    {view === 'users' && (
                        <motion.div key="users" className="glass-card" style={{ padding: 0 }}>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(0, 242, 255, 0.1)', borderBottom: '1px solid var(--glass-border)' }}>
                                        <th style={{ padding: '1.5rem' }}>Name</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '1.5rem' }}>{u.name}</td>
                                            <td><span style={{ color: u.role === 'admin' ? 'var(--secondary)' : '#fff' }}>{u.role.toUpperCase()}</span></td>
                                            <td>
                                                <button onClick={() => deleteUser(u.id)} disabled={u.role === 'admin'} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: u.role === 'admin' ? 'not-allowed' : 'pointer', opacity: u.role === 'admin' ? 0.3 : 1 }}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    )}

                    {view === 'types' && (
                        <motion.div key="types">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                {vehicleTypes.map(t => (
                                    <div key={t.id} className="glass-card" style={{ border: editingId === t.id ? '1px solid var(--primary)' : '1px solid var(--glass-border)' }}>
                                        {editingId === t.id ? (
                                            <div>
                                                <input style={inputStyle} value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} />
                                                <input style={inputStyle} value={editData.baseReg} onChange={e => setEditData({ ...editData, baseReg: e.target.value })} />
                                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                                    <button className="neon-button" style={{ padding: '0.4rem 1rem' }} onClick={handleSaveType}>Save</button>
                                                    <button className="neon-button secondary" style={{ padding: '0.4rem 1rem' }} onClick={() => setEditingId(null)}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 className="futuristic-font" style={{ color: 'var(--primary)' }}>{t.name}</h3>
                                                <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.5rem' }}>PLATE PREFIX: {t.baseReg}</div>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                                                    <button onClick={() => handleEditType(t)} style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={16} /></button>
                                                    <button onClick={() => deleteVehicleType(t.id)} style={{ color: '#ff4d4d', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                                <button
                                    className="glass-card"
                                    style={{ border: '2px dashed var(--secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', cursor: 'pointer' }}
                                    onClick={() => setShowAddType(true)}
                                >
                                    <Plus size={32} color="var(--secondary)" />
                                    <span style={{ color: 'var(--secondary)' }}>ADD NEW CATEGORY</span>
                                </button>
                            </div>

                            {showAddType && (
                                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                                    <div className="glass-card" style={{ width: '400px' }}>
                                        <h3 className="futuristic-font">Add Vehicle <span className="neon-text">Type</span></h3>
                                        <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '1rem', display: 'block' }}>Name (e.g. Scooter)</label>
                                        <input style={inputStyle} value={newType.name} onChange={e => setNewType({ ...newType, name: e.target.value })} />
                                        <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '1rem', display: 'block' }}>Plate Prefix (e.g. SC)</label>
                                        <input style={inputStyle} value={newType.baseReg} onChange={e => setNewType({ ...newType, baseReg: e.target.value })} />
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                            <button className="neon-button" style={{ flex: 1 }} onClick={handleAddType}>Create</button>
                                            <button className="neon-button secondary" style={{ flex: 1 }} onClick={() => setShowAddType(false)}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;
