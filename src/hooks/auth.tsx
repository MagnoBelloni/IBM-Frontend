import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface User {
    name: string;
    balance: Number;
}

interface UpdateUser {
    name: string;
    newBalance: Number,
}

interface AuthState {
    token: string;
    user: User;
}

interface SignInCredentials {
    account_number: string;
    password: string;
}

interface AuthContextData {
    user: User;
    signIn(credential: SignInCredentials): Promise<void>;
    signOut(): void;
    updateUser(user: UpdateUser): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
    const [data, setData] = useState<AuthState>(() => {
        const token = localStorage.getItem('@IBM:token');
        const user = localStorage.getItem('@IBM:user');

        if (token && user) {
            api.defaults.headers.authorization = `Bearer ${token}`;

            return { token, user: JSON.parse(user) };
        }

        return {} as AuthState;
    });

    const signIn = useCallback(async ({ account_number, password }) => {
        const response = await api.post('/login', {
            account_number,
            password,
        });

        const { token, user } = response.data;

        localStorage.setItem('@IBM:token', token);
        localStorage.setItem('@IBM:user', JSON.stringify(user));

        api.defaults.headers.authorization = `Bearer ${token}`;

        setData({ token, user });
    }, []);

    const signOut = useCallback(() => {
        localStorage.removeItem('@IBM:token');
        localStorage.removeItem('@IBM:user');

        setData({} as AuthState);
    }, []);

    const updateUser = useCallback(
        (user: UpdateUser) => {
            const newUser: User = {
                balance: user.newBalance,
                name: user.name,
            }

            localStorage.setItem('@IBM:user', JSON.stringify(newUser));

            setData({
                token: data.token,
                user: newUser,
            });
        },
        [setData, data.token],
    );

    return (
        <AuthContext.Provider
            value={{ user: data.user, signIn, signOut, updateUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
