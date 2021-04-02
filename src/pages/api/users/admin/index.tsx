import { NextApiRequest, NextApiResponse } from 'next';
import { createAdmin, getAllAdmin, updateAdmin } from '../../../../services/users';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method } = req;

    switch (method) {
      case 'POST':
        const { name, email, admin, createdAt } = req.body;
        await createAdmin({ name, email, admin, createdAt });
        (admin === true)
          ? res.status(201).json({ message: `Admin ${name} created` })
          : res.status(201).json({ message: `User ${name} created` });
        break;
      case 'GET':
        const allAdmins = await getAllAdmin();

        res.status(200).json(allAdmins);
        break;
      case 'PUT':
        
      default:
        return res.status(405).end(`Method ${method} Not Allowed`);
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}