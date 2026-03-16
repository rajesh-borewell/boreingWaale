import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreateBill from './pages/CreateBill';
import CreateEstimate from './pages/CreateEstimate';
import BillHistory from './pages/BillHistory';
import EstimateHistory from './pages/EstimateHistory';
import ViewBill from './pages/ViewBill';
import ViewEstimate from './pages/ViewEstimate';
import Login from './pages/Login';
import Signup from './pages/Signup';

function AnimatedRoutes({ authInfo, setAuthInfo, handleLogout }) {
    const location = useLocation();

    return (
        <div className="flex-1 w-full relative">
            {authInfo && <Navbar onLogout={handleLogout} username={authInfo.username} />}
            <main className={`${!authInfo ? '' : 'px-4 py-8'}`}>
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        {/* Auth Routes */}
                        <Route
                            path="/login"
                            element={!authInfo ? <Login setAuthInfo={setAuthInfo} /> : <Navigate to="/" replace />}
                        />
                        <Route
                            path="/signup"
                            element={!authInfo ? <Signup setAuthInfo={setAuthInfo} /> : <Navigate to="/" replace />}
                        />

                        {/* Protected Routes */}
                        <Route
                            path="/"
                            element={authInfo ? <Dashboard /> : <Navigate to="/login" replace />}
                        />
                        <Route
                            path="/create"
                            element={authInfo ? <CreateBill /> : <Navigate to="/login" replace />}
                        />
                        <Route
                            path="/create-estimate"
                            element={authInfo ? <CreateEstimate /> : <Navigate to="/login" replace />}
                        />
                        <Route
                            path="/history"
                            element={authInfo ? <BillHistory /> : <Navigate to="/login" replace />}
                        />
                        <Route
                            path="/estimate-history"
                            element={authInfo ? <EstimateHistory /> : <Navigate to="/login" replace />}
                        />
                        <Route
                            path="/view/:id"
                            element={authInfo ? <ViewBill /> : <Navigate to="/login" replace />}
                        />
                        <Route
                            path="/view-estimate/:id"
                            element={authInfo ? <ViewEstimate /> : <Navigate to="/login" replace />}
                        />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </AnimatePresence>
            </main>
        </div>
    );
}

function App() {
    const [authInfo, setAuthInfo] = useState(() => {
        const token = sessionStorage.getItem('token');
        const username = sessionStorage.getItem('username');
        if (token && token !== 'null' && token !== 'undefined') {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return { token, username };
        }
        return null;
    });

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use((config) => {
            const token = sessionStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('username');
                    setAuthInfo(null);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        delete axios.defaults.headers.common['Authorization'];
        setAuthInfo(null);
    };

    return (
        <BrowserRouter>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3500,
                    style: { borderRadius: '12px', fontWeight: '600', fontSize: '14px' },
                    success: { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } },
                    error:   { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } },
                }}
            />
            <div className="min-h-screen flex flex-col bg-[#020617]">
                <AnimatedRoutes 
                    authInfo={authInfo} 
                    setAuthInfo={setAuthInfo} 
                    handleLogout={handleLogout} 
                />
            </div>
        </BrowserRouter>
    );
}

export default App;
