import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession, session, useSession } from 'next-auth/client';
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

interface HomeProps {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  
  return (
    <ChallengeProvider
      level={props.level}
      currentExperience={props.currentExperience}
      challengesCompleted={props.challengesCompleted}
      user={props.user}
    >
      <Sidebar />
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
  const { level, currentExperience, challengesCompleted } = ctx.req.cookies;
  const session = await getSession(ctx);

  if (!session) {
    ctx.res.writeHead(307, { Location: '/' });
    ctx.res.end();
    return { props: {} }
  }
  
  return {
    props: {
      level: Number(level),
      currentExperience: Number(currentExperience),
      challengesCompleted: Number(challengesCompleted),
      user: session.user
    }
  }
}
