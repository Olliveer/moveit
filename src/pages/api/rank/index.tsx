import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../util/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    const db = await connectToDatabase(process.env.MONGODB_URI);

    switch (method) {
        case 'POST':
            const { name, email, level, currentExperience, challengesCompleted, totalExperience } = req.body;

            const users = db.collection('users');
            const user = await users.findOne({ email: email });
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
        case 'PUT':
            const rankR = db.collection('rank');
            const reset = await rankR.find().toArray();
            
            if (reset) {
                await rankR.updateMany({}, {
                    $set: {
                        level: 0,
                        currentExperience: 0,
                        challengesCompleted: 0,
                        totalExperience: 0
                    }
                })
            }

            return res.status(201).json({ message: 'Rank reseted' });
        default:
            return res.status(405).end(`Method ${method} Not Allowed`);
    }

}