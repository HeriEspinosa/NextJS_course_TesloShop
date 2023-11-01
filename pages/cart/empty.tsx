import { NextPage } from 'next';
import NextLink from 'next/link';
import { ShopLayout } from '@/components/layouts';
import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

const EmptyPage: NextPage = () => {
    return (
        <ShopLayout
            title="Carrito vacio"
            pageDescription="No hay articulos en el carrito de compras"
        >
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="calc(100vh - 200px)"
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
            >
                <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Typography>Su carrito esta vacio</Typography>
                    <NextLink href="/" passHref>
                        <Typography variant="h1" color="secondary">
                            Regresar
                        </Typography>
                    </NextLink>
                </Box>
            </Box>
        </ShopLayout>
    );
};

export default EmptyPage;
