import prisma from '../../lib/prismaDB';

export const createUser = (data: any) => {
    return prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            admin: data.admin
        }
    });
}

export const isAdmin = (email: string) => {
    return prisma.user.findFirst({
        where: {
            email: email,
            admin: true
        }
    })
}

export const updateUser = (data: any) => {
    return prisma.user.update({
        where: {
            id: data.id
        },
        data: {
            name: data.name,
            email: data.email
        }
    })
}

export const getAllUsers = () => {
    return prisma.user.findMany({take: 4});
}

export const getUserById = (id: number) => {
    return prisma.user.findUnique({ where: { id: id } });
}

export const getUserByEmail = (email: string) => {
    return prisma.user.findUnique({ where: { email: email } });
}

export const getUserProfile = (id: number) => {
    return prisma.user.findUnique({
        where: {
            id: id
        },
        include: {
            rank: true
        }
    })
}

export const getAllAdmin = () => {
    return prisma.user.findMany({ where: { admin: true } })
}

export const getAdmin = (id: number) => {
    return prisma.user.findUnique({
        where: {
            id: id
        }
    })
}

export const createAdmin = (data: any) => {
    return prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            admin: data.admin
        }
    });
}

export const updateAdmin = (id: number, name: string, email: string, admin: boolean) => {
    return prisma.user.update({
        where: {
            id: id
        },
        data: {
            name: name,
            email: email,
            admin: admin
        }
    })
}

export const deleteAdmin = (id: number) => {
    return prisma.user.delete({ where: { id: id } })
}

export const countUsers = () => {
    return prisma.user.count();
}

export const countAdmin = () => {
    return prisma.user.count({
        where: {
            admin: true
        }
    })
}


