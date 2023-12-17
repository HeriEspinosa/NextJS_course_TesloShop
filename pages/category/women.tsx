import { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ScreenLoading } from '@/components/ui';
import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { useProducts } from '@/hooks';

const WomenPage: NextPage = () => {
    const { products, isLoading } = useProducts('/products?gender=women');

    return (
        <>
            <ShopLayout
                title={'Teslo-Shop - Women'}
                pageDescription={'Encuentra los mejores productos de Teslo para mujeres'}
            >
                <Typography variant="h1" component="h1">
                    Mujeres
                </Typography>
                <Typography sx={{ mb: 1 }} paddingBottom={2}>
                    Productos para mujeres
                </Typography>

                {isLoading ? (
                    <ScreenLoading />
                ) : (
                    <ProductList products={products || []} />
                )}
            </ShopLayout>
        </>
    );
};

export default WomenPage;
