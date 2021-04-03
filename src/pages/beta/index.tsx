require('events').EventEmitter.defaultMaxListeners = 15;
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession } from 'next-auth/client';
import React, { useState } from 'react';
import Challenges from '../../components/Challanges';
import DashCards from '../../components/DashCards';
import { Sidebar } from '../../components/Sidebar';
import Users from '../../components/Users';
import UsersList from '../../components/UsersList';
import styles from '../../styles/pages/Index.module.css';
import prisma from '../../../lib/prismaDB';


export default function Dashboard(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [content, setContent] = useState();

    const set = (value) => {
        setContent(value)
    }

    function renderSwitch(params) {
        switch (params) {
            case 'users':
                return <UsersList />;
            case 'admin':
                return <Users />
            case 'challenges':
                return <Challenges />
            default:
                return <UsersList />;
        }
    }

    return (
        <div className={styles.Container}>
            <Sidebar admin={props.admin} />
            <DashCards
                totalUsers={props.totalUsers}
                totalRank={props.totalRank}
                totalChallenges={props.totalChallenges}
                totalAdmins={props.totalAdmins}
                set={set}
            />
            <div className={styles.ContentContainer}>
                {renderSwitch(content)}
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession(ctx);

    if (!session) {
        ctx.res.writeHead(307, { Location: '/' });
        ctx.res.end();
        return { props: {} }
    }

    const totalRank = await prisma.rank.count();
    const totalChallenges = await prisma.challenges.count();
    const totalAdmins = await prisma.user.count({
        where: {
            admin: true
        }
    });
    const totalUsers = await prisma.user.count();
    const admin = await prisma.user.findFirst({
        where: {
            email: session.user.email,
            admin: true
        }
    });

    return {
        props: {
            totalRank: totalRank,
            totalChallenges: totalChallenges,
            totalAdmins: totalAdmins,
            totalUsers: totalUsers,
            admin: admin.admin
        }
    }
}
