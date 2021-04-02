import { NextApiRequest, NextApiResponse } from "next";
import { getChallengeById, updateChallenge } from "../../../services/challenges";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;
    switch (method) {
        case 'DELETE':
            res.json({ message: 'User deleted 🗑️' })
            break;
        case 'GET':
            const challengData = await getChallengeById(Number(req.query.id));

            if (!challengData) {
                return res.status(400).json({ message: 'Opss... challange não encontrada 😅' });
            }

            res.json(challengData);
            break;
        case 'PUT':
            const id = req.query.id;
            const { type, description, amount } = req.body;
            
            await updateChallenge(Number(id),  type, description, Number(amount));

            res.json({ message: 'Desafio atualizado 😎' })
            break;
        default:
            return res.status(405).end(`Method ${method} Not Allowed`);
    }


}


