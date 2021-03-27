import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { deleteUser } from '../../../services/users';


export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    console.log('DELETE REQ', req.query.ref)
    switch (method) {
        case 'DELETE':
            await deleteUser(req.query.ref);
            res.json({ message: 'User deleted 🗑️' })
            break;

        default:
            break;
    }


}
