import { dbUsers } from '@/database';
import NextAuth, { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';

export const authOptions: AuthOptions = {
    // Configure one or more authentication providers
    providers: [
        Credentials({
            name: 'Custom Login',
            credentials: {
                email: {
                    label: 'Correo',
                    type: 'email',
                    placeholder: 'correo@google.com',
                },
                password: {
                    label: 'Contraseña',
                    type: 'password',
                    placeholder: 'contraseña',
                },
            },

            async authorize(credentials) {
                // validar contra base de datos
                return await dbUsers.checkUserEmailPAssword(
                    credentials!.email,
                    credentials!.password
                );
            },
        }),

        GithubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
        }),

        // ...add more providers here
    ],

    // Custom pages
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register',
    },

    // Callbacks
    jwt: {},

    session: {
        maxAge: 2592000, //30d
        strategy: 'jwt',
        updateAge: 86400, // cada dia
    },

    callbacks: {
        async jwt({ token, account, user }: any) {
            if (account) {
                token.accessToken = account.access_token;

                switch (account.type) {
                    case 'oauth': // cuando se inicia sesion con una red externa
                        token.user = await dbUsers.oAuthToDbUser(user?.email, user?.name);
                        break;

                    case 'credentials':
                        token.user = user;
                        break;
                }
            }

            return token;
        },

        async session({ session, token, user }: any) {
            session.accessToken = token.accessToken;
            session.user = token.user;

            return session;
        },
    },
};

export default NextAuth(authOptions);
