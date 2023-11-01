import { FC, useState, useMemo } from 'react';
import { IProduct } from '@/interfaces';
import { Box, Card, CardActionArea, CardMedia, Grid, Typography } from '@mui/material';
import NextLink from 'next/link';

interface Props {
    product: IProduct;
}

export const ProductCard: FC<Props> = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);

    const productImage = useMemo(() => {
        return !isHovered
            ? `products/${product.images[0]}`
            : `products/${product.images[1]}`;
    }, [isHovered, product.images]);

    return (
        <Grid
            item
            xs={6}
            sm={4}
            md={3}
            px={1}
            onMouseEnter={() => {
                setIsHovered(true);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
            }}
        >
            <Card>
                <NextLink href="/product/slug" passHref prefetch={false}>
                    <CardActionArea>
                        <CardMedia
                            className="fadeIn"
                            component="img"
                            image={productImage}
                            alt={product.title}
                        ></CardMedia>
                    </CardActionArea>
                </NextLink>
            </Card>

            <Box sx={{ m: 1 }} className="fadeIn">
                <Typography fontWeight={700}>{product.title}</Typography>
                <Typography fontWeight={500}>{`$${product.price}`}</Typography>
            </Box>
        </Grid>
    );
};
