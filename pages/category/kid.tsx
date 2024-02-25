import { NextPage } from 'next';
import { ShopLayout } from '@/components/layouts';
import { Typography } from '@mui/material';
import { ProductList } from '@/components/products';
import { useProducts } from '@/hooks';
import { ScreenLoading } from '@/components/ui';

const KidPage: NextPage = () => {
    const { products, isLoading } = useProducts('/products?gender=kid');

    return (
        <>
            <ShopLayout
                title={'Teslo-Shop - Kids'}
                pageDescription={'Encuentra los mejores productos de Teslo para niños'}
            >
                <Typography variant="h1" component="h1">
                    Niños
                </Typography>
                <Typography sx={{ mb: 1 }} paddingBottom={2}>
                    Productos para niños
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

export default KidPage;
