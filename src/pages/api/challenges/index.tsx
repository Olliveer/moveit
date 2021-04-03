import { NextApiRequest, NextApiResponse } from "next";
import {
    createChallenge,
    deleteChallenge,
    getAllchallenges,
    getChallangeByDescription,
    getChallengeById
} from "../../../services/challenges";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;

    switch (method) {
        case 'POST':
            const challenge = await getChallangeByDescription(req.body.description);

            if (challenge) {
                return res.status(400).json({ message: 'Parece que a atividade já existe 🙃' })
            }

            await createChallenge(req.body);
            res.status(200).json({ message: 'Desafio criado 😎' });
            break;
        case 'GET':
            const challenges = await getAllchallenges();
            if (!challenges) res.status(400).json({ message: 'Nada aqui 😞' })
            res.status(200).json(challenges);
            break;
        case 'PUT':
            
            break;
        case 'DELETE':
            const id = req.query.id;

            const challengeDelete = await getChallengeById(Number(id));

            if (!challengeDelete) {
                return res.status(400).json({
                    message: 'Parece que você esta tentando deletar um desafio que não existe mais 😞'
                })
            }

            await deleteChallenge(Number(id))

            res.status(200).json({ message: 'Atividade excluída 😎' })
            break;
        default:
            return res.status(405).end(`Method ${method} Not Allowed`);
    }

}



