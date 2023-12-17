import { useContext, useState } from 'react';
import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { CartContext } from '@/context';

import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { ShopLayout } from '@/components/layouts';
import { ProductSlideshow, SizeSelector } from '@/components/products';
import { ItemCounter } from '@/components/ui';
import { ICartProduct, IProduct, ISize } from '@/interfaces';
import { dbProducts } from '@/database';

interface Props {
    product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
    const { addProductToCart } = useContext(CartContext);

    const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
        _id: product._id,
        images: product.images[0],
        price: product.price,
        size: undefined,
        slug: product.slug,
        title: product.title,
        gender: product.gender,
        quantity: 1,
    });

    const router = useRouter();

    // Methods
    const selectedSize = (size: ISize) => {
        setTempCartProduct((currentProduct) => ({
            ...currentProduct,
            size,
        }));
    };

    const onUpdateQuantity = (quantity: number) => {
        setTempCartProduct((currentProduct) => ({
            ...currentProduct,
            quantity,
        }));
    };

    const onAddProduct = () => {
        if (!tempCartProduct.size) return;

        //llamar la opcion del context
        // router.push('/cart');

        addProductToCart(tempCartProduct);
    };

    return (
        <ShopLayout title={product.title} pageDescription={product.description}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={7}>
                    <ProductSlideshow images={product.images} />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Box display="flex" flexDirection="column">
                        {/* titulos */}
                        <Typography variant="h1" component="h1">
                            {product.title}
                        </Typography>
                        <Typography variant="subtitle1" component="h2">
                            {`$${product.price}`}
                        </Typography>

                        {/* Cantidad */}
                        <Box sx={{ my: 2 }}>
                            <Typography variant="subtitle2">Cantidad</Typography>
                            <ItemCounter
                                currentValue={tempCartProduct.quantity}
                                updateQuantity={onUpdateQuantity}
                                maxValue={product.inStock > 10 ? 10 : product.inStock}
                            />
                            <SizeSelector
                                selectedSize={tempCartProduct.size}
                                sizes={product.sizes}
                                onSelectedSize={selectedSize}
                            />
                        </Box>

                        {product.inStock > 0 ? (
                            <Button
                                className="circular-btn"
                                color="secondary"
                                disabled={!tempCartProduct.size}
                                onClick={onAddProduct}
                            >
                                {tempCartProduct.size
                                    ? 'Agregar al carrito'
                                    : 'Seleccione una talla'}
                            </Button>
                        ) : (
                            <Chip
                                label="No hay disponible"
                                color="error"
                                variant="outlined"
                            />
                        )}

                        {/* Descripcion */}
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2">Descripcion</Typography>
                            <Typography variant="body2">{product.description}</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

// ! No usar esto SSR
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//     const { slug = '' } = params as { slug: string };
//     const product = await dbProducts.getProductBySlug(slug);

//     if (!product) {
//         return {
//             redirect: {
//                 destination: '/',
//                 permanent: false,
//             },
//         };
//     }

//     return {
//         props: {
//             product,
//         },
//     };
// };

export const getStaticPaths: GetStaticPaths = async (ctx) => {
    const productSlugs = await dbProducts.getAllProductSlugs();

    return {
        paths: productSlugs.map(({ slug }) => ({
            params: {
                slug,
            },
        })),
        fallback: false,
    };
};

// getStaticProps...
// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug = '' } = params as { slug: string };
    const product = await dbProducts.getProductBySlug(slug);

    if (!product) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: {
            product,
        },
        revalidate: 86400, // Revalidar cada 24hrs
    };
};

export default ProductPage;
