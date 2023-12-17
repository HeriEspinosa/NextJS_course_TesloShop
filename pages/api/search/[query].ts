import { db } from '@/database';
import { IProduct } from '@/interfaces';
import { Product } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = { status: string; message: string } | { status: string; products: IProduct[] };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return searchProduct(req, res);

        default:
            return res.status(400).json({
                status: 'error',
                message: 'Bad request',
            });
    }
}

async function searchProduct(req: NextApiRequest, res: NextApiResponse<Data>) {
    let { query = '' } = req.query;

    if (query.length === 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Debe especificat el query de busqueda',
        });
    }

    query = query.toString().toLowerCase();

    await db.connect();
    const products = await Product.find({
        $text: { $search: query },
    })
        .select('title images price inStock slug -_id')
        .lean();

    await db.disconnect();

    return res.status(200).json({
        status: 'success',
        products,
    });
}
