import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prismaDB';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { method } = req;
        switch (method) {
            case 'POST':
                const { userID, level, currentExperience, challengesCompleted, totalExperience } = req.body;

                const rank = await prisma.rank.findFirst({
                    where: {
                        userID: userID
                    }
                });
                
                if (!rank) {
                    await prisma.rank.create({
                        data: {
                            userID: userID,
                            level: level,
                            currentExperience: currentExperience,
                            challengesCompleted: challengesCompleted,
                            totalExperience: totalExperience
                        }
                    });
                    return res.status(201).json({ ok: true })
                }

                await prisma.rank.update({
                    where: {
                        id: rank.id
                    },
                    data: {
                        level: Number(level),
                        currentExperience: Number(currentExperience),
                        challengesCompleted: Number(challengesCompleted),
                        totalExperience: Number(totalExperience)
                    }
                })

                res.status(201).json({ message: 'rank updated' });
                break;
            case 'GET':
                await prisma.user.findMany({
                    include: {
                        rank: true
                    }
                });

                res.status(200);
                break;
            case 'PUT':
                await prisma.rank.updateMany({
                    data: {
                        level: 0,
                        currentExperience: 0,
                        challengesCompleted: 0,
                        totalExperience: 0
                    }
                });
                res.status(200);
                break;
            default:
                res.status(200);
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}