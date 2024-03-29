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

async function loginUser(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { email = '', password = '' } = req.body;

    await db.connect();
    const user = await User.findOne({ email });
    await db.disconnect();

    if (!user) {
        return res.status(400).json({
            status: 'error',
            message: 'Correo o contraseña no validos',
        });
    }

    if (!bcrypt.compareSync(password, user.password!)) {
        return res.status(400).json({
            status: 'error',
            message: 'Correo o contraseña no validos 1',
        });
    }

    const { role, name, _id } = user;

    const token = jwt.signToken(_id, email);

    return res.status(200).json({
        status: 'success',
        token,
        user: {
            email,
            role,
            name,
        },
    });
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return loginUser(req, res);

        default:
            return res.status(400).json({
                status: 'error',
                message: 'Bad request',
            });
    }
}
