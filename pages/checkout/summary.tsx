import { FC } from 'react';
import NextLink from 'next/link';
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { CartList, OrderSummary } from '@/components/cart';
import { ShopLayout } from '@/components/layouts';

const SummaryPage: FC = () => {
    return (
        <ShopLayout title="Resumen de orden" pageDescription="Resumen de la orden">
            <Typography variant="h1" component="h1" paddingBottom={2}>
                Resumen de la orden
            </Typography>

            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CartList />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
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
                                <Button
                                    color="secondary"
                                    className="circular-btn"
                                    fullWidth
                                >
                                    Confirmar Orden
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

export default SummaryPage;
