import { PrismaClient } from ".prisma/client"

const prisma = new PrismaClient();

export const createRank = async (data) => {
    console.log('DATA', data)
    return await prisma.rank.create({ data });
}

export const updateRank = async (userID, level, currentExperience, challengesCompleted, totalExperience) => {
    return await prisma.rank.update({
        where: {
            id: userID
        },
        data: {
            level: Number(level),
            currentExperience: Number(currentExperience),
            challengesCompleted: Number(challengesCompleted),
            totalExperience: Number(totalExperience)
        }
    });
}

export const getRankByid = async (data) => {
    console.log('GET RANK', data)
    return await prisma.rank.findFirst({ where: { userID: data } })
}

// export const getAllRank = () => {
//     return client.query(
//         q.Map(
//             // iterate each item in result
//             q.Paginate(
//                 // make paginatable
//                 q.Match(
//                     // query index
//                     q.Index("get_all_rank") // specify source
//                 )
//             ),
//             q.Lambda((x) => q.Get(x)) // lookup each result by its reference
//         )
//     );
// }