import { GetStaticProps, InferGetStaticPropsType } from "next";
import useSWR from "swr";
import { Sidebar } from "../components/Sidebar";
import { getAllRank } from "../services/rank";
import styles from '../styles/pages/leaderbords.module.css';

interface UserProps {
    _id: string;
    name: string;
    email: string;
    image: string;
    rank: {
        level: number;
        challengesCompleted: number;
        currentExperience: number;
        totalExperience: number;
    }
}

export default function Leaderboards({ leaderboards }: InferGetStaticPropsType<typeof getStaticProps>) {
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
                                        <p> <img src="/icons/level.svg" alt="Level" /> Level {user.rank.level}</p>
                                    </div>

                                </td>
                                <td><span>{user.rank.challengesCompleted}</span> completados</td>
                                <td><span>{user.rank.totalExperience}</span> xp</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {

    const leads = await getAllRank();

    return {
        props: {
            leaderboards: JSON.parse(JSON.stringify(leads))
        }
    }
}