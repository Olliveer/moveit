import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getSession } from 'next-auth/client'
import React, { useState } from 'react'
import DashCards from '../../components/DashCards'
import { Sidebar } from '../../components/Sidebar'
import styles from '../../styles/pages/Index.module.css'
import { connectToDatabase } from '../../util/mongodb'
import UsersList from '../../components/UsersList';
import Users from '../../components/Users'
import Challenges from '../../components/Challanges'


export default function Dashboard(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [content, setContent] = useState();

    const set = (value) => {
        setContent(value)
    }

    function renderSwitch(params) {
        switch (params) {
            case 'users':
                return <UsersList users={props.users} />;
            case 'admin':
                return <Users admins={props.admins} />
            case 'challenges':
                return <Challenges challenges={props.challenges} />
            default:
                return <UsersList users={props.users} />;
        }
    }

    return (
        <div className={styles.Container}>
            <Sidebar admin={props.admin} />
            <DashCards 
            totalUsers={props.totalUsers}
            totalRank={props.totalRank}
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
    const db = await connectToDatabase(process.env.MONGODB_URI);

    const session = await getSession(ctx);

    if (!session) {
        ctx.res.writeHead(307, { Location: '/' });
        ctx.res.end();
        return { props: {} }
    }

    const user = await db.collection('users').findOne({ email: session.user.email });
    const totalUsers = await db.collection('users').countDocuments();

    const admins = await db.collection('users').find({ admin: true }).toArray();
    const adminData = JSON.parse(JSON.stringify(admins));
    const totalAdmins = await db.collection('users').find({ admin: true }).count();

    const totalRank = await db.collection('rank').countDocuments();
    
    
    const challenges = await db.collection('challenges').find().toArray();
    const challengesData = JSON.parse(JSON.stringify(challenges));

    if (!user.admin) {
        ctx.res.writeHead(307, { Location: '/' });
        ctx.res.end();
        return { props: {} }
    }

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
    ).sort({ createdAt: -1 }).limit(100).toArray();

    const list = JSON.parse(JSON.stringify(inner));

    return {
        props: {
            admin: user.admin,
            totalUsers: totalUsers,
            totalRank: totalRank,
            totalAdmins: totalAdmins,
            users: list,
            admins: adminData,
            challenges: challengesData
        }
    }
}
