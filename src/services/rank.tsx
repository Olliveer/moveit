import prisma from '../../lib/prismaDB';

export const createRank = async (data: any) => {
    return await prisma.rank.create({ data });
}

export const updateRank = async (
    userID: number,
    level: number,
    currentExperience: number,
    challengesCompleted: number,
    totalExperience: number
) => {
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

export const resetRank = () => {
    return prisma.rank.updateMany({
        data: {
            level: 0,
            currentExperience: 0,
            challengesCompleted: 0,
            totalExperience: 0
        }
    })
}

export const getRankByid = async (id: number) => {
    return await prisma.rank.findFirst({ where: { userID: id } })
}

export const getAllRank = async () => {
    return await prisma.user.findMany({
        include: {
            rank: true
        }
    })
}

export const countRank = async () => {
    return await prisma.rank.count();
}