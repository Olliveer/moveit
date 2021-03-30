import { NextApiRequest, NextApiResponse } from 'next';
import { createRank, getRankByid, updateRank } from '../../../services/rank';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { method } = req;
        switch (method) {
            case 'POST':
                const rank = await getRankByid(req.body.userId);
                console.log('REQ', req.body)
                if (!rank) {
                    await createRank(req.body);
                    return res.status(201).json({ ok: true })
                }

                await updateRank(
                    rank.id,
                    req.body.level,
                    req.body.currentExperience,
                    req.body.challengesCompleted,
                    req.body.totalExperience
                );

                res.status(201).json({ message: 'rank updated' });
                break;
            case 'GET':
                // const allUsers = await getAllRank();

                // res.status(200).json(allUsers.data);
                break;
            default:
                res.status(200);
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}