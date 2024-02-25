import { CartContext } from '@/context';
import { currency } from '@/utils';
import { Grid, Typography } from '@mui/material';
import { FC, useContext } from 'react';

interface Props {
    orderValues?: {
        numbersOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
    };
}

export const OrderSummary: FC<Props> = ({ orderValues }) => {
    const cartValues = useContext(CartContext);

    const { numbersOfItems, subTotal, tax, total } = orderValues
        ? orderValues
        : cartValues;

    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography>No. Productos</Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="end">
                <Typography>
                    {numbersOfItems} {numbersOfItems > 1 ? 'productos' : 'producto'}
                </Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Subtotal</Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="end">
                <Typography>{currency.format(subTotal)}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>
                    ITBIS ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)
                </Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="end">
                <Typography>{currency.format(tax)}</Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Total:</Typography>
            </Grid>
            <Grid item xs={6} sx={{ mt: 2 }} display="flex" justifyContent="end">
                <Typography variant="subtitle1">{currency.format(total)}</Typography>
            </Grid>
        </Grid>
    );
};
