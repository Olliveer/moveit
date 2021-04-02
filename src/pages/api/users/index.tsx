import { NextApiRequest, NextApiResponse } from 'next';
import { createUser, getAllUsers } from '../../../services/users';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method } = req;
    switch (method) {
      case 'POST':
        await createUser(req.body);
        res.status(201).json({ message: 'User created' });
        break;
      case 'GET':
        const allUsers = await getAllUsers();

        res.status(200).json(allUsers);
        break;
      default:
        return res.status(405).end(`Method ${method} Not Allowed`);
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}