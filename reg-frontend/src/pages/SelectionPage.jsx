import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Car, Bike, Truck, Bus, Tractor, Zap, ArrowRight, Package, Shield, Settings, HelpCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

// Local icon/color mapping for known types
const vehicleMapping = {
    car: { icon: <Car size={40} />, color: '#00f2ff' },
    bike: { icon: <Bike size={40} />, color: '#bc13fe' },
    truck: { icon: <Truck size={40} />, color: '#2e5bff' },
    bus: { icon: <Bus size={40} />, color: '#ffbd00' },
    tractor: { icon: <Tractor size={40} />, color: '#ff4d4d' },
    ev: { icon: <Zap size={40} />, color: '#00ff88' },
    autorickshaw: { icon: <Shield size={40} />, color: '#ff7b00' },
    scooter: { icon: <Bike size={40} />, color: '#bc13fe' },
    moped: { icon: <Bike size={40} />, color: '#a0a0a0' },
    trailer: { icon: <Package size={40} />, color: '#6e44ff' },
    crane: { icon: <Settings size={40} />, color: '#ffcc00' },
    ambulance: { icon: <Plus size={40} />, color: '#ff3333' },
    'fire-truck': { icon: <Settings size={40} />, color: '#ff0000' },
    tanker: { icon: <Package size={40} />, color: '#444444' },
    van: { icon: <Bus size={40} />, color: '#00ccff' },
    luxury: { icon: <Car size={40} />, color: '#ffd700' },
};

const getVehicleMeta = (id) => vehicleMapping[id] || { icon: <HelpCircle size={40} />, color: '#ffffff' };

const VehicleCard = ({ vehicle, isSelected, onSelect }) => {
    const meta = getVehicleMeta(vehicle.id);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [20, -20]);
    const rotateY = useTransform(x, [-100, 100], [-20, 20]);

    function handleMouseMove(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            style={{
                perspective: 1000,
                width: '100%',
            }}
            onClick={() => onSelect(vehicle.id)}
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                    cursor: 'pointer',
                }}
                className={`glass-card ${isSelected ? 'selected' : ''}`}
                animate={{
                    borderColor: isSelected ? meta.color : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: isSelected ? `0 0 20px ${meta.color}` : 'none',
                }}
            >
                <div style={{ transform: 'translateZ(50px)', pointerEvents: 'none', textAlign: 'center' }}>
                    <motion.div
                        animate={{
                            scale: isSelected ? 1.2 : 1,
                            color: isSelected ? meta.color : '#fff'
                        }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        style={{ marginBottom: '1rem' }}
                    >
                        {meta.icon}
                    </motion.div>
                    <h3 style={{ color: isSelected ? meta.color : '#fff', fontSize: '0.9rem' }}>{vehicle.name}</h3>
                </div>
            </motion.div>
        </motion.div>
    );
};

const SelectionPage = () => {
    const { selectedVehicle, setSelectedVehicle, vehicleTypes } = useAppContext();
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ marginBottom: '3rem', textAlign: 'center' }}
            >
                Select Your <span className="neon-text">Vehicle Type</span>
            </motion.h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1.5rem',
                maxWidth: '1200px',
                width: '100%',
                marginBottom: '4rem'
            }}>
                {vehicleTypes.map((v) => (
                    <VehicleCard
                        key={v.id}
                        vehicle={v}
                        isSelected={selectedVehicle === v.id}
                        onSelect={setSelectedVehicle}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <button
                    className={`neon-button ${!selectedVehicle ? 'disabled' : ''}`}
                    disabled={!selectedVehicle}
                    onClick={() => navigate('/register')}
                    style={{
                        opacity: selectedVehicle ? 1 : 0.5,
                        cursor: selectedVehicle ? 'pointer' : 'not-allowed'
                    }}
                >
                    Continue <ArrowRight size={20} />
                </button>
            </motion.div>
        </div>
    );
};

export default SelectionPage;
