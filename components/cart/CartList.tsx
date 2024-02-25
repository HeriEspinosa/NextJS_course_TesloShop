import { Box, Button, CardActionArea, CardMedia, Grid, Typography } from '@mui/material';
import { FC, useContext } from 'react';
import NextLink from 'next/link';
import { ItemCounter } from '../ui';
import { CartContext } from '@/context';
import { ICartProduct, IOrderItem } from '@/interfaces';

interface Props {
    editable?: boolean;
    product?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, product }) => {
    const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext);

    const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
        product.quantity = newQuantityValue;
        updateCartQuantity(product);
    };

    const productsToShow = product ? product : cart;

    return (
        <>
            {productsToShow.map((product) => (
                <Grid
                    container
                    spacing={2}
                    key={`${product.slug}-${product.size}`}
                    sx={{ mb: 1 }}
                >
                    <Grid item xs={3}>
                        {/* TODO llevar a la pagina del producto */}
                        <NextLink href={`/product/${product.slug}`} passHref>
                            <CardActionArea>
                                <CardMedia
                                    image={`/products/${product.images}`}
                                    component="img"
                                    sx={{ borderRadius: '5px' }}
                                />
                            </CardActionArea>
                        </NextLink>
                    </Grid>
                    <Grid item xs={7}>
                        <Box display="flex" flexDirection="column" sx={{ mt: 0.5 }}>
                            <Typography variant="body1">{product.title}</Typography>
                            <Typography variant="body1">
                                Talla: <strong>{product.size}</strong>
                            </Typography>

                            {/* Condicional */}

                            {editable ? (
                                <ItemCounter
                                    currentValue={product.quantity}
                                    maxValue={10}
                                    updateQuantity={(newValue) => {
                                        onNewCartQuantityValue(
                                            product as ICartProduct,
                                            newValue
                                        );
                                    }}
                                />
                            ) : (
                                <Typography variant="body1">
                                    <strong>{product.quantity}</strong>{' '}
                                    {product.quantity > 1 ? 'productos' : 'producto'}
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                    <Grid
                        item
                        xs={2}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        paddingRight={3}
                    >
                        <Typography variant="subtitle1">{`$${product.price}`}</Typography>
                        {editable && (
                            <Button
                                variant="text"
                                color="secondary"
                                onClick={() => removeCartProduct(product as ICartProduct)}
                            >
                                Remover
                            </Button>
                        )}
                    </Grid>
                </Grid>
            ))}
        </>
    );
};
