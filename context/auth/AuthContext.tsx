import { IUserogin } from '@/interfaces';
import { createContext } from 'react';
import { ResponseAuth } from './';

interface ContextProps {
    isLoggedIn: boolean;
    user?: IUserogin;

    // Methods
    loginUser: (email: string, password: string) => Promise<ResponseAuth>;
    registerUser: (
        name: string,
        email: string,
        password: string
    ) => Promise<ResponseAuth>;
    logoutUser: () => void;
}

export const AuthContext = createContext({} as ContextProps);
