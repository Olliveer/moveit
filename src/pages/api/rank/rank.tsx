import { NextApiRequest, NextApiResponse } from 'next';
import { createRank } from '../../../services/rank';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method } = req;
    switch (method) {
      case 'POST':
        const rank = await createRank(req.body);
        res.status(201).send(rank);
        break;
      case 'GET':
        // const allUsers = await getAllUsers();

        // res.status(200).json(allUsers.data);
        break;
      default:
        res.status(200);
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}