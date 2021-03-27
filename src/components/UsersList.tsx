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