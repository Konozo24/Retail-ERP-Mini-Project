import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLoginUser } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState({});

    const { mutateAsync: loginUser, isPending } = useLoginUser();

    // 1. Check if user is already logged in on initial page load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.username !== null && userData.rawPassword !== null) {
                //login(userData.username, userData.rawPassword, true);
            }
        }
    }, []);

    const aa = async () => true;
    
    // 2. Login Function
    const login = async (username, password, rememberMe) => {
        setErrors({})
        const data = await loginUser({
            username: username,
            rawPassword: password
        });
        const userData = {
            username: rememberMe && username || null,
            rawPassword: rememberMe && 123457 || null,
            token: data.access_token,
        }

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // 3. Logout Function
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isPending, errors, setErrors }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);