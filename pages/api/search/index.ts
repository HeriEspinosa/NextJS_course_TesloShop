import type { NextApiRequest, NextApiResponse } from 'next';

type Data = { status: string; message: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    return res.status(404).json({
        status: 'error',
        message: 'Debes especificar el query de busqueda',
    });
}
