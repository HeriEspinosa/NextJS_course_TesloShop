import { GetServerSideProps, NextPage } from 'next';
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import {
    AirplaneTicketOutlined,
    CreditCardOffOutlined,
    CreditScoreOutlined,
} from '@mui/icons-material';

import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';
import { AdminLayout } from '@/components/layouts';
import { CartList, OrderSummary } from '@/components/cart';

interface Props {
    order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
    const { shippingAddress, numbersOfItems, subTotal, tax, total } = order;

    return (
        <AdminLayout
            title="Resumen de orden"
            subTitle={`OrderId: ${order._id}`}
            icon={<AirplaneTicketOutlined />}
        >
            {order.isPaid ? (
                <Chip
                    sx={{ my: 2 }}
                    label="Esta orden ya fue pagada"
                    variant="outlined"
                    color="success"
                    icon={<CreditScoreOutlined />}
                />
            ) : (
                <Chip
                    sx={{ my: 2 }}
                    label="Pendiente de pago"
                    variant="outlined"
                    color="error"
                    icon={<CreditCardOffOutlined />}
                />
            )}

            <Grid container className="fadeIn">
                <Grid item xs={12} sm={7}>
                    <CartList product={order.orderItems} />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Card className="summary-card" sx={{ marginLeft: 3 }}>
                        <CardContent>
                            <Typography variant="h2">
                                Resumen ({order.numbersOfItems}{' '}
                                {order.numbersOfItems > 1 ? 'productos' : 'producto'})
                            </Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="subtitle1">
                                    Direccion de entrega
                                </Typography>
                            </Box>

                            <Typography>
                                {shippingAddress.firstName} {shippingAddress.lastName}
                            </Typography>
                            <Typography>
                                {shippingAddress.address}{' '}
                                {shippingAddress.address2
                                    ? `${shippingAddress.address2}`
                                    : ''}
                            </Typography>
                            <Typography>
                                {shippingAddress.city}, {shippingAddress.zip}
                            </Typography>
                            <Typography>{shippingAddress.country}</Typography>
                            <Typography>{shippingAddress.phone}</Typography>

                            <Divider sx={{ my: 1 }} />

                            <OrderSummary
                                orderValues={{ numbersOfItems, subTotal, tax, total }}
                            />

                            <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                                <Box display="flex" flexDirection="column">
                                    {order.isPaid ? (
                                        <Chip
                                            sx={{ my: 2, flex: 1 }}
                                            label="Esta orden ya fue pagada"
                                            variant="outlined"
                                            color="success"
                                            icon={<CreditScoreOutlined />}
                                        />
                                    ) : (
                                        <Chip
                                            sx={{ my: 2, flex: 1 }}
                                            label="Esta orden no ha sido pagada"
                                            variant="outlined"
                                            color="error"
                                            icon={<CreditCardOffOutlined />}
                                        />
                                    )}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AdminLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const { id = '' } = query;

    const order = await dbOrders.getOrderById(id.toString());

    if (!order) {
        return {
            redirect: {
                destination: '/admin/orders',
                permanent: false,
            },
        };
    }

    return {
        props: {
            order,
        },
    };
};

export default OrderPage;
