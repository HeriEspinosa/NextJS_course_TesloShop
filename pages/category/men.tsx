import { NextPage } from 'next';
import { ShopLayout } from '@/components/layouts';
import { Typography } from '@mui/material';
import { ProductList } from '@/components/products';
import { useProducts } from '@/hooks';
import { ScreenLoading } from '@/components/ui';

const MenPage: NextPage = () => {
    const { products, isLoading } = useProducts('/products?gender=men');

    return (
        <>
            <ShopLayout
                title={'Teslo-Shop - Men'}
                pageDescription={'Encuentra los mejores productos de Teslo para hombres'}
            >
                <Typography variant="h1" component="h1">
                    Hombres
                </Typography>
                <Typography sx={{ mb: 1 }} paddingBottom={2}>
                    Productos para Hombres
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

export default MenPage;
