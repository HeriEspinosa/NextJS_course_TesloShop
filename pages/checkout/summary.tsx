import { FC, useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Cookies from 'js-cookie';

import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Typography,
} from '@mui/material';
import { CartContext } from '@/context';
import { CartList, OrderSummary } from '@/components/cart';
import { ShopLayout } from '@/components/layouts';
import { countries } from '@/utils';
import { useRouter } from 'next/router';
import { set } from 'mongoose';

const SummaryPage: FC = () => {
    const { shippingAddress, createOrder } = useContext(CartContext);
    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!Cookies.get('firstName')) {
            router.push('/checkout/address');
        }
    }, [router]);

    if (!shippingAddress) {
        return <></>;
    }

    const {
        firstName,
        lastName,
        address,
        address2 = '',
        city,
        country,
        zip,
        phone,
    } = shippingAddress;

    const onCreateOrder = async () => {
        setIsPosting(true);
        const { hasError, message } = await createOrder(); //TODO: depende del resultado debo de navegar o no

        if (hasError) {
            setIsPosting(false);
            setErrorMessage(message);
            return;
        }

        router.replace(`/orders/${message}`);
    };

    return (
        <ShopLayout title="Resumen de orden" pageDescription="Resumen de la orden">
            <Typography variant="h5" component="h1" paddingBottom={2} paddingLeft={1}>
                Resumen de la orden
            </Typography>

            <Grid container sx={{ justifyContent: 'center', gap: 3.5 }}>
                <Grid item xs={12} sm={7}>
                    <CartList />
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ textAlign: 'end' }}>
                                Resumen
                                {/* ({numbersOfItems}{' '}{numbersOfItems > 1 ? 'productos' : 'producto'}) */}
                            </Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Typography variant="subtitle1">
                                    Direccion de entrega
                                </Typography>

                                <NextLink href="/checkout/address" passHref>
                                    <Typography fontWeight="400" color="#FBB833">
                                        Editar
                                    </Typography>
                                </NextLink>
                            </Box>

                            <Typography>
                                {firstName} {lastName}
                            </Typography>
                            <Typography>
                                {address} {address2 ? `,${address2}` : ''}
                            </Typography>
                            <Typography>
                                {city}, {zip}
                            </Typography>
                            <Typography>
                                {countries.find((item) => item.code === country)?.name}
                            </Typography>
                            <Typography>{phone}</Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display="flex" justifyContent="end">
                                <NextLink href="/cart" passHref>
                                    <Typography fontWeight="400" color="#FBB833">
                                        Editar
                                    </Typography>
                                </NextLink>
                            </Box>

                            <OrderSummary />

                            <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                                <Button
                                    color="secondary"
                                    className="circular-btn"
                                    fullWidth
                                    onClick={onCreateOrder}
                                    disabled={isPosting}
                                >
                                    Confirmar Orden
                                </Button>

                                <Chip
                                    color="error"
                                    label={errorMessage}
                                    sx={{
                                        display: errorMessage ? 'flex' : 'none',
                                        mt: 1,
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

export default SummaryPage;
