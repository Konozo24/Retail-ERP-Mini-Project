import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLoginUser, useLogoutUser } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    const { mutateAsync: loginUser, isPending } = useLoginUser();
    const { mutateAsync: logoutUser } = useLogoutUser();

    // Check if user is already logged in on initial page load
    useEffect(() => {
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        const storedToken = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }

        // mark loading as finished after check
        setIsLoading(false);
    }, []);


    // 2. Login Function
    const login = async (email, password, rememberMe) => {
        setErrors({})

        const userData = {
            email: email,
            rawPassword: password,
        }
        const data = await loginUser(userData);

        // Update state with email and role from response
        const userInfo = {
            email: data.email,
            role: data.role
        };
        setUser(userInfo);
        setIsLoggedIn(true);

        if (rememberMe) {
            localStorage.setItem('user', JSON.stringify(userInfo))
            localStorage.setItem('access_token', data.access_token);
        } else {
            sessionStorage.setItem('user', JSON.stringify(userInfo));
            sessionStorage.setItem('access_token', data.access_token);
        }

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
        <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout, isPending, errors, setErrors }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);