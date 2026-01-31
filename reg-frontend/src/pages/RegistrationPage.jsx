import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Send, Info, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RegistrationReveal from '../components/RegistrationReveal';
import { useAppContext } from '../context/AppContext';
import confetti from 'canvas-confetti';

const indianStates = [
    // ... (keep the states array)
    { code: 'AN', name: 'Andaman and Nicobar Islands' },
    { code: 'AP', name: 'Andhra Pradesh' },
    { code: 'AR', name: 'Arunachal Pradesh' },
    { code: 'AS', name: 'Assam' },
    { code: 'BR', name: 'Bihar' },
    { code: 'CH', name: 'Chandigarh' },
    { code: 'CT', name: 'Chhattisgarh' },
    { code: 'DN', name: 'Dadra and Nagar Haveli' },
    { code: 'DD', name: 'Daman and Diu' },
    { code: 'DL', name: 'Delhi' },
    { code: 'GA', name: 'Goa' },
    { code: 'GJ', name: 'Gujarat' },
    { code: 'HR', name: 'Haryana' },
    { code: 'HP', name: 'Himachal Pradesh' },
    { code: 'JK', name: 'Jammu and Kashmir' },
    { code: 'JH', name: 'Jharkhand' },
    { code: 'KA', name: 'Karnataka' },
    { code: 'KL', name: 'Kerala' },
    { code: 'LD', name: 'Lakshadweep' },
    { code: 'MP', name: 'Madhya Pradesh' },
    { code: 'MH', name: 'Maharashtra' },
    { code: 'MN', name: 'Manipur' },
    { code: 'ML', name: 'Meghalaya' },
    { code: 'MZ', name: 'Mizoram' },
    { code: 'NL', name: 'Nagaland' },
    { code: 'OR', name: 'Odisha' },
    { code: 'PY', name: 'Puducherry' },
    { code: 'PB', name: 'Punjab' },
    { code: 'RJ', name: 'Rajasthan' },
    { code: 'SK', name: 'Sikkim' },
    { code: 'TN', name: 'Tamil Nadu' },
    { code: 'TG', name: 'Telangana' },
    { code: 'TR', name: 'Tripura' },
    { code: 'UP', name: 'Uttar Pradesh' },
    { code: 'UK', name: 'Uttarakhand' },
    { code: 'WB', name: 'West Bengal' }
];

const RegistrationPage = () => {
    const { selectedVehicle, addRegistration } = useAppContext();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generatedReg, setGeneratedReg] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        model: '',
        manufacturer: '',
        year: '2025',
        fuelType: 'Electric',
        stateCode: 'TN',
        districtCode: '37',
        chassisNumber: '',
        engineNumber: '',
        color: '',
        address: ''
    });

    useEffect(() => {
        if (!selectedVehicle) {
            navigate('/select');
        }
    }, [selectedVehicle, navigate]);

    const generateRegNumber = () => {
        // Format: [ST] [DI] [SE] [NUM] -> TN 37 DF 2585
        const state = formData.stateCode;
        const district = formData.districtCode.padStart(2, '0');

        // Generate random 2-letter series (e.g., AA, BC, ZY)
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const series = alphabet[Math.floor(Math.random() * 26)] + alphabet[Math.floor(Math.random() * 26)];

        const number = Math.floor(1000 + Math.random() * 8999);
        return `${state} ${district} ${series} ${number}`;
    };

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.chassisNumber || !formData.engineNumber) {
            alert("Please fill in chassis and engine numbers.");
            return;
        }

        setIsSubmitting(true);

        // Simulate AI Processing
        setTimeout(() => {
            const regNum = generateRegNumber();
            setGeneratedReg(regNum);

            // Add to global state
            const ownerName = localStorage.getItem('userName') || 'Pilot';
            addRegistration({
                regNum,
                owner: ownerName,
                ownerEmail: localStorage.getItem('userEmail'),
                type: selectedVehicle,
                model: formData.model,
                manufacturer: formData.manufacturer,
                state: indianStates.find(s => s.code === formData.stateCode)?.name,
                chassis: formData.chassisNumber,
                engine: formData.engineNumber,
                status: 'Active'
            });

            setIsSubmitting(false);
            setStep(3);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#00f2ff', '#bc13fe', '#2e5bff']
            });
        }, 3000);
    };

    const inputStyle = {
        width: '100%',
        padding: '0.8rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--glass-border)',
        borderRadius: '4px',
        color: '#fff',
        outline: 'none',
        marginTop: '0.4rem'
    };

    const labelStyle = {
        fontSize: '0.8rem',
        color: 'var(--text-dim)',
        display: 'block',
        marginTop: '1rem'
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
            <motion.div
                className="glass-card"
                style={{ maxWidth: '600px', width: '100%' }}
                layout
            >
                {step < 3 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        {[1, 2].map((i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    background: step >= i ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                    color: step >= i ? 'var(--bg-color)' : '#fff',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontWeight: 'bold'
                                }}>{i}</div>
                                <span style={{ fontSize: '0.8rem', color: step >= i ? '#fff' : 'var(--text-dim)' }}>
                                    {i === 1 ? 'Vehicle Details' : 'Security Info'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 className="futuristic-font" style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Vehicle Information</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Select State</label>
                                    <select style={inputStyle} value={formData.stateCode} onChange={e => setFormData({ ...formData, stateCode: e.target.value })}>
                                        {indianStates.map(s => <option key={s.code} value={s.code}>{s.name} ({s.code})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>District Code</label>
                                    <input type="number" placeholder="37" style={inputStyle} value={formData.districtCode} onChange={e => setFormData({ ...formData, districtCode: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Manufacturer</label>
                                    <input placeholder="Tesla / BMW" style={inputStyle} value={formData.manufacturer} onChange={e => setFormData({ ...formData, manufacturer: e.target.value })} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Model</label>
                                    <input placeholder="Model S / X5" style={inputStyle} value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Year</label>
                                    <input type="number" style={inputStyle} value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Fuel Type</label>
                                    <select style={inputStyle} value={formData.fuelType} onChange={e => setFormData({ ...formData, fuelType: e.target.value })}>
                                        <option>Petrol</option>
                                        <option>Diesel</option>
                                        <option>Electric</option>
                                        <option>Hybrid</option>
                                    </select>
                                </div>
                            </div>
                            <button className="neon-button" style={{ width: '100%', marginTop: '2rem', justifyContent: 'center' }} onClick={handleNext}>
                                Next Step <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 className="futuristic-font" style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Security Identification</h2>
                            <label style={labelStyle}>Chassis Number (VIN)</label>
                            <input placeholder="17-Digit Identifier" style={inputStyle} value={formData.chassisNumber} onChange={e => setFormData({ ...formData, chassisNumber: e.target.value })} />

                            <label style={labelStyle}>Engine Number</label>
                            <input placeholder="Unique Engine ID" style={inputStyle} value={formData.engineNumber} onChange={e => setFormData({ ...formData, engineNumber: e.target.value })} />

                            <label style={labelStyle}>Owner Address</label>
                            <textarea placeholder="Legal Registered Address" style={{ ...inputStyle, height: '80px', resize: 'none' }} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button className="neon-button secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleBack}>
                                    <ArrowLeft size={18} /> Back
                                </button>
                                <button className="neon-button" style={{ flex: 2, justifyContent: 'center' }} onClick={handleSubmit} disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                            <Info size={18} />
                                        </motion.div>
                                    ) : (
                                        <><Send size={18} /> Generate ID</>
                                    )}
                                </button>
                            </div>
                            {isSubmitting && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--primary)' }}
                                >
                                    AI-Pattern Recognition in progress...
                                </motion.p>
                            )}
                        </motion.div>
                    )}

                    {step === 3 && (
                        <RegistrationReveal
                            registrationData={{
                                regNum: generatedReg,
                                owner: 'Pilot', // Mock or get from context
                                ownerEmail: localStorage.getItem('userEmail') || 'user@example.com',
                                model: formData.model,
                                manufacturer: formData.manufacturer,
                                state: indianStates.find(s => s.code === formData.stateCode)?.name
                            }}
                            onAction={(action) => {
                                if (action === 'dashboard') navigate('/dashboard');
                                if (action === 'history') navigate('/dashboard?tab=history');
                            }}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default RegistrationPage;
