import { User } from '@/models';
import { db } from '.';
import bcrypt from 'bcryptjs';

export const checkUserEmailPAssword = async (email: string, password: string) => {
    await db.connect();
    const user = await User.findOne({ email });
    await db.disconnect();

    if (!user) return null;

    if (!bcrypt.compareSync(password, user.password!)) return null;

    const { _id, name, role } = user;
    return {
        id: _id,
        email: email.toLocaleLowerCase(),
        name,
        role,
    };
};

// Esta funcion crea o verifica el usuario de OAuth
export const oAuthToDbUser = async (oAuthEmail: string, oAuthName: string) => {
    await db.connect();
    const user = await User.findOne({ email: oAuthEmail });

    if (user) {
        await db.disconnect();
        const { _id, name, email, role } = user;
        return {
            id: _id,
            name,
            email: email.toLocaleLowerCase(),
            role,
        };
    }

    const newUser = new User({
        email: oAuthEmail,
        name: oAuthName,
        password: '@',
        role: 'client',
    });
    await newUser.save();

    await db.disconnect();

    const { _id, name, email, role } = newUser;
    return {
        id: _id,
        name,
        email: email.toLocaleLowerCase(),
        role,
    };
};
