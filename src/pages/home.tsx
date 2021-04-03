import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import { ChallangeBox } from '../components/ChallengeBox';
import { CompleteChallanges } from '../components/CompleteChallanges';
import { Countdown } from '../components/Countdown';
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from '../components/Profile';
import { Sidebar } from '../components/Sidebar';
import { ChallengeProvider } from '../contexts/ChallengesContext';
import { CountdownProvider } from '../contexts/CountdownContext';
import styles from '../styles/pages/Home.module.css';
import prisma from '../../lib/prismaDB';

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <ChallengeProvider
      level={props.level}
      currentExperience={props.currentExperience}
      challengesCompleted={props.challengesCompleted}
      session={props.session}
      user={props.user}
      rank={props.rank}
      challenges={props.challangesData}
    >
      <Sidebar admin={props.user.admin} />
      <div className={styles.container}>
        <Head>
          <title>Início | move.it</title>
        </Head>

        <ExperienceBar />
        <CountdownProvider>
          <section>
            <div>
              <Profile session={props.session} />
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
  // const { level, currentExperience, challengesCompleted } = ctx.req.cookies;
  const session = await getSession(ctx);

  if (!session) {
    ctx.res.writeHead(307, { Location: '/' });
    ctx.res.end();
    return { props: {} }
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const rank = await prisma.rank.findFirst({
    where: {
      userID: Number(user.id)
    }
  });
  
  const challangesData = await prisma.challenges.findMany();

  return {
    props: {
      // level: Number(level),
      // currentExperience: Number(currentExperience),
      // challengesCompleted: Number(challengesCompleted),
      session: session.user,
      user: JSON.parse(JSON.stringify(user)) ?? {},
      rank: JSON.parse(JSON.stringify(rank)) ?? {},
      admin: user.admin ?? null,
      challangesData: JSON.parse(JSON.stringify(challangesData))
    }
  }
}
