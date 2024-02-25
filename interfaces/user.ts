export interface IUser {
    _id: string;
    email: string;
    name: string;
    password?: string;
    role: string;

    createdAt?: string;
    updatedAt?: string;
}

export interface IUserogin {
    email: string;
    name: string;
    role: string;
}

export interface PostAuth {
    token: string;
    user: {
        email: string;
        role: string;
        name: string;
    };
}
