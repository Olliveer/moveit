import { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../../lib/prismaDB';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { id, name } = req.body;
    const user = await prisma.user.findUnique({ where: { id: id } });

    if (!user) {
        return res.status(201).json({ message: 'Não foi possível atualizar, tente mais tarde' });
    }

    await prisma.user.update({
        where: {
            id: id
        },
        data: {
            name: name,
        }
    });

    return res.status(201).json({ message: `Usuário ${name} atualizado` });
}