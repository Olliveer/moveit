import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { ChallangeBox } from '../components/ChallengeBox';
import { CompleteChallanges } from '../components/CompleteChallanges';
import { Countdown } from '../components/Countdown';
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from '../components/Profile';
import { Sidebar } from '../components/Sidebar';
import { ChallengeProvider } from '../contexts/ChallengesContext';
import { CountdownProvider } from '../contexts/CountdownContext';
import styles from '../styles/pages/Home.module.css';
import { client, q } from '../util/faunaDb';
import { connectToDatabase } from '../util/mongodb';

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
 


  return (
    <ChallengeProvider
      level={props.level}
      currentExperience={props.currentExperience}
      challengesCompleted={props.challengesCompleted}
      user={props.user}
      userId={props.userId}
      rank={props.rank}
    >
      <Sidebar admin={props.admin} />
      <div className={styles.container}>
        <Head>
          <title>Início | move.it</title>
        </Head>

        <ExperienceBar />
        <CountdownProvider>
          <section>
            <div>
              <Profile session={props.user} />
              <CompleteChallanges />
              <Countdown />
            </div>

            <div>
              <ChallangeBox />
            </div>
          </section>
        </CountdownProvider>
      </div>
    </ChallengeProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const db = await connectToDatabase();

  // const { level, currentExperience, challengesCompleted } = ctx.req.cookies;
  const session = await getSession(ctx);

  if (!session) {
    ctx.res.writeHead(307, { Location: '/' });
    ctx.res.end();
    return { props: {} }
  }
  const userId = await client.query(q.Get(q.Match(q.Index('get_user_by_email'), [session.user.email])));
  const user = await db.collection('users').findOne({ email: session.user.email });
  const data = await db.collection('rank').find({ user_id: user._id }).toArray();
  const rank = JSON.parse(JSON.stringify(data));

  return {
    props: {
      // level: Number(level),
      // currentExperience: Number(currentExperience),
      // challengesCompleted: Number(challengesCompleted),
      user: session.user,
      userId: userId.data.id,
      rank: rank[0] ?? {},
      admin: user.admin ?? null
    }
  }
}
