import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession } from 'next-auth/client';
import { NextSeo } from 'next-seo';
import prisma from '../../lib/prismaDB';
import { ChallangeBox } from '../components/ChallengeBox';
import { CompleteChallanges } from '../components/CompleteChallanges';
import { Countdown } from '../components/Countdown';
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from '../components/Profile';
import { Sidebar } from '../components/Sidebar';
import { ChallengeProvider } from '../contexts/ChallengesContext';
import { CountdownProvider } from '../contexts/CountdownContext';
import styles from '../styles/pages/Home.module.css';

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
        <NextSeo
          title="Move.it | Inicio"
          description="Complete os desafios pomodoro para melhorar seu dia."
          canonical="https://moveit-olliveer.vercel.app/"
          openGraph={{
            url: 'https://moveit-olliveer.vercel.app/',
            title: 'Move.it 2.0',
            description: 'O método Pomodoro é simples e dura duas horas. Primeiro, você realiza uma atividade durante 25 minutos. Quando acabar o tempo, descansa 5 minutos. Assim sucessivamente até que complete as duas horas. Como recompensa, você descansa mais 30 minutos.',
            images: [
              {
                url: 'share.png',
                width: 800,
                height: 600,
                alt: 'Logo Move.it',
              },
              {
                url: 'https://www.example.ie/share.png',
                width: 900,
                height: 800,
                alt: 'share image',
              },
              { url: 'https://www.example.ie/og-image-03.jpg' },
              { url: 'https://www.example.ie/og-image-04.jpg' },
            ],
            site_name: 'Move.it',
          }}
          twitter={{
            handle: '@olliveeer',
            site: '@olliveeer',
            cardType: 'summary_large_image',
          }}
        />

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
