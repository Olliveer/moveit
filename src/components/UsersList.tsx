import React from 'react';
import styles from '../styles/components/All.module.css';

interface UserProps {
    _id: string;
    name: string;
    email: string;
    image: string;
    position: {
        level: number;
        challengesCompleted: number;
        currentExperience: number;
        totalExperience: number;
    }
}

export default function UsersList({users}) {
    return (
        <div className={styles.Container}>
            <h1>Usuários</h1>
            <div className={styles.TableContainer}>
                <table>
                    <thead>
                        <tr>
                            <th>Usuário</th>
                            <th>Email</th>
                            <th>desafios</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: UserProps, index: number) => (
                            <tr key={user._id}>
                                <td className={styles.UserContainer}>
                                    <img src={user.image || 'user-placeholder.png'} alt="User Image" />
                                    <div>
                                        <p> {user.name ?? user.email}</p>
                                        <p> <img src="/icons/level.svg" alt="Level" /> Level {user.position.level}</p>
                                    </div>

                                </td>
                                <td><span>{user.email}</span></td>
                                <td><span>{user.position.challengesCompleted}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//     const db = await connectToDatabase(process.env.MONGODB_URI);

//     const session = await getSession(ctx);

//     if (!session) {
//         ctx.res.writeHead(307, { Location: '/' });
//         ctx.res.end();
//         return { props: {} }
//     }

//     const user = await db.collection('users').findOne({ email: session.user.email });
//     const totalUsers = await db.collection('users').countDocuments();
//     const rank = await db.collection('rank').countDocuments();

//     if (!user.admin) {
//         ctx.res.writeHead(307, { Location: '/' });
//         ctx.res.end();
//         return { props: {} }
//     }

//     const inner = await db.collection('users').aggregate(
//         [
//             {
//                 $lookup: {
//                     from: 'rank',
//                     localField: '_id',
//                     foreignField: 'user_id',
//                     as: 'position',
//                 }
//             },
//             {
//                 $unwind: '$position'
//             }
//         ]
//     ).sort({ createdAt: -1 }).limit(100).toArray();

//     const list = JSON.parse(JSON.stringify(inner));

//     console.log(list)

//     return {
//         props: {
//             admin: user.admin,
//             totalUsers: totalUsers,
//             users: list,
//             rank: rank
//         }
//     }
// }
