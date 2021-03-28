import { NextApiRequest, NextApiResponse } from 'next';
import { createRank, updateRank } from '../../../services/rank';
import { client, q } from '../../../util/faunaDb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { method } = req;
    switch (method) {
      case 'POST':
        const rank = await client.query(q.Get(q.Match(q.Index('get_rank_by_id'), [req.body.userId])));
        if (!rank) {
          await createRank(req.body);
          return res.status(201).json({ ok: true })
        }
        await updateRank(
          rank.ref,
          req.body.level,
          req.body.currentExperience,
          req.body.challengesCompleted,
          req.body.totalExperience
        );
        res.status(201).json({ message: 'rank updated' });
        break;
      case 'GET':
        // const allUsers = await getAllUsers();

        // res.status(200).json(allUsers.data);
        break;
      default:
        res.status(200);
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}