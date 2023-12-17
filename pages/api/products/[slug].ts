import { db } from '@/database';
import { Product } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next';
import { IProduct } from '../../../interfaces';

type Data =
    | {
          status: string;
          message: string;
      }
    | { status: string; product: IProduct };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProductBySlug(req, res);

        default:
            return res.status(400).json({
                status: 'error',
                message: 'Bad request',
            });
    }
}
async function getProductBySlug(req: NextApiRequest, res: NextApiResponse<Data>) {
    await db.connect();
    const { slug } = req.query;

    const product = await Product.findOne({ slug }).lean();

    await db.disconnect();

    if (!product) {
        return res.status(404).json({
            status: 'error',
            message: 'Producto no encontrado',
        });
    }

    return res.status(200).json({
        status: 'success',
        product,
    });
}
