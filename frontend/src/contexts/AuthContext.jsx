import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLoginUser } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isloggedIn, setIsLoggedIn] = useState(false);
    const [errors, setErrors] = useState({});

    const { mutateAsync: loginUser, isPending } = useLoginUser();

    // 1. Check if user is already logged in on initial page load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.email !== null && userData.rawPassword !== null) {
                setUser(userData);
                //login(userData.email, userData.rawPassword, true);
            }
        }
    }, []);

    // 2. Login Function
    const login = async (email, password, rememberMe) => {
        setErrors({})

        const data = await loginUser({
            email: email,
            rawPassword: password
        });
        const userData = {
            email: rememberMe && email || null,
            rawPassword: rememberMe && password || null,
            token: data.access_token,
        }

        setUser(userData);
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // 3. Logout Function
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ user, isloggedIn, login, logout, isPending, errors, setErrors }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);