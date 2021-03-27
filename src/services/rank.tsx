import { client, q } from "../util/faunaDb"

interface dataRank {
    name: string;
    email: string;
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    totalExperience: number;
    userId: string;
}

export const createRank = async (data: dataRank) => {
    const user = await client.query(q.Get(q.Match(q.Index('get_user_by_email'), [data.email])));
    // const rank = await client.query(q.Get(q.Match(q.Index('get_rank_by_id'), [user.data.id])));

    console.log('GET RANK USER ->', user)
    if (!user) {
        return client.query(q.Create(q.Collection('rank'), { data, userId: user.data.id }))
    }

}