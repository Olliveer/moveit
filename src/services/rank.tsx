import { client, q } from "../util/faunaDb";

export const createRank = async (data) => {
    return await client.query(q.Create(q.Collection('rank'), { data }))
}

export const updateRank = async (userId, level, currentExperience, challengesCompleted, totalExperience) => {
    return await client.query(q.Update(q.Ref(q.Collection('rank'), userId.id), {
        data: {
            level: Number(level),
            currentExperience: Number(currentExperience),
            challengesCompleted: Number(challengesCompleted),
            totalExperience: Number(totalExperience)
        }
    }))
}