import { NextFetchEvent, NextRequest } from 'next/server';

export async function middleware(req: NextRequest, event: NextFetchEvent) {
    let token;

    if (req.cookies.has('token')) {
        token = req.cookies.get('token');

        console.log(token);

        return new Response('Token: ' + token);
    }
}
