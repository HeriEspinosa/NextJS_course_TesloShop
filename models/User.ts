import { IUser } from '@/interfaces';
import mongoose, { Schema, model, Model } from 'mongoose';

const userSchema = new Schema(
    {
        name: { type: String, require: true },
        email: { type: String, require: true, unique: true },
        password: { type: String, require: true },
        role: {
            type: String,
            enum: {
                values: ['admin', 'client', 'SEO'],
                message: '{VALUE} no es un role valido',
                default: 'client',
                required: true,
            },
        },
    },
    {
        timestamps: true,
    }
);

const User: Model<IUser> = mongoose.models.User || model('User', userSchema);

export default User;
