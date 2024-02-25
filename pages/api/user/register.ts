import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/database';
import { User } from '@/models';
import bcrypt from 'bcryptjs';
import { jwt, validations } from '@/utils';

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

async function registerUser(req: NextApiRequest, res: NextApiResponse<Data>) {
    const {
        email = '',
        password = '',
        name = '',
    } = req.body as { email: string; password: string; name: string };

    if (password.length < 6) {
        return res.status(400).json({
            status: 'error',
            message: 'La contraseña debe de ser de 6 o mas caracteres',
        });
    }

    if (name.length < 2) {
        return res.status(400).json({
            status: 'error',
            message: 'El nombre debe de ser de 2 o mas caracteres',
        });
    }

    if (!validations.isValidEmail(email)) {
        return res.status(400).json({
            status: 'error',
            message: 'El correo no es valido',
        });
    }

    await db.connect();
    const user = await User.findOne({ email });

    if (user) {
        return res.status(400).json({
            status: 'error',
            message: 'Este correo ya esta registrado',
        });
    }

    const newUser = new User({
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client',
        name,
    });

    try {
        await newUser.save({ validateBeforeSave: true });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: 'fail',
            message: 'Revisar logs del servidor',
        });
    }

    await db.disconnect();

    const { _id, role } = newUser;

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
            return registerUser(req, res);

        default:
            return res.status(400).json({
                status: 'error',
                message: 'Bad request',
            });
    }
}
