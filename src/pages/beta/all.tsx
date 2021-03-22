import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getSession } from 'next-auth/client'
import React, { useState } from 'react'
import DashCards from '../../components/DashCards'
import { Sidebar } from '../../components/Sidebar'
import styles from '../../styles/pages/Dashboard.module.css'
import { connectToDatabase } from '../../util/mongodb'


export default function All(props: InferGetServerSidePropsType<typeof getServerSideProps>) {

    return (
        <div className={styles.Container}>
            <Sidebar admin={props.admin} />
            <h1>Lista de Usuários</h1>
            <div className={styles.ContentContainer}>
                <h1>LISTA DE USERS</h1>
            </div>
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
