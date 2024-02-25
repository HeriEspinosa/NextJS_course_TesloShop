import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import {
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Typography,
} from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { OrderResponseBody } from '@paypal/paypal-js';

import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';
import { ShopLayout } from '@/components/layouts';
import { CartList, OrderSummary } from '@/components/cart';
import { tesloApi } from '@/api';

interface Props {
    order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
    const [isPaying, setIsPaying] = useState(false);

    const { shippingAddress, numbersOfItems, subTotal, tax, total } = order;
    const router = useRouter();

    const onOrderComplete = async (details: OrderResponseBody) => {
        if (details.status !== 'COMPLETED') {
            return alert('No hay pago en Paypal');
        }

        setIsPaying(true);
        try {
            const { data } = await tesloApi.post(`/orders/pay`, {
                transactionId: details.id,
                orderId: order._id,
            });

            router.reload();
        } catch (error) {
            setIsPaying(false);
            console.log({ error });
            alert('Error');
        }
    };

    return (
        <ShopLayout title="Resumen de orden" pageDescription="Resumen de la orden">
            <Typography variant="h1" component="h1" paddingBottom={2}>
                Orden: {order._id}
            </Typography>

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
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    className="fadeIn"
                                    sx={{ display: isPaying ? 'flex' : 'none' }}
                                >
                                    <CircularProgress />
                                </Box>

                                <Box
                                    flexDirection="column"
                                    sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }}
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
                                        <PayPalButtons
                                            createOrder={(data, actions) => {
                                                return actions.order.create({
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                value: `${total}`,
                                                            },
                                                        },
                                                    ],
                                                });
                                            }}
                                            onApprove={(data, actions) => {
                                                return actions
                                                    .order!.capture()
                                                    .then((details) => {
                                                        onOrderComplete(details);
                                                        // const name =
                                                        //     details.payer.name?.given_name;
                                                    });
                                            }}
                                        />
                                    )}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const { id = '' } = query;
    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${id}`,
                permanent: false,
            },
        };
    }

    const order = await dbOrders.getOrderById(id.toString());

    if (!order) {
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false,
            },
        };
    }

    if (order.user !== session.user.id) {
        return {
            redirect: {
                destination: '/orders/history',
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

// function createOrder() {
//     return fetch("/my-server/create-paypal-order", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         // use the "body" param to optionally pass additional order information
//         // like product ids and quantities
//         body: JSON.stringify({
//             cart: [
//                 {
//                     id: "YOUR_PRODUCT_ID",
//                     quantity: "YOUR_PRODUCT_QUANTITY",
//                 },
//             ],
//         }),
//     })
//         .then((response) => response.json())
//         .then((order) => order.id);
// }
// function onApprove(data) {
//       return fetch("/my-server/capture-paypal-order", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           orderID: data.orderID
//         })
//       })
//       .then((response) => response.json())
//       .then((orderData) => {
//             const name = orderData.payer.name.given_name;
//             alert(`Transaction completed by ${name}`);
//       });

// }
