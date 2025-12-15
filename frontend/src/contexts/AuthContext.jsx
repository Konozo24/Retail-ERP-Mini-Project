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
        const storedToken = localStorage.getItem('user_token');
        if (storedUser && storedToken) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsLoggedIn(true);
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
            email: email,
            rawPassword: password,
        }

        setUser(userData);

        if (rememberMe) {
            localStorage.setItem('user', JSON.stringify(userData))
        } else {
            localStorage.removeItem('user');
        }

        setIsLoggedIn(true);
        localStorage.setItem('user_token', data.access_token);
    };

    // 3. Logout Function
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('user_token');
        setUser(null);
        setIsLoggedIn(false);
    };

    // 3. Refresh Token Function
    const refreshToken = async () => {
        if (user) {
            login(user.email, user.rawPassword, true);
        } else {
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{ user, isloggedIn, login, logout, refreshToken, isPending, errors, setErrors }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);