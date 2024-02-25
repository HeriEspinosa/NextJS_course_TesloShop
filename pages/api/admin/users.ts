import { db } from '@/database';
import { User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next';
import { IUser } from '../../../interfaces/user';
import { isValidObjectId } from 'mongoose';

type Data = { message: string; status: string } | { status: string; users: IUser[] };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getUsers(req, res);

        case 'PUT':
            return updateUsers(req, res);

        default:
            return res.status(200).json({ message: 'Example', status: 'success' });
    }
}
const getUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect();
    const users = await User.find().select('-password').lean();
    await db.disconnect();

    return res.status(200).json({
        status: 'success',
        users: users,
    });
};

const updateUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { userId = '', role = '' } = req.body;

    if (!isValidObjectId(userId)) {
        return res.status(404).json({
            status: 'error',
            message: `There is no user with this id: ${userId}`,
        });
    }

    const validRoles = ['admin', 'client', 'SEO'];

    if (!validRoles.includes(role)) {
        return res.status(404).json({
            status: 'error',
            message: `Rol not allowed. Allowed roles: ${validRoles.join(', ')}`,
        });
    }

    await db.connect();
    const user = await User.findById(userId);

    if (!user) {
        await db.disconnect();

        return res.status(404).json({
            status: 'error',
            message: `User not found`,
        });
    }

    user.role = role;
    await user.save();
    await db.disconnect();

    return res.status(200).json({
        status: 'success',
        message: 'Updated user',
    });
};
