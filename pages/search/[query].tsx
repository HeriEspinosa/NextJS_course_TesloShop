import { NextPage, GetServerSideProps } from 'next';
import { ShopLayout } from '@/components/layouts';
import { Box, Typography } from '@mui/material';
import { ProductList } from '@/components/products';
import { dbProducts } from '@/database';
import { IProduct } from '@/interfaces';
import { getAllproducts } from '@/database/dbProducts';

interface Props {
    products: IProduct[];
    foundProducts: boolean;
    query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
    return (
        <>
            <ShopLayout
                title={'Teslo-Shop - Search'}
                pageDescription={'Encuentra los mejores productos de Teslo aqui'}
            >
                <Typography variant="h1" component="h1">
                    Buscar Producto
                </Typography>
                {foundProducts ? (
                    <Box display="flex" gap={0.5}>
                        <Typography>Productos -</Typography>
                        <Typography
                            sx={{ mb: 1 }}
                            paddingBottom={2}
                            color="secondary"
                            textTransform="capitalize"
                        >
                            {query}
                        </Typography>
                    </Box>
                ) : (
                    <Box display="flex" gap={1}>
                        <Typography>No encontramos ningun producto llamado:</Typography>
                        <Typography
                            sx={{ mb: 1 }}
                            paddingBottom={2}
                            color="secondary"
                            textTransform="capitalize"
                        >
                            {query}
                        </Typography>
                    </Box>
                )}

                <ProductList products={products || []} />
            </ShopLayout>
        </>
    );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { query = '' } = params as { query: string };

    if (query.length === 0) {
        return {
            redirect: {
                destination: '/',
                permanent: true,
            },
        };
    }

    let products = await dbProducts.getProductsByTerm(query);
    const foundProducts = products.length > 0;

    // TODO: retornar otros productos
    if (!foundProducts) {
        products = await getAllproducts();
    }

    return {
        props: {
            products,
            foundProducts,
            query,
        },
    };
};

export default SearchPage;
