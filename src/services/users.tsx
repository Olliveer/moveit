import { PrismaClient } from ".prisma/client"

const prisma = new PrismaClient();

// export const createUser = (data) => {
//     console.log('Adataaaaaa', data);
//     return client.query(q.Create(q.Collection('users'), { data }))
// }

export const isAdmin = (id: number) => {
    return prisma.user.findFirst({
        where: {
            id: id,
            admin: true
        }
    })
}


// UPDATE
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



// export const getAllAdmin = () => {
//     return client.query(
//         q.Map(
//             // iterate each item in result
//             q.Paginate(
//                 // make paginatable
//                 q.Match(
//                     // query index
//                     q.Index("get_all_admin"), true // specify source
//                 )
//             ),
//             q.Lambda('admin', q.Get(q.Var('admin'))) // lookup each result by its reference
//         )
//     );
// }

// export const createAdmin = (data) => {
//     return client.query(q.Create(q.Collection('users'), { data }))
// }




