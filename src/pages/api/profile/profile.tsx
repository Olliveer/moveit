import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../util/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const db = await connectToDatabase(process.env.MONGODB_URI);

    const { id, name, email } = req.body;

    const users = db.collection('users');
    const user = await users.findOne({ _id: id });

    await users.updateOne({ _id: id}, {
        $set: {
            name: name,
            email: email,
        }
    })

    return res.status(201).json({ message: `User ${name} updated` });
}