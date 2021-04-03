import { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../../../lib/prismaDB';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    switch (method) {
        case 'DELETE':
            await prisma.user.delete({ where: { id: Number(req.query.id) } });
            res.json({ message: 'User deleted 🗑️' })
            break;
        case 'GET':
            const admin = await prisma.user.findUnique({
                where: {
                    id: Number(req.query.id)
                }
            })
            res.json(admin)
            break;
        case 'PUT':
            const id = req.query.id;
            const { name, email, isAdmin } = req.body;
            await prisma.user.update({
                where: {
                    id: Number(id)
                },
                data: {
                    name: name,
                    email: email,
                    admin: isAdmin
                }
            })
            res.json({ message: `Admin ${name} updated` })
            break;
        default:
            return res.status(405).end(`Method ${method} Not Allowed`);
    }


}
