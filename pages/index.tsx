import { NextPage } from 'next';
import { ShopLayout } from '@/components/layouts';
import { Typography } from '@mui/material';
import { ProductList } from '@/components/products';
import { useProducts } from '@/hooks';
import { ScreenLoading } from '@/components/ui';

const HomePage: NextPage = () => {
    const { products, isLoading } = useProducts('/products');

    return (
        <>
            <ShopLayout
                title={'Teslo-Shop - Home'}
                pageDescription={'Encuentra los mejores productos de Teslo aqui'}
            >
                <Typography variant="h1" component="h1">
                    Tienda Teslo
                </Typography>
                <Typography sx={{ mb: 1 }} paddingBottom={2}>
                    Todos los productos
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

export default HomePage;
