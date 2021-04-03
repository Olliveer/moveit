import { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../../lib/prismaDB';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;

    switch (method) {
        case 'POST':
            const challenge = await prisma.challenges.findFirst({
                where: {
                    description: req.body.description
                }
            })

            if (challenge) {
                return res.status(400).json({ message: 'Parece que a atividade já existe 🙃' })
            }

            await prisma.challenges.create({
                data: {
                    type: req.body.type,
                    description: req.body.description,
                    amount: Number(req.body.amount)
                }
            });
            res.status(200).json({ message: 'Desafio criado 😎' });
            break;
        case 'GET':
            const challenges = await prisma.challenges.findMany({
                take: 4
            });
            if (!challenges) res.status(400).json({ message: 'Nada aqui 😞' })
            res.status(200).json(challenges);
            break;
        case 'PUT':

            break;
        case 'DELETE':
            const id = req.query.id;

            const challengeDelete = await prisma.challenges.findUnique({
                where: {
                    id: Number(id)
                }
            });

            if (!challengeDelete) {
                return res.status(400).json({
                    message: 'Parece que você esta tentando deletar um desafio que não existe mais 😞'
                })
            }

            await prisma.challenges.delete({
                where: {
                    id: Number(id)
                }
            })

            res.status(200).json({ message: 'Atividade excluída 😎' })
            break;
        default:
            return res.status(405).end(`Method ${method} Not Allowed`);
    }

}



