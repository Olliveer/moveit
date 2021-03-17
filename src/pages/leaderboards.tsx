import { GetStaticProps, InferGetServerSidePropsType } from "next";
import { Sidebar } from "../components/Sidebar";
import styles from '../styles/pages/leaderbords.module.css';
import { connectToDatabase } from "../util/mongodb";

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

export default function Leaderboards({ leaderboards }: InferGetServerSidePropsType<typeof getStaticProps>) {
    return (
        <div className={styles.Container}>
            <Sidebar />
            <h1>Leaderboard</h1>

            <div className={styles.TableContainer}>
                <table>
                    <thead>
                        <tr>
                            <th>posição</th>
                            <th>usuário</th>
                            <th>desafios</th>
                            <th>experiência</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboards.map((user: UserProps, index: number) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td className={styles.UserContainer}>
                                    <img src={user.image || 'user-placeholder.png'} alt="User Image" />
                                    <div>
                                        <p> {user.name ?? user.email}</p>
                                        <p> <img src="/icons/level.svg" alt="Level" /> Level {user.position.level}</p>
                                    </div>

                                </td>
                                <td><span>{user.position.challengesCompleted}</span> completados</td>
                                <td><span>{user.position.totalExperience}</span> xp</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    const db = await connectToDatabase(process.env.MONGODB_URI);

    const inner = await db.collection('users').aggregate(
        [
            {
                $lookup: {
                    from: 'rank',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'position',
                }
            },
            {
                $unwind: '$position'
            }
        ]
    ).sort({ currentExperience: -1 }).limit(100).toArray();

    const data = JSON.parse(JSON.stringify(inner));

    return {
        props: {
            leaderboards: data
        }
    }
}