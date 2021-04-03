import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prismaDB';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method } = req;
    switch (method) {
      case 'POST':
        await prisma.user.create({
          data: {
            name: req.body.name,
            email: req.body.email,
            admin: req.body.admin
          }
        });
        res.status(201).json({ message: 'User created' });
        break;
      case 'GET':
        const users = await prisma.user.findMany({ take: 4 });

        res.status(200).json(users);
        break;
      default:
        return res.status(405).end(`Method ${method} Not Allowed`);
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}