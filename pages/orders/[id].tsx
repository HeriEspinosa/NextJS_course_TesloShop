import { FC } from 'react';
import NextLink from 'next/link';
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import { CartList, OrderSummary } from '@/components/cart';
import { ShopLayout } from '@/components/layouts';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

const OrderPage: FC = () => {
    return (
        <ShopLayout title="Resumen de orden" pageDescription="Resumen de la orden">
            <Typography variant="h1" component="h1" paddingBottom={2}>
                Orden: ABC123
            </Typography>

            {/* <Chip
                sx={{ my: 2 }}
                label="Pendiente de pago"
                variant="outlined"
                color="error"
                icon={<CreditCardOffOutlined />}
            /> */}

            <Chip
                sx={{ my: 2 }}
                label="Esta orden ya fue pagada"
                variant="outlined"
                color="success"
                icon={<CreditScoreOutlined />}
            />

            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CartList />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Card className="summary-card" sx={{ marginLeft: 3 }}>
                        <CardContent>
                            <Typography variant="h2">Resumen (3 productos)</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="subtitle1">
                                    Direccion de entrega
                                </Typography>

                                <NextLink href="/checkout/address" passHref>
                                    <Typography fontWeight="500" color="#FBB833">
                                        Editar
                                    </Typography>
                                </NextLink>
                            </Box>

                            <Typography>Heri Espinosa</Typography>
                            <Typography>21 Alli mismo</Typography>
                            <Typography>San Isidro, Sto. Dom.</Typography>
                            <Typography>Republica Dominicana</Typography>
                            <Typography>+1 809-432-0065</Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display="flex" justifyContent="end">
                                <NextLink href="/cart" passHref>
                                    <Typography fontWeight="500" color="#FBB833">
                                        Editar
                                    </Typography>
                                </NextLink>
                            </Box>

                            <OrderSummary />

                            <Box sx={{ mt: 3 }}>
                                {/* TODO */}
                                <h1>Pagar</h1>
                                <Chip
                                    sx={{ my: 2 }}
                                    label="Esta orden ya fue pagada"
                                    variant="outlined"
                                    color="success"
                                    icon={<CreditScoreOutlined />}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

export default OrderPage;
