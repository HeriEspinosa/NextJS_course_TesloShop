import { db } from '@/database';
import { Order, Product, User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data =
    | {
          status: string;
          numberOfOrders: number;
          paidOrders: number;
          notPaidOrders: number;
          numberOfClients: number; //role: client
          numberOfProducts: number;
          productsWithNoInventory: number; // 0
          lowInventory: number; // Productos igual o menor a diez
      }
    | { status: string; message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    await db.connect();

    {
        // Forma 1:
        // const numberOfOrders = await Order.find().count();
        // const paidOrders = await Order.find({ isPaid: true }).count();
        // const notPaidOrders = numberOfOrders - paidOrders;
        // const numberOfClients = await User.find({ role: 'client' }).count();
        // const numberOfProducts = await Product.find().count();
        // const productsWithNoInventory = await Product.find({ inStock: 0 }).count();
        // const lowInventory = await Product.find({ inStock: { $lte: 10 } }).count();
        // --------------------------------
        // Mi Forma:
        // const orders = await Order.find({}).lean();
        // const customer = await User.find({ role: 'client' }).count;
        // const products = await Product.find({}).lean();
        // if (!orders)
        //     return res.status(400).json({
        //         status: 'error',
        //         message: 'Ops!, An error occurred with the search for the orders ',
        //     });
        // if (!customer)
        //     return res.status(400).json({
        //         status: 'error',
        //         message: 'Ops!, An error occurred with the search for the customers ',
        //     });
        // if (!products)
        //     return res.status(400).json({
        //         status: 'error',
        //         message: 'Ops!, An error occurred with the search for the products ',
        //     });
        // // Orders
        // const ordersPaid = orders.filter((ord) => ord.isPaid === true);
        // const ordersNotPaid = orders - ordersPaid.length;
        // // Products
        // const productsWithNoInv = products.filter((prod) => prod.inStock === 0);
        // const productsLowInv = products.filter((prod) => prod.inStock <= 10);
    }
    // --------------------------------

    // Forma 2:
    try {
        const [
            numberOfOrders,
            paidOrders,
            numberOfClients,
            numberOfProducts,
            productsWithNoInventory,
            lowInventory,
        ] = await Promise.all([
            Order.find().count(),
            Order.find({ isPaid: true }).count(),
            User.find({ role: 'client' }).count(),
            Product.find().count(),
            Product.find({ inStock: 0 }).count(),
            Product.find({ inStock: { $lte: 10 } }).count(),
        ]);

        const notPaidOrders = numberOfOrders - paidOrders;

        await db.disconnect();

        return res.status(200).json({
            status: 'success',
            numberOfOrders: numberOfOrders,
            paidOrders: paidOrders,
            notPaidOrders: notPaidOrders,
            numberOfClients: numberOfClients,
            numberOfProducts: numberOfProducts,
            productsWithNoInventory: productsWithNoInventory,
            lowInventory: lowInventory,
        });
    } catch (error) {
        await db.disconnect();
        console.log(
            'Ops!, An error occurred with the search for the orders, products and customers'
        );
    }
}
