import { ObjectId } from "bson";
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../util/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    const db = await connectToDatabase(process.env.MONGODB_URI);

    switch (method) {
        case 'DELETE':
            const { id } = req.query;

            await db.collection('users').deleteOne({_id: ObjectId(id)});

            res.status(200).json({ message: 'Admin deleted' })
            break;
        case 'POST':
            const { name, email, admin } = req.body;
            const users = db.collection('users');
            const user = await users.findOne({ email: email })

            if (!user) {
                await users.insertOne({
                    name,
                    email,
                    admin
                })
                return res.status(201).json({ message: `Admin ${name} registred` });
            }
            res.status(400).json({ message: 'It seems this e-mail is already in use :(' });
            break;
        default:
            return res.status(405).end(`Method ${method} Not Allowed`);
    }

}


