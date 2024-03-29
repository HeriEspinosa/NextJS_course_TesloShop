import type { NextApiRequest, NextApiResponse } from 'next';
import { db, seedDataBase } from '@/database';
import { Order, Product, User } from '@/models';

type Data = {
    message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (process.env.NODE_ENV === 'production') {
        return res.status(401).json({ message: 'No tiene acceso a este API.' });
    }

    await db.connect();

    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    await User.insertMany(seedDataBase.initialData.users);
    await Product.insertMany(seedDataBase.initialData.products);

    await db.disconnect();

    res.status(200).json({ message: 'Proceso realizado correctamente' });
}
