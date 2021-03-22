import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession } from 'next-auth/client';
import React, { useState } from 'react'
import DashCards from '../../components/DashCards';
import { Sidebar } from '../../components/Sidebar'
import { connectToDatabase } from '../../util/mongodb';
import styles from '../../styles/pages/Users.module.css';

export default function Users(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [userList, setUseList] = useState(true);
    const [userAdd, setUserAdd] = useState(false);

    function newUser() {
        setUseList(false)
        setUserAdd(true)
    }

    return (
        <div className={styles.Container}>
            <Sidebar admin={props.admin} />
            <h1>Users</h1>
            {userList && (
                <div className={styles.ContentContainer}>
                    <h1>List</h1>
                </div>

            )}
            {userAdd && (
                <div className={styles.ContentContainer}>
                    <h1>Edit</h1>
                </div>
            )}

            <button onClick={newUser}>Add</button>
        </div>
    )
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const db = await connectToDatabase(process.env.MONGODB_URI);

    const session = await getSession(ctx);

    if (!session) {
        ctx.res.writeHead(307, { Location: '/' });
        ctx.res.end();
        return { props: {} }
    }

    const user = await db.collection('users').findOne({ email: session.user.email });
    const totalUsers = await db.collection('users').countDocuments();
    const rank = await db.collection('rank').countDocuments();

    if (!user.admin) {
        ctx.res.writeHead(307, { Location: '/' });
        ctx.res.end();
        return { props: {} }
    }

    return {
        props: {
            admin: user.admin,
            totalUsers: totalUsers,
            rank: rank
        }
    }
}