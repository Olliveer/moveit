import React, { useState } from 'react';
import useSWR from 'swr';
import styles from '../styles/components/All.module.css';

interface UserProps {
    createdAt: Date;
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
                            <th>data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersList.map((user: UserProps, index: number) => (
                            <tr key={index}>
                                <td className={styles.UserContainer}>
                                    <img src={user.image || 'user-placeholder.png'} alt="User Image" />
                                    <div>
                                        <p> {user.name ?? user.email}</p>                                        
                                    </div>

                                </td>
                                <td><span>{user.email}</span></td>
                                <td><span>{user.createdAt}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}