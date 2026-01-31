import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({
    baseURL: base
});

// Add interceptor for tokens
api.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [isLoading, setIsLoading] = useState(true);

    const [registrations, setRegistrations] = useState([]);
    const [users, setUsers] = useState([]);
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [history, setHistory] = useState([]);

    // Fetch data on load
    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }
            try {
                const [regs, types, hist] = await Promise.all([
                    api.get('/registrations'),
                    api.get('/vehicle-types'),
                    api.get('/history')
                ]);
                setRegistrations(regs.data);
                setVehicleTypes(types.data);
                setHistory(hist.data);

                if (user.role === 'admin') {
                    const usrs = await api.get('/users');
                    setUsers(usrs.data);
                }
            } catch (err) {
                console.error("Data fetch error", err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    logout();
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const login = (userData, token) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        setUser(null);
        setRegistrations([]);
        setHistory([]);
    };

    const addRegistration = async (reg) => {
        try {
            const res = await api.post('/registrations', { ...reg, ownerEmail: user.email });
            setRegistrations(prev => [...prev, res.data]);
            const histRes = await api.get('/history');
            setHistory(histRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const updateRegistration = async (id, updatedData) => {
        setRegistrations(prev => prev.map(r => r.id === id ? { ...r, ...updatedData } : r));
    };

    const deleteRegistration = async (id) => {
        try {
            await api.delete(`/registrations/${id}`);
            setRegistrations(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteUser = async (id) => {
        try {
            await api.delete(`/users/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const addVehicleType = async (type) => {
        try {
            const res = await api.post('/vehicle-types', type);
            setVehicleTypes(prev => [...prev, res.data]);
        } catch (err) {
            console.error(err);
        }
    };

    const updateVehicleType = async (id, updatedData) => {
        try {
            const res = await api.put(`/vehicle-types/${id}`, updatedData);
            setVehicleTypes(prev => prev.map(t => t.id === id ? res.data : t));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteVehicleType = async (id) => {
        try {
            await api.delete(`/vehicle-types/${id}`);
            setVehicleTypes(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AppContext.Provider value={{
            selectedVehicle,
            setSelectedVehicle,
            user,
            login,
            logout,
            isLoading,
            setIsLoading,
            registrations,
            addRegistration,
            updateRegistration,
            deleteRegistration,
            users,
            deleteUser,
            vehicleTypes,
            addVehicleType,
            updateVehicleType,
            deleteVehicleType,
            history
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
