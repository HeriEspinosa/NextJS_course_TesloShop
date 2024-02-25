import { useSession, signOut } from 'next-auth/react';
import { FC, PropsWithChildren, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';

import { AuthContext, authReducer } from './';
import { IUser, IUserogin, PostAuth } from '@/interfaces';
import { tesloApi } from '@/api';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUserogin;
}

export interface ResponseAuth {
    bool: boolean;
    error?: string;
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
};

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
    const { data, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            dispatch({ type: 'Auth - Login', payload: data?.user as IUser });
        }
    }, [status, data]);

    // useEffect(() => {
    //     checkToken();
    // }, []);

    // const checkToken = async () => {
    //     if (!Cookies.get('token')) return;

    //     try {
    //         const { data } = await tesloApi.get('/user/validate-token');
    //         const { token, user } = data;

    //         Cookies.set('token', token);
    //         dispatch({ type: 'Auth - Login', payload: user });
    //     } catch (error) {
    //         Cookies.remove('token');
    //     }
    // };

    const loginUser = async (email: string, password: string): Promise<ResponseAuth> => {
        try {
            const { data } = await tesloApi.post<PostAuth>('/user/login', {
                email,
                password,
            });
            const { token, user } = data;

            Cookies.set('token', token);
            dispatch({ type: 'Auth - Login', payload: user });

            return { bool: true };
        } catch (error: any) {
            if (error.response) {
                console.log(error.response.data);
                return { error: error.response.data.message, bool: false };
            } else {
                console.log('Ops! Error al tratar de ingresar a esta cuenta ', { error });
                return { error: error.message, bool: false };
            }
        }
    };

    const registerUser = async (
        name: string,
        email: string,
        password: string
    ): Promise<ResponseAuth> => {
        try {
            const { data } = await tesloApi.post<PostAuth>('/user/register', {
                name,
                email,
                password,
            });
            const { token, user } = data;

            Cookies.set('token', token);
            dispatch({ type: 'Auth - Login', payload: user });

            return { bool: true };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    bool: false,
                    error: error.response?.data.message,
                };
            }

            return {
                bool: false,
                error: 'Ops!, no se pudo crear el usuario - intente de nuevo',
            };
        }
    };

    const logoutUser = () => {
        Cookies.remove('cartProd');
        Cookies.remove('firstName');
        Cookies.remove('lastName');
        Cookies.remove('address');
        Cookies.remove('address2');
        Cookies.remove('zip');
        Cookies.remove('city');
        Cookies.remove('country');
        Cookies.remove('phone');

        signOut();
        // Cookies.remove('token');
        // router.reload();
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,

                // Methods
                loginUser,
                registerUser,
                logoutUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
