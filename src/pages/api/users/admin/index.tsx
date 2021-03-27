import { NextApiRequest, NextApiResponse } from 'next';
import { createAdmin, getAllAdmin } from '../../../../services/users';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method } = req;
    switch (method) {
      case 'POST':
        const { name, email, admin } = req.body;
        await createAdmin({ name, email, admin });
        (admin === true)
          ? res.status(201).json({ message: `Admin ${name} created` })
          : res.status(201).json({ message: `User ${name} created` });
        break;
      case 'GET':
        const allAdmins = await getAllAdmin();

        res.status(200).json(allAdmins);
        break;
      default:
        res.status(200);
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}