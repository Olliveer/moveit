import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../lib/prismaDB';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method } = req;

    switch (method) {
      case 'POST':
        const { name, email, admin } = req.body;
        await prisma.user.create({
          data: { name, email, admin }
        });

        (admin === true)
          ? res.status(201).json({ message: `Admin ${name} created` })
          : res.status(201).json({ message: `User ${name} created` });
        break;
      case 'GET':
        const admins = await prisma.user.findMany({ where: { admin: true } });

        res.status(200).json(admins);
        break;
      case 'PUT':
        const id = req.body;
        const user = await prisma.user.findUnique({ where: { id: id.id } });

        if (user.admin) {
          await prisma.user.update({
            where: {
              id: id.id
            },
            data: {
              admin: false
            }
          })
          return res.status(200).json({ message: `Usuário ${user.name} agora é admin 😎` });
        }
        await prisma.user.update({
          where: {
            id: user.id
          },
          data: {
            admin: true
          }
        });

        res.status(200).json({ message: `Usuário ${user.name} não é mais admin 😎` });
        break;
      default:
        return res.status(405).end(`Method ${method} Not Allowed`);
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}