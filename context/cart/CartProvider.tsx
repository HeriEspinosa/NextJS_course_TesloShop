import { FC, PropsWithChildren, useEffect, useReducer } from 'react';
import Cookies from 'js-cookie';
import { CartContext, cartReducer } from './';
import { ICartProduct } from '@/interfaces';

export interface CartState {
    cart: ICartProduct[];
    numbersOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
}

const CART_INITIAL_STATE: CartState = {
    cart: [],
    numbersOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
};

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

    useEffect(() => {
        try {
            const cookieProductInCart = Cookies.get('cartProd')
                ? JSON.parse(Cookies.get('cartProd')!)
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
        if (state.cart.length > 0) {
            Cookies.set('cartProd', JSON.stringify(state.cart));
        }
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

    return (
        <CartContext.Provider
            value={{
                ...state,

                //Methods
                addProductToCart,
                updateCartQuantity,
                removeCartProduct,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
