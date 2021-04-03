import prisma from '../../lib/prismaDB';

export const createChallenge = (data: any) => {
    return prisma.challenges.create({
        data: {
            type: data.type,
            description: data.description,
            amount: Number(data.amount)
        }
    });
}

export const getChallengeById = (id: number) => {
    return prisma.challenges.findUnique({
        where: {
            id: id
        }
    })
}

export const updateChallenge = (id: number, type: string, description: string, amount: number) => {
    return prisma.challenges.update({
        where: {
            id: id
        },
        data: {
            type: type,
            description: description,
            amount: amount
        }
    })
}

export const deleteChallenge = (id: number) => {
    return prisma.challenges.delete({
        where: {
            id: id
        }
    });
}

export const getChallangeByDescription = (data: string) => {
    return prisma.challenges.findFirst({
        where: {
            description: data
        }
    })
}

export const getAllchallenges = () => {
    return prisma.challenges.findMany({
        take: 4
    });
}

export const countChallenges = () => {
    return prisma.challenges.count();
}
