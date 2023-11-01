import { initialData } from '@/database/products';
import { Box, Button, CardActionArea, CardMedia, Grid, Typography } from '@mui/material';
import { FC } from 'react';
import NextLink from 'next/link';
import { ItemCounter } from '../ui';

interface Props {
    editable?: boolean;
}

const productsInCart = [
    initialData.products[0],
    initialData.products[1],
    initialData.products[2],
];

export const CartList: FC<Props> = ({ editable = false }) => {
    return (
        <>
            {productsInCart.map((product) => (
                <Grid container spacing={2} key={product.slug} sx={{ mb: 1 }}>
                    <Grid item xs={3}>
                        {/* TODO llevar a la pagina del producto */}
                        <NextLink href="/product/slug" passHref>
                            <CardActionArea>
                                <CardMedia
                                    image={`products/${product.images[0]}`}
                                    component="img"
                                    sx={{ borderRadius: '5px' }}
                                />
                            </CardActionArea>
                        </NextLink>
                    </Grid>
                    <Grid item xs={7}>
                        <Box display="flex" flexDirection="column">
                            <Typography variant="body1">{product.title}</Typography>
                            <Typography variant="body1">
                                Talla: <strong>M</strong>
                            </Typography>

                            {/* Condicional */}

                            {editable ? (
                                <ItemCounter />
                            ) : (
                                <Typography variant="h6">3 items</Typography>
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
                            <Button variant="text" color="secondary">
                                Remover
                            </Button>
                        )}
                    </Grid>
                </Grid>
            ))}
        </>
    );
};