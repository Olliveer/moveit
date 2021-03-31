import { PrismaClient } from ".prisma/client";

const prisma = new PrismaClient();

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

export const getRankByid = async (id: number) => {
    return await prisma.rank.findFirst({ where: { userID: id } })
}

export const getAllRank = async () => {
    return prisma.user.findMany({
        include: {
            rank: true
        }
    })
}