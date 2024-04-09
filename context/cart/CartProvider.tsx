import { FC, PropsWithChildren, useEffect, useReducer } from 'react';
import Cookies from 'js-cookie';
import { CartContext, cartReducer } from './';
import { ICartProduct, IOrder, ShippingAddress } from '@/interfaces';
import { tesloApi } from '@/api';
import axios from 'axios';

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numbersOfItems: number;
    subTotal: number;
    tax: number;
    total: number;

    shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numbersOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined,
};

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

    useEffect(() => {
        try {
            const cookieProductInCart = Cookies.get('cart')
                ? JSON.parse(Cookies.get('cart')!)
                : [];

            dispatch({
                type: 'Cart - LoadCart from cookies | storage',
                payload: cookieProductInCart,
            });
        } catch (error) {
            dispatch({
                type: 'Cart - LoadCart from cookies | storage',
                payload: [],
            });
        }
    }, []);

    useEffect(() => {
        if (Cookies.get('firstName')) {
            const shippingAddress = {
                firstName: Cookies.get('firstName') || '',
                lastName: Cookies.get('lastName') || '',
                address: Cookies.get('address') || '',
                address2: Cookies.get('address2') || '',
                zip: Cookies.get('zip') || '',
                city: Cookies.get('city') || '',
                country: Cookies.get('country') || '',
                phone: Cookies.get('phone') || '',
            };

            dispatch({
                type: 'Cart - LoadAddress from Cookies',
                payload: shippingAddress,
            });
        }
    }, []);

    useEffect(() => {
        Cookies.set('cart', JSON.stringify(state.cart));
    }, [state.cart]);

    useEffect(() => {
        const numbersOfItems = state.cart.reduce(
            (prev, current) => current.quantity + prev,
            0
        );

        const subTotal = state.cart.reduce(
            (prev, current) => current.price * current.quantity + prev,
            0
        );

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        const orderSummay = {
            numbersOfItems,
            subTotal,
            tax: subTotal * taxRate,
            total: subTotal * (taxRate + 1),
        };

        dispatch({ type: 'Cart - Update order summary', payload: orderSummay });
    }, [state.cart]);

    const addProductToCart = (product: ICartProduct) => {
        //! Nivel 1
        // dispatch({ type: 'Cart - Add Product', payload: product });
        //! Nivel 2
        // const productInCart = state.cart.filter(
        //     (p) => p._id !== product._id && p.size !== product.size
        // );
        // dispatch({ type: 'Cart - Add Product', payload: [...productInCart, product] });
        //! Nivel final
        const productInCart = state.cart.some((item) => item._id === product._id);
        if (!productInCart)
            return dispatch({
                type: 'Cart - Update products in cart',
                payload: [...state.cart, product],
            });

        const productInCartButDifferentSize = state.cart.some(
            (item) => item.size === product.size
        );
        if (!productInCartButDifferentSize)
            return dispatch({
                type: 'Cart - Update products in cart',
                payload: [...state.cart, product],
            });

        const updatedProducts = state.cart.map((item) => {
            if (item._id !== product._id) {
                return item;
            }
            if (item.size !== product.size) {
                return item;
            }

            item.quantity += product.quantity;
            return item;
        });

        dispatch({
            type: 'Cart - Update products in cart',
            payload: updatedProducts,
        });
    };

    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({ type: 'Cart - Change cart quantity', payload: product });
    };

    const removeCartProduct = (product: ICartProduct) => {
        dispatch({ type: 'Cart - Remove product in cart', payload: product });
    };

    const updateAddress = (address: ShippingAddress) => {
        Cookies.set('firstName', address.firstName);
        Cookies.set('lastName', address.lastName);
        Cookies.set('address', address.address);
        Cookies.set('address2', address.address2 || '');
        Cookies.set('zip', address.zip);
        Cookies.set('city', address.city);
        Cookies.set('country', address.country);
        Cookies.set('phone', address.phone);

        dispatch({ type: 'Cart - Update Address', payload: address });
    };

    const createOrder = async (): Promise<{ hasError: boolean; message: string }> => {
        if (!state.shippingAddress) {
            throw new Error('No hay direccion de entrega');
        }

        const body: IOrder = {
            orderItems: state.cart.map((p) => ({
                ...p,
                size: p.size!,
            })),
            shippingAddress: state.shippingAddress,
            numbersOfItems: state.numbersOfItems,
            subTotal: state.subTotal,
            tax: state.tax,
            total: state.total,
            isPaid: false,
        };

        try {
            const { data } = await tesloApi.post('/orders', body);

            dispatch({ type: 'Cart - Order complete' });

            return {
                hasError: false,
                message: data.result._id,
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message,
                };
            }

            return {
                hasError: true,
                message: 'Error no controlado, comuniquese con soporte al cliente',
            };
        }
    };

    return (
        <CartContext.Provider
            value={{
                ...state,

                //Methods
                addProductToCart,
                updateCartQuantity,
                removeCartProduct,
                updateAddress,

                // Orders
                createOrder,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
