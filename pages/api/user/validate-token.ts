import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/database';
import { User } from '@/models';
import bcrypt from 'bcryptjs';
import { jwt } from '@/utils';

type Data =
    | {
          status: string;
          message: string;
      }
    | {
          status: string;
          token: string;
          user: { email: string; role: string; name: string };
      };

async function checkJWT(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { token = '' } = req.cookies;

    let userId = '';

    try {
        userId = await jwt.isValidToken(token);
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            status: 'error',
            message: 'Token de autorizacion no es valido',
        });
    }

    await db.connect();
    const user = await User.findById(userId).lean();
    await db.disconnect();

    if (!user) {
        return res.status(400).json({
            status: 'error',
            message: `Mo existe usuario con ese id`,
        });
    }

    const { _id, email, role, name } = user;

    return res.status(200).json({
        status: 'success',
        token: jwt.signToken(_id, email),
        user: {
            email,
            role,
            name,
        },
    });
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return checkJWT(req, res);

        default:
            return res.status(400).json({
                status: 'error',
                message: 'Bad request',
            });
    }
}
