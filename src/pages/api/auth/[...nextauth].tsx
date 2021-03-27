import faunadb from 'faunadb';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import FaunaAdapter from '../../../util/nextauth/fauna-adapter';

const options = {
    providers: [
        Providers.Email({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: 465,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD
                }
            },
            from: process.env.EMAIL_FROM,
        }),
        Providers.Facebook({
            clientId: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_SECRET
        }),
        // Providers.GitHub({
        //     clientId: process.env.GITHUB_ID,
        //     clientSecret: process.env.GITHUB_SECRET,
        //     scope: 'user:email',
        //     // @ts-ignore
        //     profile: (profileData) => {
        //         return {
        //             id: profileData.id,
        //             name: profileData.name || profileData.login,
        //             email: profileData.email,
        //             image: profileData.avatar_url,
        //             username: profileData.login,
        //         }
        //     },
        // }),
        Providers.Twitter({
            clientId: process.env.TWITTER_ID,
            clientSecret: process.env.TWITTER_SECRET
        }),
    ],
    adapter: FaunaAdapter.Adapter(null, {}),
    // secret: process.env.SECRET_KEY,
    session: {
        jwt: true,
        maxAge: 2 * 60 * 60 * 60,
        updateAge: 12 * 60 * 60,
        encryption: true,
        secret: process.env.SECRET_KEY,
    },
    debug: false,
    // database: process.env.MONGODB_URI,
    pages: {
        error: '/index',
        newUser: null,
    }

}

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options);


