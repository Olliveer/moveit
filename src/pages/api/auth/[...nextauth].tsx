import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const options = {
    // Configure one or more authentication providers
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
        Providers.GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        Providers.Twitter({
            clientId: process.env.TWITTER_ID,
            clientSecret: process.env.TWITTER_SECRET
        }),
    ],
    session: {
        jwt: true,
        maxAge: 2 * 60 * 60 * 60,
    },
    database: process.env.DATABASE_URL,
    callbacks: {
        signIn: async (profile, account, metadata) => {
            console.info('we are here to see the callback\nP\nP');
            console.log(profile, 'is the profile');
            console.log(account, 'is the account');
            console.log(metadata, 'is the metadata');
            const res = await fetch('https://api.github.com/user/emails', {
                headers: {
                    'Authorization': `token ${account.accessToken}`
                }
            })
            const emails = await res.json()
            if (!emails || emails.length === 0) {
                return
            }
            const sortedEmails = emails.sort((a, b) => b.primary - a.primary)
            profile.email = sortedEmails[0].email
        },
    },

};

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> =>
    NextAuth(req, res, options);


