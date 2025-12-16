import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLoginUser, useLogoutUser } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errors, setErrors] = useState({});

    const { mutateAsync: loginUser, isPending } = useLoginUser();
    const { mutateAsync: logoutUser } = useLogoutUser();
    
    // 1. Check if user is already logged in on initial page load
    useEffect(() => {
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        const storedToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
    }, []);


    // 2. Login Function
    const login = async (email, password, rememberMe) => {
        setErrors({})

        const userData = {
            email: email,
            rawPassword: password,
        }
        const data = await loginUser(userData);

        setUser(userData);

        if (rememberMe) {
            localStorage.setItem('user', JSON.stringify(userData))
            localStorage.setItem('access_token', data.access_token);
        } else {
            sessionStorage.setItem('user', JSON.stringify(userData));
            sessionStorage.setItem('access_token', data.access_token);
        }

        setIsLoggedIn(true);
    };

    // 3. Logout Function
    const logout = async () => {
        await logoutUser();

        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('access_token');
        
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout, isPending, errors, setErrors }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);