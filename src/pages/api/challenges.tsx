import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const db = await connectToDatabase(process.env.MONGODB_URI);

    const { type, description, amount } = req.body;
    
    const challenges = db.collection('challenges');
    const challenge = await challenges.find({ description: description }).toArray();
   
    if (challenge) {
        await challenges.insertOne({
            type,
            description,
            amount,
            createdAt: new Date(),
        })
        return res.status(201).json({ message: 'Challenge registred' });
    }

    return res.status(400).json({ message: 'It seems this challenge already exists :(' });
}