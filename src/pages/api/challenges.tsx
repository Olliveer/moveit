import { ObjectId } from "bson";
import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../util/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    const db = await connectToDatabase();

    switch (method) {
        case 'DELETE':
            const { id } = req.query;

            await db.collection('challenges').deleteOne({_id: ObjectId(id)});

           return res.status(200).json({ message: 'Atividade excluída' })            
        case 'POST':
            const { type, description, amount } = req.body;

            const challenges = db.collection('challenges');
            const challenge = await challenges.findOne({ description: description });

            if (!challenge) {
                await challenges.insertOne({
                    type,
                    description,
                    amount,
                    createdAt: new Date(),
                })
                return res.status(201).json({ message: 'Challenge registred' });
            }

            res.status(400).json({ message: 'Parece que a atividade já existe :(' });
            break;
        default:
            return res.status(405).end(`Method ${method} Not Allowed`);
    }

}



