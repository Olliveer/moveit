import { NextApiRequest, NextApiResponse } from "next";
import { deleteAdmin, getAdmin, updateAdmin } from "../../../../services/users";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    switch (method) {
        case 'DELETE':
            await deleteAdmin(Number(req.query.id));
            res.json({ message: 'User deleted 🗑️' })
            break;
        case 'GET':
            const admin = await getAdmin(Number(req.query.id))
            res.json(admin)
            break;
        case 'PUT':
            const id = req.query.id;
            const { name, email, isAdmin } = req.body;
            await updateAdmin(Number(id), name, email, isAdmin);

            res.json({ message: `Admin ${name} updated` })
            break;
        default:
            return res.status(405).end(`Method ${method} Not Allowed`);
    }


}
