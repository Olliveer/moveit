import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../util/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const db = await connectToDatabase(process.env.MONGODB_URI);

    const { name, email, level, currentExperience, challengesCompleted, totalExperience } = req.body;

    const users = db.collection('users');
    const user = await users.findOne({ email: email, name: name });
    const rank = db.collection('rank');
    const userRank = await rank.findOne({ user_id: user._id });

    if (!userRank) {
        await rank.insertOne({
            level,
            currentExperience,
            challengesCompleted,
            totalExperience,
            user_id: ObjectId(`${user._id}`),
            createdAt: new Date(),
        })
        return res.status(201).json({ ok: true });
    }

    await rank.updateOne({ user_id: user._id }, {
        $set: {
            level: level,
            currentExperience: currentExperience,
            challengesCompleted: challengesCompleted,
            totalExperience: totalExperience,
        }
    })

    return res.status(201).json({ message: 'Rank updated' });
}