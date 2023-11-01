import { NextPage } from 'next';
import { ShopLayout } from '@/components/layouts';
import { Typography } from '@mui/material';
import { initialData } from '@/database/products';
import { ProductList } from '@/components/products';

const Home: NextPage = () => {
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

                <ProductList products={initialData.products as any} />
            </ShopLayout>
        </>
    );
};

export default Home;
