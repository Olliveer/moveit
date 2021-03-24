import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../util/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const db = await connectToDatabase(process.env.MONGODB_URI);

    const { id, name, email } = req.body;

    const users = db.collection('users');
    const user = await users.findOne({ _id: ObjectId(id) })

    console.log(user)

    if (!user) {
        return res.status(201).json({ message: 'Not possible to update, try again later' });
    }

    await users.updateOne({ _id: user._id }, {
        $set: {
            name: name,
            email: email,
        }
    })

    return res.status(201).json({ message: `User ${name} updated` });
}