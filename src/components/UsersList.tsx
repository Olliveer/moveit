import React, { useState } from 'react';
import useSWR from 'swr';
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

export default function UsersList() {
    const {data: usersList, mutate} = useSWR('api/users');

    if (!usersList) {
        return <h1>Loading</h1>;
    }

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
                        {usersList.map((user: UserProps, index: number) => (
                            <tr key={index}>
                                <td className={styles.UserContainer}>
                                    <img src={user.data.image || 'user-placeholder.png'} alt="User Image" />
                                    <div>
                                        <p> {user.data.name ?? user.data.email}</p>                                        
                                    </div>

                                </td>
                                <td><span>{user.data.email}</span></td>
                                <td><span>{user.data.createdAt}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}