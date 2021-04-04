import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import swal from 'sweetalert';
import useSWR from 'swr';
import styles from '../styles/components/All.module.css';
import ToastAnimated, { showToast } from './Toast';

interface UserProps {
    createdAt: Date;
    id: number;
    name: string;
    admin: boolean;
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
    const { data: usersList, mutate } = useSWR('api/users');

    if (!usersList) {
        return (
            <div className={styles.Load}>
                <CircularProgress />
            </div>
        );
    }

    function admin(id: number) {
        swal({
            title: "Tem certeza que deseja promover o usuario pra admin?",
            icon: "warning",
            buttons: ['Não', 'Sim'],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    axios.put('api/users/admin', { id })
                        .then(res => showToast({ type: 'success', message: res.data.message }))
                        .finally(() => mutate());
                    swal("Poof! Agora o usuário é admin!", {
                        icon: "success",
                    });
                }
            })
    }

    function deleteUser(id: number) {
        swal({
            title: "Tem certeza que deseja excluír?",
            text: "Depois de excluído, você não será capaz de recuperar!",
            icon: "warning",
            buttons: ['Não', 'Sim'],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    axios.delete('api/users/admin/' + id)
                        .then(res => showToast({ type: 'success', message: res.data.message }))
                        .finally(() => mutate());
                    console.log('fel', id, admin)
                    swal("Poof! O usuário foi deletado!", {
                        icon: "success",
                    });
                }
            })
    }

    return (
        <div className={styles.Container}>
            <ToastAnimated />
            <h1>Usuários</h1>
            <div className={styles.TableContainer}>
                <table>
                    <thead>
                        <tr>
                            <th>Usuário</th>
                            <th>Email</th>
                            <th>AÇÕES</th>
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
                                <td>
                                    <div className={styles.ButtonsContainer}>
                                        <button onClick={() => deleteUser(user.id)}>Excluir</button>
                                        {user.admin ? (
                                            <button onClick={() => admin(user.id)}>user?</button>
                                        ) : (
                                            <button onClick={() => admin(user.id)}>admin?</button>
                                        )}
                                    </div>
                                </td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}