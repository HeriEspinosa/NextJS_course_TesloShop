import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { db } from '@/database';
import { IOrder } from '@/interfaces';
import { Order, Product } from '@/models';
import { roundOutDecimals } from '@/utils';

type Data =
    | {
          status: string;
          message: string;
      }
    | { status: string; result: IOrder };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return createOrder(req, res);

        default:
            return res.status(400).json({ status: 'error', message: 'Bad request' });
    }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { orderItems, total } = req.body as IOrder;

    // Verificar que tengamos un usuario.
    const session: any = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({
            status: 'error',
            message: 'No estas autenticado como un usuario valido',
        });
    }

    const productsIds = orderItems.map((product) => product._id);
    await db.connect();
    const dbProducts = await Product.find({ _id: { $in: productsIds } });

    try {
        const subTotal = orderItems.reduce((prev, current) => {
            const currentPrice = dbProducts.find(
                (prod) => prod.id === current._id
            )?.price;

            if (!currentPrice) {
                throw new Error('Verifique el carrito de nuevo, producto no existe');
            }

            return currentPrice * current.quantity + prev;
        }, 0);

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backendTotal = subTotal * (taxRate + 1);

        if (total !== backendTotal) {
            throw new Error(
                'El total de la orden no cuadra con el monto total de los productos. "Esta orden puede estar siendo manipulada"'
            );
        }

        // Todo bien hasta este punto
        const userId = session.user.id;
        const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
        newOrder.tax = roundOutDecimals(newOrder.tax);
        newOrder.total = roundOutDecimals(newOrder.total);
        await newOrder.save();
        await db.disconnect();

        return res.status(201).json({ status: 'success', result: newOrder });
    } catch (error) {
        await db.disconnect();
        console.log({ error });

        return res
            .status(400)
            .json({ status: 'error', message: 'Revise logs del servidor' });
    }
};
