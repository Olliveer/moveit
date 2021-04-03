import { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../../lib/prismaDB';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    switch (method) {
        case 'DELETE':
            break;
        case 'GET':
            const challengData = await prisma.challenges.findUnique({
                where: {
                    id: Number(req.query.id)
                }
            });

            if (!challengData) {
                return res.status(400).json({ message: 'Opss... challenge não encontrada 😅' });
            }

            res.json(challengData);
            break;
        case 'PUT':
            const id = req.query.id;
            const { type, description, amount } = req.body;

            await prisma.challenges.update({
                where: {
                    id: Number(id)
                },
                data: {
                    type: type,
                    description: description,
                    amount: Number(amount)
                }
            })

            res.json({ message: 'Desafio atualizado 😎' })
            break;
        default:
            return res.status(405).end(`Method ${method} Not Allowed`);
    }


}


